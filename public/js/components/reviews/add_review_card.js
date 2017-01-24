import React from 'react';

class AddReviewCard extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    window.location = `/address/${this.props.address}/reviews/new`;
  }

  render() {
    return (
      <div className={"col s12 " + this.props.size} onClick={this.handleClick}>
        <div className="card add-action-card orange darken-2">
          <div className="card-content white-text">
            <p>Have you rented this location in the past?</p>
            <p>Let others know how your experience was!</p>
          </div>
          <div className="card-action add-action-card">
            <a href="#">Review this location</a>
          </div>
        </div>
      </div>
    );
  }
}

export default AddReviewCard
