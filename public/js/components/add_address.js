import React from 'react';

class AddAddress extends React.Component {
  constructor() {
    super();
  }


  render() {
    return (
      <div className={"col s12 m6 " + this.props.size}>
        <div className="card add-action-card orange darken-2">
          <div className="card-content white-text">
            <span class="card-title">Cannot find what the location you are looking for?</span>
            <p></p><br/><br/>
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
