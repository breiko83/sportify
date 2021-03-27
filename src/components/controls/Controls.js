import React, { useState } from "react";
import Genres from "./Genres";
import Recommendations from "./Recommendations";
import Cadence from "./Cadence";
import spotify from "spotify";

const DEFAULT_GENRES = [
  "electronic",
  "progressive-house",
  "techo",
  "dance",
  "work-out",
];

const Controls = ({ currentTrack }) => {
  const [cadence, setCadence] = useState(localStorage.getItem("cadence") || 85);
  const [genres, setGenres] = useState(
    JSON.parse(localStorage.getItem("genres")) || DEFAULT_GENRES
  );
  const [recommendations, setRecommendations] = useState(
    JSON.parse(localStorage.getItem("recommendations")) || []
  );

  function handleCadenceChange(value) {
    setCadence(value);
    localStorage.setItem("cadence", value);
    resetRecommendations();
  }

  function handleSetGenres(values) {
    setGenres(values);
    localStorage.setItem("genres", JSON.stringify(values));
    resetRecommendations();
  }

  function handleSetRecommendations(tracks) {
    setRecommendations(tracks);
    localStorage.setItem("recommendations", JSON.stringify(tracks));
    spotify.play(tracks.map((track) => track.uri));
  }

  function resetRecommendations() {
    setRecommendations([]);
    localStorage.setItem("recommendations", JSON.stringify([]));
  }

  return (
    <div>
      <Genres
        selected={genres}
        setSelected={(values) => handleSetGenres(values)}
      />
      <Cadence
        cadence={cadence}
        setCadence={(value) => handleCadenceChange(value)}
      />
      <Recommendations
        currentTrack={currentTrack}
        recommendations={recommendations}
        genres={genres}
        cadence={cadence}
        setRecommendations={(tracks) => handleSetRecommendations(tracks)}
      />
    </div>
  );
};

export default Controls;
