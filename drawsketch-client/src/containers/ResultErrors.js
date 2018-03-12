import React from 'react';

class ResultErrors extends React.Component {
  render() {
    const errors = this.props.errors;

    if (errors) {
      return (
        <ul className="error-messages">
          {
            Object.keys(errors).map(key => {
              return (
                <li key={key}>
                  {key} {errors[key].toString()}
                </li>
              );
            })
          }
        </ul>
      );
    } else {
      return null;
    }
  }
}

export default ResultErrors;