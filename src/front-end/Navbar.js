import React, { Component } from "react";
import * as styles from "./styles";

class Navbar extends Component {
  render() {
    return (
      <nav>
        <a href={"/"} style={styles.logo}>
          <h1>ChessGame</h1>
        </a>
        <ul>
          <li style={styles.navItem}>
            <a href="#" style={styles.navLink}>
              Chess
            </a>
          </li>
          <li style={styles.navItem}>
            <a href="#" style={styles.navLink}>
              Board
            </a>
          </li>
          <li style={styles.navItem}>
            <a href="#" style={styles.navLink}>
              Login
            </a>
          </li>
          <li style={styles.navItem}>
            <a href="#" style={styles.navLink}>
              About
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
