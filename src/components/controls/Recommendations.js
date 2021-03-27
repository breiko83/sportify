import React, { useEffect } from "react";
import spotify from "spotify.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";

const Recommendations = ({
  currentTrack,
  recommendations,
  genres,
  cadence,
  setRecommendations,
  playTrack,
}) => {
  useEffect(() => {
    if (recommendations.length === 0) {
      spotify.getRecommendations(genres, cadence).then((tracks) => {
        console.log(tracks);
        if (tracks.length > 0)
          setRecommendations(
            tracks.map((track) => ({
              id: track.id,
              name: track.name,
              artists: track.artists.map((artist) => artist.name).join(", "),
              uri: track.uri,
              thumb: track.album.images[2].url,
            }))
          );
      });
    }
  }, [cadence, genres, recommendations, setRecommendations]);

  return (
    <div>
      <List dense={false}>
        {recommendations.map(({ id, name, artists, thumb, uri }, index) => (
          <ListItem
            button
            selected={currentTrack === id}
            onClick={() => spotify.play(undefined, undefined, index)}
          >
            <ListItemAvatar>
              <Avatar>
                <img src={thumb} alt="cover" width="64" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={name} secondary={artists} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="play"
                onClick={() => spotify.play(undefined, undefined, index)}
              >
                <PlayArrowIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Recommendations;
