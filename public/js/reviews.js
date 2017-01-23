import React from 'react';
import ReactDOM from 'react-dom';
import * as SuperAgent from 'superagent';

class Review extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="col s6 m6 l4">
        <div className="card-panel light-green darken-1">
          <div className="card-content white-text">
            <p>
              {this.props.text}<br/><br/>
              {this.props.rating + ' / 5'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}

class Reviews extends React.Component {
  constructor() {
    super();

    this.state = {
      id: window.location.pathname.split('/')[2],
      reviews: [],
      avg_rating: ''
    }
  }

  setInitialState() {
    SuperAgent.get(`/reviews/${this.state.id}`)
    .then(
      (res) => {
        this.setState({reviews: res.body.hits.hits, avg_rating: res.body.aggregations.avg_rating.value});
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
        <center><h3 className="app-title">Rental Reviews</h3></center>
        <div className="row">
          {this.state.reviews.map((review) => {
            return <Review key={review._id} text={review._source.review} rating={review._source.rating}/>
          })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Reviews />, document.getElementById('address'));
