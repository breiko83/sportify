import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Vinyl from "./Vinyl";
import Controls from "components/controls/Controls";
import Devices from "components/player/Devices";
import spotify from "spotify.js";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@material-ui/icons";
import styles from "./Player.module.css";

import Chip from "@material-ui/core/Chip";

const Player = () => {
  const [device, setDevice] = useState(localStorage.getItem("device"));
  const [devices, setDevices] = useState([]);
  const [label, setLabel] = useState();
  const [tempo, setTempo] = useState();
  const [currentTrack, setCurrentTrack] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextRefresh, setNextRefresh] = useState(500);

  // get player status on refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      spotify.playerInfo().then((data) => {
        if (data?.item) {
          // clear previous interval
          clearInterval(intervalId);

          setIsPlaying(data.is_playing);
          setCurrentTrack(data.item);
          const delay = data.item.duration_ms - data.progress_ms;
          console.log(delay);
          setNextRefresh(delay || 5000);
        }
      });
    }, nextRefresh);
    return () => clearInterval(intervalId);
  });

  useEffect(() => {
    if (currentTrack) {
      // set track Label
      setLabel(currentTrack.album.images[0].url);

      // get track Tempo
      spotify
        .getAudioFeatures(currentTrack.id)
        .then(({ data }) => data && setTempo(data.tempo));
    }
  }, [currentTrack]);

  useEffect(() => {
    getDevices();
  }, []);

  function getDevices() {
    spotify.getDevices().then((devices) => {
      setDevices(
        devices.map((device) => ({ name: device.name, id: device.id }))
      );
    });
  }

  function handleSetDevice(value) {
    setDevice(value);
    localStorage.setItem("device", value);
    spotify.transferPlayback(value);
  }

  let player;

  window.onSpotifyWebPlaybackSDKReady = () => {
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
        //console.log("player_state_changed: ", state);
        spotify.currentlyPlaying().then((track) => setCurrentTrack(track));
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        localStorage.setItem("device", device_id);
        spotify.transferPlayback(device_id);
        getDevices();
        setDevice(device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        //console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      player.connect().then((success) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );

          player.togglePlay().then(() => {
            console.log("Toggled playback!");
          });
        }
      });
    }
  };

  return (
    <div className={styles.player}>
      <Vinyl label={label} spin={isPlaying} tempo={tempo} />
      {tempo && (
        <Chip
          label={`${tempo.toFixed(0)} BPM`}
          color="secondary"
          style={{ position: "absolute", top: "30px", right: "30px" }}
        />
      )}
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            spotify.play().then(() => {
              spotify
                .currentlyPlaying()
                .then((track) => setCurrentTrack(track));
              setIsPlaying(true);
            });
          }}
        >
          <PlayArrow />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            spotify.pause();
            setIsPlaying(false);
          }}
        >
          <Pause />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            spotify
              .previous()
              .then(() =>
                spotify
                  .currentlyPlaying()
                  .then((track) => setCurrentTrack(track))
              );
          }}
        >
          <SkipPrevious />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            spotify.next().then(() => {
              spotify
                .currentlyPlaying()
                .then((track) => setCurrentTrack(track));
            });
          }}
        >
          <SkipNext />
        </Button>
        <Devices
          device={device}
          devices={devices}
          setDevice={(value) => handleSetDevice(value)}
        />
      </div>
      <Controls currentTrack={currentTrack ? currentTrack.id : 0} />
    </div>
  );
};

export default Player;
