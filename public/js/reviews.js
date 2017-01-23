import React from 'react';
import ReactDOM from 'react-dom';
import * as SuperAgent from 'superagent';

// components
import Review from './components/review.js'

class Reviews extends React.Component {
  constructor() {
    super();

    this.state = {
      id: window.location.pathname.split('/')[2],
      address: {
        street_addr: ''
      },
      reviews: [],
      avg_rating: ''
    }
  }

  setInitialState() {
    SuperAgent.get(`/reviews/${this.state.id}`)
    .then(
      (res) => {
        this.setState({
          reviews: res.body.hits.hits,
          avg_rating: res.body.aggregations.avg_rating.value
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
    return (
      <div className="container">
        <center><h4 className="app-title">Reviews for {this.state.address.street_addr} - {parseInt(this.state.avg_rating).toFixed(2)} / 5</h4></center>
        <div className="row">
          {this.state.reviews.map((review) => {
            return <Review
              key={review._id}
              text={review._source.review}
              rating={review._source.rating}
              added_at={review._source.added_at}
            />
          })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Reviews />, document.getElementById('address'));
