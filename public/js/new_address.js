import React from 'react';
import ReactDOM from 'react-dom';

class NewAddress extends React.Component {
  constructor() {
    super();
  }

  handleAddClick() {
    // Validate non empty input
    let inputs = document.querySelectorAll('input.add-address-input')

    // Make AJAX call to add to server

    // Change location to adding a review
  }

  render() {
    return (
      <div className="container">
        <center><h4 className="app-title">Add a new location</h4></center>
        <div className="row">
          <div className="input-field col s12 m12 l12">
            <input placeholder="200 University Avenue" id="street_addr" type="text" className="add-address-input street_addr"></input>
            <label htmlFor="street_addr">Street Address</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12 m6 l6">
            <input placeholder="Waterloo" id="city" type="text" className="add-address-input city"></input>
            <label htmlFor="city">City</label>
          </div>

          <div className="input-field col s12 m6 l6">
            <input placeholder="Ontario" id="province" type="text" className="add-address-input province"></input>
            <label htmlFor="province">Province</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12 m6 l6">
            <input placeholder="N2R 4X6" id="postal_code" type="text" className="add-address-input postal_code"></input>
            <label htmlFor="postal_code">Postal Code</label>
          </div>

          <div className="input-field col s12 m6 l6">
            <input placeholder="Canada" id="country" type="text" className="add-address-input country"></input>
            <label htmlFor="country">Country</label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m6 l4">
            <a className="waves-effect waves-light btn add-address-button" onClick={this.handleAddClick}>Add</a>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<NewAddress />, document.getElementById('new_address'));
