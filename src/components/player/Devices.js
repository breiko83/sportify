import React from "react";

// UI
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import DevicesIcon from "@material-ui/icons/Devices";

const Devices = ({ device, devices, setDevice }) => {
  return (
    <div>
      <FormControl style={{ width: "100%" }}>
        <InputLabel id="devices-label">
          <DevicesIcon />
        </InputLabel>
        <Select native onChange={(e) => setDevice(e.target.value)}>
          {devices.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Devices;
