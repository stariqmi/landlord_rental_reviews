import React from 'react';

class Address extends React.Component {
  constructor() {
    super();
  }

  handleClick(id) {
    window.location = `/address/${id}/reviews`;
  }

  render() {

    let owner_info = false;
    let inner_hits = this.props.data.inner_hits

    if (inner_hits && inner_hits.reviews.hits.total > 0) {
      owner_info = this.props.data.inner_hits.reviews.hits.hits[0]._source.owner_name;
    }

    return (
      <div className="col s12 m4 l3" onClick={this.handleClick.bind(this, this.props.data.id)}>
        <div className="card address-card light-green darken-1">
          <div className="card-content white-text">
            <p>
              <b className="truncate">{this.props.data.street_addr}</b><br/>
              {this.props.data.city + ', ' + this.props.data.province}<br/>
              {this.props.data.postal_code}<br/>
              {this.props.data.country}<br/>
              Owner Name: {owner_info || 'N/A'}
            </p>
          </div>

        </div>
      </div>
    );
  }
}

let review_html = 0 ;
/*
<div className="card-action green-text">
  <a href={"/address/" + this.props.data.id + "/reviews"}>{this.props.data.total_reviews + " Reviews"}</a>
</div>
*/

export default Address
