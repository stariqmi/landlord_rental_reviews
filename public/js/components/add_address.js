import React from 'react';

class AddAddress extends React.Component {
  constructor() {
    super();
  }

  handleClick() {
    window.location = '/address/new';
  }

  render() {
    return (
      <div className={"col s6 m4 " + this.props.size} onClick={this.handleClick}>
        <div className="card add-action-card orange darken-2">
          <div className="card-content white-text">
            <p>Cannot find what the location you are looking for?</p><br/><br/>
          </div>
          <div className="card-action add-action-card">
            <a href="#">Add a new rental location</a>
          </div>
        </div>
      </div>
    );
  }
}

export default AddAddress
