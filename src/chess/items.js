import * as d3 from 'd3';


const SVG = 'svg';
const WIDTH = 'width';
const HEIGHT = 'height';

const RECT = 'rect';
const X = 'x';
const Y = 'y';

const FILL = 'fill';

const svgWidth = 1280;
const svgHeight = 720;

const boardSize = 8;
const cellSize = 45;
const cellNumbers = 64;
const cellColors = ['	hsl(30, 60%, 55%, 0.7)', 'hsl(30, 100%, 81%, 0.7)'];

const previousPlaceColor = 'hsl(131, 54%, 20%, 0.5)';
const possiblePlaceColor = 'hsl(131, 54%, 30%, 0.5)';
const currentPlaceColor = 'hsl(131, 54%, 50%, 0.4)';

const attackPlaceColor = 'hsl(131, 10%, 50%, 0.4)';
const checkPlaceColor = 'hsl(0, 100%, 50%, 0.3)';

const pieaceScale = 1;


const cells = () => {
  
  const result = [];
  
  for(let i=0; i<cellNumbers; i++){
   
    const x = cellSize * (i%boardSize);
    const y = cellSize * parseInt(i/boardSize);
    let color = parseInt(i/boardSize) + i;
    color = color % 2;
    result.push({
      x: x,
      y: y,
      color: cellColors[color]
    });
    
  }
  
  return result;
  
};



function Player(){
  this.select = null;
  this.x=0;
  this.y=0;
  this.show = () => console.log(this.x, this.y, this.select);
  this.move = () => {
    this.select.transition().delay(500).attr("transform", `translate(${this.x}, ${this.y}) scale(1)`);
    this.select=null;
  };
}

const white = new Player();

const board = (svg) => {
  return svg.selectAll(RECT).data(cells).enter().append(RECT).attr(WIDTH, cellSize).attr(HEIGHT, cellSize).style(FILL, d => d.color).attr(X, d => d.x).attr(Y, d => d.y).attr("transform", "scale("+ pieaceScale+ ")").on("mouseover", (e,d) => {
    white.x = d.x;
    white.y = d.y;
    white.show();
  }).on("click", (e,d) => {
    white.select && white.move();
  });
}



function WhiteKing(svg) {
  const p0 = svg.append("g").attr("style", "fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(0,0) scale("+ pieaceScale+ ")");
  p0.append("path").attr("d", "M 22.5,11.63 L 22.5,6").attr("style", "fill:none; stroke:#000000; stroke-linejoin:miter;");
  p0.append("path").attr("d", "M 20,8 L 25,8").attr("style", "fill:none; stroke:#000000; stroke-linejoin:miter;");
  p0.append("path").attr("d", "M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25").attr("style", "fill:#ffffff; stroke:#000000; stroke-linecap:butt; stroke-linejoin:miter;");
  p0.append("path").attr("d", "M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z ").attr("style", "fill:#ffffff; stroke:#000000;");
  p0.append("path").attr("d", "M 11.5,30 C 17,27 27,27 32.5,30").attr("style", "fill:none; stroke:#000000;");
  p0.append("path").attr("d", "M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5").attr("style", "fill:none; stroke:#000000;");
  p0.append("path").attr("d", "M 11.5,37 C 17,34 27,34 32.5,37").attr("style", "fill:none; stroke:#000000;");
  p0.on("click", function() {

    white.select = p0;

  });

  return p0;
}


const whiteQueen =  (svg) =>{ const p1 = svg.append("g").attr("style", "opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(45,0) scale("+ pieaceScale+ ")");
p1.append("path").attr("d", "M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z").attr("transform", "translate(-1,-1)");
p1.append("path").attr("d", "M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z").attr("transform", "translate(15.5,-5.5)");
p1.append("path").attr("d", "M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z").attr("transform", "translate(32,-1)");
p1.append("path").attr("d", "M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z").attr("transform", "translate(7,-4.5)");
p1.append("path").attr("d", "M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z").attr("transform", "translate(24,-4)");
p1.append("path").attr("d", "M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 31,11 L 25.5,24.5 L 22.5,9.5 L 19.5,24.5 L 14,10.5 L 14,25 L 7,14 L 9,26 z ").attr("style", "stroke-linecap:butt;");
p1.append("path").attr("d", "M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z ").attr("style", "stroke-linecap:butt;");
p1.append("path").attr("d", "M 11.5,30 C 15,29 30,29 33.5,30").attr("style", "fill:none;");
p1.append("path").attr("d", "M 12,33.5 C 18,32.5 27,32.5 33,33.5").attr("style", "fill:none;");
p1.on("click", function() {

    white.select = p1;

  });

  return p1
}


const whiteBishop = (svg) => {
  const p2 = svg.append("g").attr("style", "opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(90,0) scale("+ pieaceScale+ ")");
p2.append("g").attr("style", "fill:#ffffff; stroke:#000000; stroke-linecap:butt;");

const p3 = p2.append("g").attr("style", "fill:#ffffff; stroke:#000000; stroke-linecap:butt; cursor:pointer;");
p3.append("path").attr("d", "M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z");
p3.append("path").attr("d", "M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z");
p3.append("path").attr("d", "M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z");
p2.append("path").attr("d", "M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18").attr("style", "fill:none; stroke:#000000; stroke-linejoin:miter;");
return p2;
}


const whiteKnight = (svg) => {
  const p4 = svg.append("g").attr("style", "opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(135,0) scale("+ pieaceScale+ ")");
p4.append("path").attr("d", "M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18").attr("style", "fill:#ffffff; stroke:#000000;");
p4.append("path").attr("d", "M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10").attr("style", "fill:#ffffff; stroke:#000000;");
p4.append("path").attr("d", "M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z").attr("style", "fill:#000000; stroke:#000000;");
p4.append("path").attr("d", "M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z").attr("transform", "matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)").attr("style", "fill:#000000; stroke:#000000;");
return p4;
}



const whiteRook = (svg) => {
  const p5 = svg.append("g").attr("style", "opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(180,0) scale("+ pieaceScale+ ")");
p5.append("path").attr("d", "M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z ").attr("style", "stroke-linecap:butt;");
p5.append("path").attr("d", "M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z ").attr("style", "stroke-linecap:butt;");
p5.append("path").attr("d", "M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14").attr("style", "stroke-linecap:butt;");
p5.append("path").attr("d", "M 34,14 L 31,17 L 14,17 L 11,14");
p5.append("path").attr("d", "M 31,17 L 31,29.5 L 14,29.5 L 14,17").attr("style", "stroke-linecap:butt; stroke-linejoin:miter;");
p5.append("path").attr("d", "M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5");
p5.append("path").attr("d", "M 11,14 L 34,14").attr("style", "fill:none; stroke:#000000; stroke-linejoin:miter;");
return p5;
}


const whitePawn = (svg) => {
  const p6 = svg.append("g").attr("transform", "translate(225,0) scale("+ pieaceScale+ ")");
p6.append("path").attr("d", "M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z ").attr("style", "opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;");

return p6;
}


const blackKing = (svg) => {
  const p7 = svg.append("g").attr("style", "fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(0,45) scale("+ pieaceScale+ ")");
p7.append("path").attr("d", "M 22.5,11.63 L 22.5,6").attr("style", "fill:none; stroke:#000000; stroke-linejoin:miter;");
p7.append("path").attr("d", "M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25").attr("style", "fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;");
p7.append("path").attr("d", "M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z ").attr("style", "fill:#000000; stroke:#000000;");
p7.append("path").attr("d", "M 20,8 L 25,8").attr("style", "fill:none; stroke:#000000; stroke-linejoin:miter;");
p7.append("path").attr("d", "M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.51,26.6 L 22.5,24.5 C 20,18 9.906,14 6.997,19.85 C 4.5,25.5 11.85,28.85 11.85,28.85").attr("style", "fill:none; stroke:#ffffff;");
p7.append("path").attr("d", "M 11.5,30 C 17,27 27,27 32.5,30 M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5 M 11.5,37 C 17,34 27,34 32.5,37").attr("style", "fill:none; stroke:#ffffff;");
return p7;
}

const blackQueen = (svg) =>{
  const p8 = svg.append("g").attr("style", "opacity:1; fill:000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(45,45) scale("+ pieaceScale+ ")");
const p9 = p8.append("g").attr("style", "fill:#000000; stroke:none;");
p9.append("circle").attr("cx", "6").attr("cy", "12").attr("r", "2.75");
p9.append("circle").attr("cx", "14").attr("cy", "9").attr("r", "2.75");
p9.append("circle").attr("cx", "22.5").attr("cy", "8").attr("r", "2.75");
p9.append("circle").attr("cx", "31").attr("cy", "9").attr("r", "2.75");
p9.append("circle").attr("cx", "39").attr("cy", "12").attr("r", "2.75");
p8.append("path").attr("d", "M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z").attr("style", "stroke-linecap:butt; stroke:#000000;");
p8.append("path").attr("d", "M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z").attr("style", "stroke-linecap:butt;");
p8.append("path").attr("d", "M 11,38.5 A 35,35 1 0 0 34,38.5").attr("style", "fill:none; stroke:#000000; stroke-linecap:butt;");
p8.append("path").attr("d", "M 11,29 A 35,35 1 0 1 34,29").attr("style", "fill:none; stroke:#ffffff;");
p8.append("path").attr("d", "M 12.5,31.5 L 32.5,31.5").attr("style", "fill:none; stroke:#ffffff;");
p8.append("path").attr("d", "M 11.5,34.5 A 35,35 1 0 0 33.5,34.5").attr("style", "fill:none; stroke:#ffffff;");
p8.append("path").attr("d", "M 10.5,37.5 A 35,35 1 0 0 34.5,37.5").attr("style", "fill:none; stroke:#ffffff;");
return p8;
};

const blackBishop = (svg) =>{
  const p10 = svg.append("g").attr("style", "opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(90,45) scale("+ pieaceScale+ ")");
const p11 = p10.append("g").attr("style", "fill:#000000; stroke:#000000; stroke-linecap:butt; cursor:pointer;");
p11.append("path").attr("d", "M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z");
p11.append("path").attr("d", "M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z");
p11.append("path").attr("d", "M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z");
p10.append("path").attr("d", "M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18").attr("style", "fill:none; stroke:#ffffff; stroke-linejoin:miter;");
return p10;
};
const blackKnight = (svg) =>{
  const p12 = svg.append("g").attr("style", "opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(135,45) scale("+ pieaceScale+ ")");
p12.append("path").attr("d", "M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18").attr("style", "fill:#000000; stroke:#000000;");
p12.append("path").attr("d", "M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10").attr("style", "fill:#000000; stroke:#000000;");
p12.append("path").attr("d", "M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z").attr("style", "fill:#ffffff; stroke:#ffffff;");
p12.append("path").attr("d", "M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z").attr("transform", "matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)").attr("style", "fill:#ffffff; stroke:#ffffff;");
p12.append("path").attr("d", "M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z ").attr("style", "fill:#ffffff; stroke:none;");
return p12;
};
const blackRook = (svg) => {
  const p13 = svg.append("g").attr("style", "opacity:1; fill:000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;").attr("transform", "translate(180,45) scale("+ pieaceScale+ ")");
p13.append("path").attr("d", "M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z ").attr("style", "stroke-linecap:butt;");
p13.append("path").attr("d", "M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z ").attr("style", "stroke-linecap:butt;");
p13.append("path").attr("d", "M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z ").attr("style", "stroke-linecap:butt;");
p13.append("path").attr("d", "M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z ").attr("style", "stroke-linecap:butt;stroke-linejoin:miter;");
p13.append("path").attr("d", "M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z ").attr("style", "stroke-linecap:butt;");
p13.append("path").attr("d", "M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z ").attr("style", "stroke-linecap:butt;");
p13.append("path").attr("d", "M 12,35.5 L 33,35.5 L 33,35.5").attr("style", "fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;");
p13.append("path").attr("d", "M 13,31.5 L 32,31.5").attr("style", "fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;");
p13.append("path").attr("d", "M 14,29.5 L 31,29.5").attr("style", "fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;");
p13.append("path").attr("d", "M 14,16.5 L 31,16.5").attr("style", "fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;");
p13.append("path").attr("d", "M 11,14 L 34,14").attr("style", "fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;");
};
const blackPawn = (svg) => { 
  
const p14 = svg.append("g").attr("transform", "translate(225,45) scale("+ pieaceScale+ ")");
p14.append("path").attr("d", "M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z ").attr("style", "opacity:1; fill:#000000; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1; cursor:pointer;");
return p14;
};



export {board, WhiteKing, whiteQueen, whiteBishop, whiteKnight, whiteRook, whitePawn
,blackKing, blackQueen, blackBishop, blackKnight, blackRook, blackPawn};









