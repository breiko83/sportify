import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import spotify from "spotify.js";

const Player = () => {

  const [device, setDevice] = useState();
  let player;

  window.onSpotifyWebPlaybackSDKReady = () => {
    console.log("player is ready");

    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      player = new window.Spotify.Player({
        name: "Sportify Web Player",
        getOAuthToken: (cb) => {
          cb(access_token);
        },
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", (state) => {
        //console.log(state);
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDevice(device_id);
        spotify.transferPlayback(device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {        
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      player.connect().then((success) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );

          player.togglePlay().then(() => {
            console.log('Toggled playback!');
          });
        }
      });
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          spotify.play(device)
        }
      >
        Play
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => spotify.pause()}
      >
        Pause
      </Button>

    </div>
  );
};

export default Player;
