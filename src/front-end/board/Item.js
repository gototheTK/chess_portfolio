import React, { Component } from "react";
import * as styles from "./boardStyles";

class Item extends Component {
  render() {
    return (
      <div style={styles.item}>
        <img
          style={styles.image}
          src={
            "http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg"
          }
        />
        <div>
          <a href={"#"}>
            <h2>sdfsdfdssdfdsdfsdafdsf</h2>
          </a>
        </div>
        <span>
          <h3>dsfd</h3>
          <h4>yy.mm.dd</h4>
        </span>
      </div>
    );
  }
}

export default Item;
