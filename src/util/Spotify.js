const cID = "21473fbaad414e2f84855793238bbaf3";
const redirectUri = "http://localhost:3000/";
let accessToken;
let expirationTime;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expirationTimeMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch !== null && expirationTimeMatch !== null) {
      accessToken = accessTokenMatch[1];
      expirationTime = Number(expirationTimeMatch[1]);
      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const requestingUrl = "https://accounts.spotify.com/authorize/?client_id=" + cID + "&response_type=token&redirect_uri=" + redirectUri;
      window.location = requestingUrl;
    }
  },

  get accessToken() {
    return accessToken;
  },

  search(term) {
    if (!accessToken) {
      console.log("No access token, look! " + accessToken);
      accessToken = Spotify.getAccessToken();
    }
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          });
        })
      } else {
        return [];
      }
    })
  },

  savePlaylist(playlistName, playlistTracks) {
    if (!playlistName || !playlistTracks) {
      return;
    }
    accessToken = Spotify.getAccessToken();
    let headers = {Authorization: `Bearer ${accessToken}`};
    let userID;
    let playlistID;
    return fetch(`https://api.spotify.com/v1/me`, {headers: headers}).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response2 => {
        return response2.json();
      }).then(jsonResponse2 => {
        playlistID = jsonResponse2.id;
        headers = {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({"uris": playlistTracks})
        });
      });
    });
  }
}
export default Spotify;
