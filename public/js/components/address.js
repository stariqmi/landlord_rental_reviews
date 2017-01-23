import React from 'react';

class Address extends React.Component {
  constructor() {
    super();
  }

  handleClick(id) {
    window.location = `/address/${id}/reviews`;
  }

  render() {
    return (
      <div className="col s6 m4 l3" onClick={this.handleClick.bind(this, this.props.data.id)}>
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
            <a href={"/address/" + this.props.data.id + "/reviews"}>{this.props.data.total_reviews + " Reviews"}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Address
