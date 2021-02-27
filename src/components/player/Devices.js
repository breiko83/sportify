import React, { useState, useEffect } from "react";

// UI
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";

// API
import spotify from "spotify.js";

const Devices = ({ device, setDevice }) => {
  const [devices, setDevices] = useState([]);

  function getDevices() {
    spotify.getDevices().then((devices) => {
      console.log(devices);

      setDevices(
        devices.map((device) => ({ name: device.name, id: device.id }))
      );
      // select first device as default
      // setDevice(devices[0].id);
    });
  }

  function handleChange(value) {
    console.log(value);
    spotify.transferPlayback(value);
  }

  return (
    <div>
      <FormControl>
        <InputLabel id="devices-label">Devices</InputLabel>
        <Select
          labelId="devices-label"
          value={device}
          onChange={(e) => handleChange(e.target.value)}
          input={<Input />}
          onOpen={getDevices}
        >
          {devices.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Devices;
