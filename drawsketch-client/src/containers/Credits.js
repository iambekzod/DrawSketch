import React, { Component } from "react";
import "../style/form.css";

export default class Credits extends Component {

  render() {
    return (
      <div className="Credits">
        <h1>Credits</h1>
        <p>Team members: Bekzod Tursunov, Weiqiang Zhang, Shuyi Qiu</p>
        <h2>HTML, CSS and Javascript code</h2>
        <ul>
            <li>
              CSS components from <a href="https://reactstrap.github.io/">ReactStrap</a>
            </li>
            <li>
              Setup a MongoDB connection to our mLabs server using&nbsp;
              <a href="https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications">MongooseJS</a>
            </li>
            <li>Occasionaly&nbsp;
                <a href="http://stackoverflow.com/">Stackoverflow</a>
            </li>
        </ul>
        <h2>Icons</h2>
        <ul>
        </ul>
      </div>
    );
  }
}