import React from 'react';
import { UncontrolledAlert } from 'reactstrap';

class ResultErrors extends React.Component {
  render() {
    const errors = this.props.errors;

    if (errors) {
      return (
        <div className="error-messages">
          {
            Object.keys(errors).map(key => {
              return (
                <UncontrolledAlert key={key} color="danger">
                  {key} {errors[key].toString()}
                </UncontrolledAlert>
              );
            })
          }
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ResultErrors;