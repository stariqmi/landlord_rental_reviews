import React from 'react';
import ReactDOM from 'react-dom';
import * as SuperAgent from 'superagent';

// components
import Address from './components/address.js';
import AddAddress from './components/add_address.js';

class SearchApp extends React.Component {

  constructor() {
    super();

    this.state = {
      data: [],
      changeTimer: null,
    }

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  setInitialState() {
    SuperAgent.get('/addresses?city=waterloo&limit=7')
    .then(
      (res) => {
        this.setState({data: res.body.addresses});
      },
      () => {
        // throw new error
      }
    )
  }

  getSearchResults(searchString) {
    SuperAgent.get(`/addresses?full_addr=${searchString}`)
    .then(
      (res) => {
        this.setState({data: res.body.addresses});
      },
      () => {
        // throw new error
      }
    )
  }

  componentDidMount() {
    this.setInitialState()
  }

  handleSearchChange(event) {
    let current = event.target.value;

    if (this.state.changeTimer !== null) clearTimeout(this.state.changeTimer);

    this.setState({
      changeTimer: setTimeout(() => {
        this.getSearchResults(current);
        this.setState({changeTimer: null});
      },300)
    });
  }

  render() {

    let components = this.state.data.map( (address) => {
      return <Address key={address.id} data={address} />
    });

    let add_size = components.length ? 'l3' : 'l4';
    components.push(<AddAddress key="1" size={add_size}/>);

    return (
      <div className="container">
        <div className="row">
          <div className="col s12 m12 l12">
            <center><h3 className="app-title">find rental reviews</h3></center>
            <div className="row">
              <div className="input-field col s12 offset-m1 m10 offset-l2 l8">
                <input placeholder="Type an address ..." type="text" onChange={this.handleSearchChange}></input>
              </div>
            </div>
          </div>
          <div className="row">
            {components}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<SearchApp />, document.getElementById('search'));
