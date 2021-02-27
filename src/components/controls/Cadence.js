import React, { useState } from "react";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

const Cadence = ({ cadence, setCadence }) => {

  const [value, setValue] = useState(cadence);

  function valuetext(value) {
    return `${value} RPM`;
  }

  return (
    <div style={{ width: "300px" }}>
      <Typography id="cadence-slider" gutterBottom>
        Cadence
      </Typography>
      <Slider
        defaultValue={value}
        getAriaValueText={valuetext}
        aria-labelledby="cadence-slider"
        valueLabelDisplay="on"
        step={5}
        marks
        min={60}
        max={110}
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        onChangeCommitted={(event, newValue) => setCadence(newValue)}
      />
    </div>
  );
};

export default Cadence;
