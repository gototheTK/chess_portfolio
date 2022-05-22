import React from 'react';
import * as d3 from 'd3';
import * as items from './items.js';

class ChessGame extends React.Component{

    componentDidMount() {
        var svg = d3.select('#chess');
        var board = items.board(svg);
        var whiteKing = items.WhiteKing(svg);
        var whiteQueen = items.whiteQueen(svg);
        var whiteBishop = items.whiteBishop(svg);
        var whiteKnight = items.whiteKnight(svg);
        var whiteRook = items.whiteRook(svg);
        var whitePawn = items.whitePawn(svg);
        var blackKing = items.blackKing(svg);
        var blackQueen = items.blackQueen(svg);
        var blackBishop = items.blackBishop(svg);
        var blackKnight = items.blackKnight(svg);
        var blackRook = items.blackRook(svg);
        var blackPawn = items.blackPawn(svg);
        //Do svg stuff
    }
    

      render() {
        return (
          <svg id="chess" width={1200} height={720} >
            
          </svg>
        );
      }

}



export default ChessGame;




