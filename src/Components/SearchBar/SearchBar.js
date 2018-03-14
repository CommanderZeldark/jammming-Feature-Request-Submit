import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchTerm: ""}
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.login = this.login.bind(this);
  }

  search() {
    this.props.onSearch(this.state.searchTerm);
  }

  handleTermChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  login() {
    this.props.login();
  }

  render() {
    return (
      <div className="SearchBar">
        {this.props.authenticated ? <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} /> : <h1> </h1>}
        {this.props.authenticated ? <a onClick={this.search}>SEARCH</a> : <a onClick={this.login}>Spotify Login</a>}
      </div>
    )
  }

}

export default SearchBar;
