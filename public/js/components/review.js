import React from 'react';

class Review extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="col s12 m6 l4">
        <div className="card-panel light-green darken-1">
          <div className="card-content white-text">
            <p>{this.props.text}</p>
            <p>{this.props.rating + ' / 5'}</p>
            <p>{this.props.added_at}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Review;
