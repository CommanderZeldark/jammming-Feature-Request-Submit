import React from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import loginFalse from '../../Images/loginFalse.jpg';
import loginTrue from '../../Images/loginTrue.jpg';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "Jammming Tracks",
      playlistTracks: [],
      authenticated: false,
      styles: {backgroundImage: 'url('+loginFalse+')'}
    };
    this.login = this.login.bind(this);
    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  login() {
    Spotify.getAccessToken();
    this.setState({
      authenticated: true,
      styles: {backgroundImage: 'url('+loginTrue+')'}
    });
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      let playlistIds = this.state.playlistTracks.map(song => song.id);
      let filteredTracks = [];
      tracks.forEach(song => {
        if (!playlistIds.includes(song.id)) {
          filteredTracks.push(song);
        }
      });
      this.setState({searchResults: filteredTracks});
    });
  }

  addTrack(track) {
    let newPlaylist = this.state.playlistTracks;
    let playlistIds = newPlaylist.map(song => song.id);
    if (!playlistIds.includes(track.id)) {
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks;
    let playlistIds = newPlaylist.map(song => song.id);
    let songId = playlistIds.indexOf(track.id);
    if (playlistIds.includes(track.id)) {
      newPlaylist.splice(songId, 1);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(song => song.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: "Next Playlist",
        playlistTracks: []
      });
    });
  }

  componentDidMount() {
    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expirationTimeMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch !== null && expirationTimeMatch !== null) {
      this.login();
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App" style={this.state.styles}>
          <SearchBar onSearch={this.search} login={this.login} authenticated={this.state.authenticated} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} isRemoval={false} onAdd={this.addTrack} />
            <Playlist tracks={this.state.playlistTracks} isRemoval={true} onRemove={this.removeTrack} name={this.state.playlistName} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
