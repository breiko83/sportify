import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import spotify from "spotify.js";

const Login = () => {
  const history = useHistory();

  const location = useLocation();
  const code = new URLSearchParams(location.search).get("code");

  if (code) {
    spotify
      .getToken(code)
      .then(({ data }) => {
        // save new tokes
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        history.push("/");
      })
      .catch(({response}) => console.log(response.data.error));
  }

  return (
    <>
      <button onClick={() => spotify.login()}>Login with Spotify</button>
    </>
  );
};
export default Login;
