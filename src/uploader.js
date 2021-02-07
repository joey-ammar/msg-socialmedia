import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            file: null,
        };
    }
    componentDidMount() {
        console.log("Im uploader");
    }
    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
        console.log("files", this.file);
    }
    // methodInUploader() {
    //     this.props.methodInApp("whoa");
    // }
    //uploading
    upload() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("response", data);
                this.props.methodInApp(data.imageUrl);
                this.props.toggleModal();
            })
            .catch((error) => {
                console.log("You are error uploader", error);
            });
    }
    closeModal() {
        console.log("closing modal");
        this.props.toggleModal();
    }
    render() {
        return (
            <div>
                <small onClick={() => this.closeModal()}>X</small>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="file"
                    type="file"
                    accept="jpg/*"
                />
                <button onClick={() => this.upload()}> Upload </button>
            </div>
        );
    }
}
