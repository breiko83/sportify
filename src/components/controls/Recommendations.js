import { recomposeColor } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import spotify from "spotify.js";

const Recommendations = ({ genres, cadence, setTracks }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    spotify.getRecommendations(genres, cadence).then((tracks) => {
      console.log(tracks);
      if(tracks.length > 0)
        setTracks(tracks.map((track) => track.uri));
      setRecommendations(tracks);
    });
  }, [cadence, genres]);

  return (
    <div>
      <ul>
        {recommendations.map((track) => (
          <li>
            {track.name} /{" "}
            {track.artists.map((artist) => artist.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
