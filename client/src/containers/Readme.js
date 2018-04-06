import marked from "marked";
import React, {Component} from 'react'
import "../style/App.css";

class Readme extends Component{
    constructor(props) {
        super(props);
        this.state = {
            markdown: {}
        };
    }
    componentWillMount() {
        const readmePath = require("../API.md");
    
        fetch(readmePath)
        .then(response => {
            return response.text()
        })
        .then(text => {
            this.setState({
            markdown: marked(text)
            })
        })
    }

    render() {
        const { markdown } = this.state;
      
        return (
          <section className="read-me">
            <article dangerouslySetInnerHTML={{__html: markdown}}></article>
          </section>
        )
    }
}

export default Readme;
