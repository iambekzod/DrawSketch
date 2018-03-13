import React, { Component } from "react";
import "../style/form.css";

export default class Credits extends Component {

  render() {
    return (
      <div className="Credits">
        <h1>Credits</h1>
        <p>Team members: Bekzod Tursunov, Weiqiang Zhang, Shuyi Qiu</p>
        <h2>Icons</h2>
        <ul>
            <li>Arrow/Delete Icons made by
            </li>
        </ul>
        <h2>HTML, CSS and Javascript code</h2>
        <ul>
            <li>Occasionaly&nbsp;
                <a href="http://stackoverflow.com/">Stackoverflow</a>
            </li>
        </ul>
      </div>
    );
  }
}