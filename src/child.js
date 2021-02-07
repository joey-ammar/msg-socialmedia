import React from "react";
// in functon it is this
// export default function Child(props) {
//     console.log(props);
//     return <h1>Child component</h1>;
// }
//in class it is this.props
export default class Child extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("this.props: ", this.props);
        return <h1>Child Component</h1>;
    }
}
