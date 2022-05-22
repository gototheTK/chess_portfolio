import React from 'react';
import * as d3 from 'd3';
import * as items from './items.js';

class ChessGame extends React.Component{

    componentDidMount() {
        var svg = d3.select('#chess');
        var board = items.board(svg);
        var whiteKing = items.whiteKing(svg);
        var whiteQueen = items.whiteQueen(svg);
        var whiteBishop = items.whiteBishop(svg);
        var whiteKnight = items.whiteKnight(svg);
        var whiteRook = items.whiteRook(svg);
        var whitePawn = items.whitePawn(svg);
        var whiteKing = items.blackKing(svg);
        var whiteQueen = items.blackQueen(svg);
        var whiteBishop = items.blackBishop(svg);
        var whiteKnight = items.blackKnight(svg);
        var whiteRook = items.blackRook(svg);
        var whitePawn = items.blackPawn(svg);
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




