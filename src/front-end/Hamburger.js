import React, { Component } from "react";
import * as styles from "./styles.js";

class Hamburger extends Component {
  render() {
    return (
      <div style={styles.hamburger}>
        <span style={styles.bar}></span>
        <span style={styles.bar}></span>
        <span style={styles.bar}></span>
        <span style={styles.bar}></span>
      </div>
    );
  }
}

export default Hamburger;
