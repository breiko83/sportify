import React from "react";
import vinylCanvas from "assets/vinyl.png";
import styles from "./Vinyl.module.css";

const Vinyl = ({ label, spin = false, tempo }) => {
  const speed = 1 / (parseFloat(tempo) / 4 / 60);

  return (
    <div className={styles.container}>
      <img
        src={label}
        alt="Label"
        className={`${styles.label} ${spin ? null : styles.pause}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      />
      <img src={vinylCanvas} alt="Vinyl" className={styles.vinyl} />
    </div>
  );
};

export default Vinyl;
