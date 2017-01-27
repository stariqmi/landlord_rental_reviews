import React from 'react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';
import 'materialize-css/js/materialize.js';
import SuperAgent from 'superagent';

// components
import Navigation from './components/navigation.js';
import InputField from './components/new_address/input_field.js';

class NewAddress extends React.Component {
  constructor() {
    super();
  }

  handleAddClick() {
    // Validate non empty input
    let errors = false;
    let data = {};
    let inputs = document.querySelectorAll('input.add-address-input');
    _.each(inputs, (input) => {

      input.classList.remove('error-input');

      if (input.value.length < 1) {
        errors = true;
        input.classList.add('error-input');
      }
      else {
        data[input.id] = input.value;
      }
    });

    if (errors) {
      Materialize.toast('The fields in red are required!', 2000, 'error-toast');
      return;
    }
    else {
      // Make AJAX call to add to server
      SuperAgent.post("/address/new")
      .send(data)
      .end((err, res) => {
        if (err) {
          Materialize.toast('Something went wrong, please try again', 2000, 'error-toast');
        }
        else {
          Materialize.toast('You can now add reviews for this location!', 600, 'success-toast');
          setTimeout(() => {window.location = `/address/${res.body._id}/reviews`}, 700);
        }
      });
    }
  }

  render() {
    return (
      <div>
        <Navigation />
        <div className="container">

          <h4 className="app-title">add a new location</h4>
          <div className="row">
            <InputField
              responsive="s12 m12 l12"
              placeholder="200 University Avenue"
              id="street_addr"
              classNames="add-address-input street_addr"
              htmlFor="street_addr"
              label="Street Address"
            />
          </div>

          <div className="row">
            <InputField
              responsive="s12 m6 l6"
              placeholder="Waterloo"
              id="city"
              classNames="add-address-input city"
              htmlFor="city"
              label="City"
            />

            <InputField
              responsive="s12 m6 l6"
              placeholder="Ontario"
              id="province"
              classNames="add-address-input province"
              htmlFor="province"
              label="Province"
            />
          </div>

          <div className="row">
            <InputField
              responsive="s12 m6 l6"
              placeholder="N2R 4X6"
              id="postal_code"
              classNames="add-address-input postal_code"
              htmlFor="postal_code"
              label="Postal Code"
            />

            <InputField
              responsive="s12 m6 l6"
              placeholder="Canada"
              id="country"
              classNames="add-address-input country"
              htmlFor="country"
              label="Country"
            />
          </div>

          <div className="row">
            <div className="col s12 m6 l4">
              <a className="waves-effect waves-light btn add-address-button" onClick={this.handleAddClick}>Add</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<NewAddress />, document.getElementById('new_address'));
