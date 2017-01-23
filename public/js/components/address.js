import React from 'react';

class Address extends React.Component {
  constructor() {
    super();
  }


  render() {
    return (
      <div className="col s12 m6 l3">
        <div className="card address-card light-green darken-1">
          <div className="card-content white-text">
            <p>
              <b className="truncate">{this.props.data.street_addr}</b><br/>
              {this.props.data.city + ', ' + this.props.data.province}<br/>
              {this.props.data.postal_code}<br/>
              {this.props.data.country}
            </p>
          </div>
          <div className="card-action green-text">
            <a>{this.props.data.avg_rating + ' / 5'}</a>
            <a href="#">{this.props.data.total_reviews + " Reviews"}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Address
