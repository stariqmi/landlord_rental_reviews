import React from 'react';
import ReactDOM from 'react-dom';
import * as SuperAgent from 'superagent';

// components
import Review from './components/review.js'
import AddReviewCard from './components/reviews/add_review_card.js'

class Reviews extends React.Component {
  constructor() {
    super();

    this.state = {
      id: window.location.pathname.split('/')[2],
      address: {
        street_addr: ''
      },
      reviews: [],
      avg_rating: 0
    }
  }

  setInitialState() {
    SuperAgent.get(`/reviews/${this.state.id}`)
    .then(
      (res) => {
        this.setState({
          reviews: res.body.hits.hits,
          avg_rating: parseInt(res.body.aggregations.avg_rating.value).toFixed(1)
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

  componentDidMount() {
    this.setInitialState();
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

    components.push(<AddReviewCard key="add-review" address={this.state.id} size="l4 m6" />);

    console.log(this.state.avg_rating);
    return (
      <div>
        <nav>
          <div className="nav-wrapper orange darken-2">
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="/"><i className="material-icons">search</i></a></li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <h4 className="app-title">Reviews for <span className="app-title-green">{this.state.address.street_addr}</span></h4>
          {
            (this.state.avg_rating && !isNaN(this.state.avg_rating)) ? <h6 className="app-title-green">Average Rating {this.state.avg_rating} / 5.0</h6> : ''
          }
          <div className="row">
            { components }
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Reviews />, document.getElementById('address'));
