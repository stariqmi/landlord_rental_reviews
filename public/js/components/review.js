import React from 'react';
import moment from 'moment';

class Review extends React.Component {
  constructor() {
    super();

    this.showFullReview = this.showFullReview.bind(this)
  }

  showFullReview() {
    let modal = $('#review-modal')
    modal.find('.modal-content p').text(this.props.data.review);
    modal.modal('open');
  }

  render() {
    return (
      <div className="col s12 m6 l4 review-card" onClick={this.showFullReview}>
        <div className="card-panel light-green darken-1">
          <div className="card-content white-text">
            <p className="truncate">{this.props.data.review}</p>
            <p><b>{this.props.data.rating + ' / 5'}</b></p>
            <p>{moment(this.props.data.added_at).format('YYYY-MM-DD')}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Review;
