const clientId = '02caa17c59374df4bf4e7610ccda40b2';
const redirectUri = 'http://localhost:3000';

let accessToken;

const Spotify = {
  getAccessToken(){
    if(accessToken) {
      return accessToken;
    }

    const newToken = window.location.href.match(/access_token=([^&]*)/);
    const expirationTime = window.location.href.match(/expires_in=([^&]*)/);

    if(newToken && expirationTime) {
      accessToken = newToken[1];
      const expiresIn = Number(expirationTime[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      let accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search (term) {
    let accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response =>{
        return response.json();
  }).then(jsonResponse => {
    if(!jsonResponse.tracks) {
      return [];
    }
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri}));
    });
  },

  savePlaylist(name, trackURIs){
    if(!name || !trackURIs.length) {
      return;
    }

  const accessToken = Spotify.getAccessToken();
  const headers = {Authorization: `Bearer ${accessToken}`};
  let userId;

  return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response =>
     response.json()
  ).then(jsonResponse => {
    userId = jsonResponse.id;
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                  headers: headers,
                  method: 'POST',
                  body: JSON.stringify({name: name})
}).then(response => response.json()).then(jsonResponse => {
  let playlistId = jsonResponse.id;
  return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify({uris: trackURIs})
  });
});
})
}
}
export default Spotify;
