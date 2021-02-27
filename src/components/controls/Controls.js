import React, {useState} from "react";
import Genres from "./Genres";
import Recommendations from './Recommendations';
import Devices from "components/player/Devices";
import Cadence from "./Cadence";
import spotify from "spotify";

const DEFAULT_GENRES = [
  "electronic",
  "progressive-house",
  "techo",
  "dance",
  "work-out",
];

const Controls = () => {

  const [cadence, setCadence] = useState(localStorage.getItem("cadence") || 85);
  const [genres, setGenres] = useState(JSON.parse(localStorage.getItem("genres")) || DEFAULT_GENRES);
  const [device, setDevice] = useState();

  function handleCadenceChange(value) {
    setCadence(value);
    localStorage.setItem('cadence',value);
  }

  function handleSetGenres(values) {
    setGenres(values);
    localStorage.setItem("genres", JSON.stringify(values));
  }

  function handleSetTracks(uris) {
    spotify.play(device, uris);
  }

  return (
    <div>
      <Genres selected={genres} setSelected={(values) => handleSetGenres(values)} />
      <Cadence cadence={cadence} setCadence={(value) => handleCadenceChange(value)} />
      <Devices setDevice={id => setDevice(id)}/>
      <Recommendations genres={genres} cadence={cadence} setTracks={(uris) => handleSetTracks(uris)} />
    </div>
  );
};

export default Controls;
