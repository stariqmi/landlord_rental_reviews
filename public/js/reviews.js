import React from 'react';
import ReactDOM from 'react-dom';
import * as SuperAgent from 'superagent';
import * as _ from 'lodash';
import 'materialize-css/js/materialize.js';
import moment from 'moment';

// components
import Review from './components/review.js'
import AddReviewCard from './components/reviews/add_review_card.js'

class Reviews extends React.Component {
  constructor() {
    super();

    this.onAddReviewHandle = this.onAddReviewHandle.bind(this);
    this.loadMoreReviews = this.loadMoreReviews.bind(this);

    this.state = {
      id: window.location.pathname.split('/')[2],
      address: {
        street_addr: ''
      },
      reviews: [],
      avg_rating: 0,
      total: 0,
      cursor: 0
    }
  }

  loadMoreReviews() {
    SuperAgent.get(`/reviews/${this.state.id}?from=${this.state.cursor}`)
    .then(
      (res) => {
        let new_reviews = _.concat(this.state.reviews, res.body.hits.hits);


        this.setState({
          cursor: this.state.cursor + 10,
          reviews: new_reviews
        });
      },
      () => {
        // throw new error
      }
    )
  }

  setInitialState() {
    SuperAgent.get(`/reviews/${this.state.id}`)
    .then(
      (res) => {
        this.setState({
          reviews: res.body.hits.hits,
          total: res.body.hits.total,
          cursor: 10,
          avg_rating: parseFloat(res.body.aggregations.avg_rating.value).toFixed(1)
        });
      },
      () => {
        // throw new error
      }
    )

    // Show address
    SuperAgent.get(`/address/${this.state.id}`)
    .then(
      (res) => {
        this.setState({
          address: res.body.hits.hits[0]._source
        });
      },
      () => {
        // throw new error
      }
    )
  }

  onAddReviewHandle() {

    let errors = false;
    let review_field = document.querySelector('textarea');
    let rating_field = document.querySelector('input[type=number]');

    let review = review_field.value;
    let rating = rating_field.value;

    if (review == '') { errors = true; review_field.classList.add('error-input') }
    if (rating == '') { errors = true; rating_field.classList.add('error-input') }

    if (errors) {
      Materialize.toast('The fields in red are required!', 2000, 'error-toast');
    }
    else {
      // Make AJAX call to add to server
      SuperAgent.post(`/address/${this.state.id}/reviews/new`)
      .send(
        {
          review: review,
          rating: rating,
          added_at: moment().format('YYYY-MM-DD')
        }
      )
      .end((err, res) => {
        if (err) {
          Materialize.toast('Something went wrong, please try again', 2000, 'error-toast');
        }
        else {
          review_field.value = "";
          rating_field.value = "";
          Materialize.toast('You added a review for this location!', 600, 'success-toast');
          setTimeout(() => { this.setInitialState() }, 700);
        }
      });
    }

  }

  componentDidMount() {
    this.setInitialState();
    $('#review-modal').modal();
  }

  render() {

    let components = this.state.reviews.map((review) => {
      return <Review
        key={review._id}
        text={review._source.review}
        rating={review._source.rating}
        added_at={review._source.added_at}
      />
    });

    // components.push(<AddReviewCard key="add-review" address={this.state.id} size="l4 m6" />);

    return (
      <div>
        <nav>
          <div className="nav-wrapper orange darken-2">
            <ul id="nav-mobile" className="right">
              <li><a href="/"><i className="material-icons">search</i></a></li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <h4 className="app-title">reviews for <span className="app-title-green">{this.state.address.street_addr}</span></h4>
          {
            (this.state.avg_rating && !isNaN(this.state.avg_rating)) ? <h6 className="app-title-green">Average Rating {this.state.avg_rating} / 5.0</h6> : ''
          }
          <div className="row">
            <div className="input-field col s12 m12 l12">
              <textarea id="review" className="materialize-textarea"></textarea>
              <label htmlFor="review-textarea">How was your experience at this location?</label>
            </div>
          </div>
          <div className="row">
            <div className="new-review input-field col s12 m6 l6">
              <input placeholder="Whole number please!" id="rating" type="number" className="rating" max="5" min="0" step="1"></input>
              <label htmlFor="rating">How would you rate it from 1 to 5?</label>
            </div>
            <div className="new-review col s12 m6 l6">
              <a className="waves-effect waves-light btn add-review-button" onClick={this.onAddReviewHandle}>Add Review</a>
            </div>
          </div>
          <div className="row">
            { components }
          </div>
          <div className="row">
            <div className="col s12 m12 l12">
              <center>
                {
                  (this.state.cursor <= this.state.total) ? <a className="waves-effect waves-light btn orange darken-1" onClick={this.loadMoreReviews}>Load more reviews</a>: ''
                }
              </center>
            </div>
          </div>

          <div id="review-modal" className="modal">
            <div className="modal-content">
              <p>A bunch of text</p>
            </div>
            <div className="modal-footer">
              <a href="#!" className=" modal-action modal-close waves-effect btn-flat">Close</a>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

ReactDOM.render(<Reviews />, document.getElementById('address'));
