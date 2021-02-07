import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wBio: null,
            edit: false,
        };
    }

    handleChange(e) {
        this.setState({
            wBio: e.target.value,
        });
    }
    bioChanger() {
        this.setState({
            edit: false,
        });
        console.log("This is my state: ", this.state);
        axios
            .post("/bioSaving", this.state)
            .then(({ data }) => {
                console.log("This is the data: ", data);
                this.props.saveBio(data.bio);
            })
            .catch((error) => {
                console.log("Error in axios.post /bioSaving: ", error);
            });
    }
    render() {
        return (
            <div className="bio-edit">
                {!this.props.bio && (
                    <div
                        id="makeBio"
                        className="add"
                        onClick={() => this.setState({ edit: true })}
                    >
                        Add your biography
                    </div>
                )}
                {this.props.bio && (
                    <div className="showbio">
                        <div id="bio">{this.props.bio}</div>
                        <div
                            id="editingBio"
                            className="editingBio"
                            onClick={() => this.setState({ edit: true })}
                        >
                            Edit your Bio
                        </div>
                    </div>
                )}
                {this.state.edit && (
                    <div className="enterbio">
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button
                            id="btnSave"
                            onClick={(e) => this.bioChanger(e)}
                        >
                            Save
                        </button>{" "}
                    </div>
                )}
            </div>
        );
    }
}
