import React, { useState } from "react";
import spotify from "spotify";

// UI
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";

const Genres = ({ selected, setSelected }) => {
  const [genres, setGenres] = useState(selected);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [drawerVisibility, setDrawerVisibility] = useState(false);

  const handleSelect = (genre) => {
    if (genres.includes(genre)) {
      const values = genres.filter((g) => g !== genre);
      setGenres(values);
    } else {
      // maximum 5 genres
      if (genres.length > 4) return;

      const values = [...genres, genre];
      setGenres(values);
    }
  };

  const showAllGenres = () => {
    if (availableGenres.length === 0)
      spotify
        .getAvailableGenreSeeds()
        .then((genres) => setAvailableGenres(genres));
    setDrawerVisibility(!drawerVisibility);
  };

  function handleCloseDrawer() {
    setDrawerVisibility(false);
    setSelected(genres);
  }

  function handleDeleteGenre(genre) {
    const values = genres.filter((g) => g !== genre);
    setGenres(values);
    setSelected(values);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {genres.map((genre, index) => (
          <Chip
            color="secondary"
            key={index}
            label={genre}
            size="small"
            variant="outlined"
            icon={<Favorite />}
            onDelete={() => handleDeleteGenre(genre)}
            style={{ margin: "2px" }}
          />
        ))}
      </div>
      <Button onClick={() => showAllGenres()} color="primary">
        Change Genre
      </Button>
      <Drawer
        anchor="right"
        open={drawerVisibility}
        onClose={handleCloseDrawer}
      >
        <List>
          <ListItem>
            <ListItemText primary="Select Genres" secondary="Up to 5 genres" />
          </ListItem>
          <Divider />
          {availableGenres.map((genre, index) => (
            <ListItem key={index}>
              <FormControlLabel
                label={genre}
                control={
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    checked={genres.includes(genre)}
                    onChange={(event) => handleSelect(event.target.name)}
                    name={genre}
                    color="primary"
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Genres;
