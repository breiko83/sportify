import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import spotify from "spotify.js";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    maxHeight: 300,
  },
});

const Login = ({ isLogged }) => {
  const history = useHistory();
  const location = useLocation();
  const code = new URLSearchParams(location.search).get("code");
  const classes = useStyles();

  if (code) {
    spotify
      .getToken(code)
      .then(({ data }) => {
        // save new tokes
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("logged", "true");
        isLogged();
        history.push("/");
      })
      .catch(({ response }) => console.log(response.data.error));
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card className={classes.root}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Sportify
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
              component="p"
              gutterBottom={true}
            >
              Select the right Spotify track for your cadence. The perfect
              companion for your workout.
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p">
              *due to Spotify API limitations this app requires Spotify Premium
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => spotify.login()}
          >
            Login with Spotify
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
export default Login;
