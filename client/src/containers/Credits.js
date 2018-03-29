import React, { Component } from "react";
import "../style/form.css";

import { inject, observer } from "mobx-react";

class Credits extends Component {

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
              Deploying React App + Node Express together as One App https://daveceddia.com/create-react-app-express-production/
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
          <li>
            <div>Lock/Unlock Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="#">CC 3.0 BY</a></div>
          </li>
        </ul>
      </div>
    );
  }
}

export default Credits = inject('userStore', 'authStore', 'lobbyStore')(observer(Credits))