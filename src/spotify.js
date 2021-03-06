import axios from "axios";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const SCOPES =
  "user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-read-currently-playing";

const spotify = {
  login: () => {
    const url =
      "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      process.env.REACT_APP_SPOTIFY_CLIENT_ID +
      (SCOPES ? "&scope=" + encodeURIComponent(SCOPES) : "") +
      "&redirect_uri=" +
      encodeURIComponent(REDIRECT_URI);

    window.location.replace(url);
  },
  getToken: (code) => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
    params.append("client_secret", process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);

    return axios.post("https://accounts.spotify.com/api/token", params);
  },
  refreshToken: (callback) => {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", localStorage.getItem("refresh_token"));
    params.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
    params.append("client_secret", process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);

    return axios
      .post("https://accounts.spotify.com/api/token", params)
      .then(({ data }) => {
        // save new tokes
        console.log("received new token: ", data);
        localStorage.setItem("access_token", data.access_token);
        callback();
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  },
  getRecommendations: (genres, cadence) => {
    console.log(genres, cadence);
    const access_token = localStorage.getItem("access_token");
    const params = {
      seed_genres: genres.join(","),
      type: "track",
      min_tempo: cadence * 2 - 5,
      max_tempo: cadence * 2 + 5,
    };
    return axios
      .get("https://api.spotify.com/v1/recommendations", {
        params,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => data.tracks)
      .catch(({ response }) => {
        console.log(response.data.error);

        if (response.data.error.status === 401)
          spotify.refreshToken(spotify.getRecommendations(genres));
        return [];
      });
  },
  getAvailableGenreSeeds: () => {
    const access_token = localStorage.getItem("access_token");
    return axios
      .get("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => data.genres)
      .catch(({ response }) => {
        console.log(response.data.error);

        if (response.data.error.status === 401)
          spotify.refreshToken(spotify.getAvailableGenreSeeds());
        return [];
      });
  },
  playerInfo: () => {
    const access_token = localStorage.getItem("access_token");

    return axios
      .get("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => data)
      .catch(({ response }) => {
        console.log(response.data.error);

        if (response.data.error.status === 401)
          spotify.refreshToken(spotify.playerInfo());
        return [];
      });
  },
  currentlyPlaying: () => {
    const access_token = localStorage.getItem("access_token");
    return axios
      .get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => data.item)
      .catch(({ response }) => {
        console.log(response.data.error);

        if (response.data.error.status === 401)
          spotify.refreshToken(spotify.currentlyPlaying());
        return [];
      });
  },
  getDevices: () => {
    const access_token = localStorage.getItem("access_token");
    const params = {};

    return axios
      .get("https://api.spotify.com/v1/me/player/devices", {
        params,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => data.devices)
      .catch(({ response }) => {
        console.log(response.data.error);

        if (response.data.error.status === 401)
          spotify.refreshToken(spotify.getDevices());
        return [];
      });
  },
  transferPlayback: (device_id) => {
    const access_token = localStorage.getItem("access_token");

    return axios.put(
      "https://api.spotify.com/v1/me/player",
      { device_ids: [device_id], play: true },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  },
  play: (
    device_id = localStorage.getItem("device"),
    uris = JSON.parse(localStorage.getItem("recommendations")).map(
      (item) => item.uri
    ),
    offset = 0
  ) => {
    const access_token = localStorage.getItem("access_token");
    const params = {
      device_id: device_id,
      uris: uris,
      offset: { position: offset },
    };

    console.log(params);

    return axios
      .put("https://api.spotify.com/v1/me/player/play", params, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .catch(({ response }) => console.log(response.data.error));
  },
  pause: () => {
    const access_token = localStorage.getItem("access_token");
    const params = {};

    return axios
      .put("https://api.spotify.com/v1/me/player/pause", params, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .catch(({ response }) => console.log(response.data.error));
  },
  next: () => {
    const access_token = localStorage.getItem("access_token");
    const params = {};

    return axios
      .post("https://api.spotify.com/v1/me/player/next", params, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .catch(({ response }) => console.log(response.data.error));
  },
  previous: () => {
    const access_token = localStorage.getItem("access_token");
    const params = {};

    return axios
      .post("https://api.spotify.com/v1/me/player/previous", params, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .catch(({ response }) => console.log(response.data.error));
  },
  userProfile: () => {
    const access_token = localStorage.getItem("access_token");
    return axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((data) => console.log(JSON.stringify(data)))
      .catch(({ response }) => console.log(response.data.error));
  },
  getAudioFeatures: (id) => {
    const access_token = localStorage.getItem("access_token");
    console.log(id);

    return axios
      .get(`https://api.spotify.com/v1/audio-features/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .catch(({ response }) => console.log(response.data.error));
  },
};

export default spotify;
