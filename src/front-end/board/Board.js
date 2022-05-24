import React, { Component } from "react";
import Item from "./Item";
import { Button, Card } from "react-bootstrap";

class Board extends Component {
  render() {
    return (
      <div>
        <Item />
        <Item />
        <Item />
      </div>
    );
  }
}

export default Board;
