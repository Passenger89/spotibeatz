let ACCESS_TOKEN
const CLIENT_ID = 'de66fceca7a945dcaa683a00d84af221'
const REDIRECT_URI = 'https://spotibeatz.netlify.app'

const Spotify = {
  getAccessToken() {
    if (ACCESS_TOKEN) {
      return ACCESS_TOKEN
    }

    // Check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    if (accessTokenMatch && expiresInMatch) {
      ACCESS_TOKEN = accessTokenMatch[1]
      const expiresIn = Number(expiresInMatch[1])
      // This clears the parameters, allowing us to grab a new access token when it expires
      window.setTimeout(() => (ACCESS_TOKEN = ''), expiresIn * 1000)
      window.history.pushState('Access Token', null, '/')
      return ACCESS_TOKEN
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`
      window.location = accessURL
    }
  },

  async search(term) {
    const ACCESS_TOKEN = await Spotify.getAccessToken()
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    )
    const jsonResponse = await response.json()
    if (!jsonResponse.tracks) {
      return []
    }
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }))
  },

  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) return

    const ACCESS_TOKEN = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` }
    let USER_ID
    // Gets user's Spotify username
    const userNameResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: headers,
    })
    const jsonUserNameResponse = await userNameResponse.json()
    USER_ID = jsonUserNameResponse.id

    // Creates a new playlist in user's account and returns playlist ID
    const playlistNameResponse = await fetch(
      `https://api.spotify.com/v1/users/${USER_ID}/playlists`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: playlistName }),
      }
    )
    const jsonPlaylistNameResponse = await playlistNameResponse.json()
    const playlistNameId = await jsonPlaylistNameResponse.id

    const playlistUrisResponse = await fetch(
      `https://api.spotify.com/v1/users/${USER_ID}/playlists/${playlistNameId}/tracks`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackUris }),
      }
    )
    const jsonPlaylistUrisResponse = await playlistUrisResponse.json()
    const playlistUrisId = await jsonPlaylistUrisResponse.id

    return { playlistNameId, playlistUrisId }
  },
}

export default Spotify
