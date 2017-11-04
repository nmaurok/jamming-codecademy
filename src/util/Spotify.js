const appClientID = "78ef8cf59bf4450d86bf1dfe1c6d498d";
const appRedirectURI = "http://localhost:3000/";

var accessToken;

const Spotify = {
  getAccessToken(){
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch){
      accessToken = accessTokenMatch[1];
      const expires = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expires * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${appClientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${appRedirectURI}`;
      window.location = accessUrl;
    }
  },

  search(term){
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer $(accessToken)`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      console.log(jsonResponse.tracks.items);
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    });
  },

  savePlaylist(name, trackURIs){
    if (!name || !trackURIs.length) {
      return;
    }

    const access = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${access}` };
    let userID;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        });
      });
    });
  }
};

export default Spotify;
