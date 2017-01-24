import React from 'react';
import moment from 'moment';

class Review extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="col s12 m6 l4">
        <div className="card-panel light-green darken-1">
          <div className="card-content white-text">
            <p className="truncate">{this.props.text}</p>
            <p><b>{this.props.rating + ' / 5'}</b></p>
            <p>{moment(this.props.added_at).format('YYYY-MM-DD')}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Review;
