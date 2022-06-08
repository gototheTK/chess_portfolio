# chess_portfolio - 22.05.15 ~

## Used languages & tools

1. Front
   - HTML
   - CSS
   - SVG
   - JavaScript
   - D3.js
   - React
   - Redux
2. Back
   - JavaScript
   - Node.js
   - Express
   - Nginx
3. Environment
   - Centos OS(WSL2)

## Making Components of Chess

1. ~~ChessBoard~~

   - [x] cells
   - [x] colors of cells

2. ~~ChessPieces~~

   - [x] white king
   - [x] black king
   - [x] white queen
   - [x] black queen
   - [x] white pawn
   - [x] white pawn
   - [x] white rook
   - [x] black rook
   - [x] white bishop
   - [x] black bishop
   - [x] white knight
   - [x] black knight (22.05.15)

   ![title](Images/items.png)

3. ~~Effects~~

   - [x] animation when a pieace move
   - [x] background color of a cell a selected pieace have
   - [x] a effect of a checked cell
   - [x] backgorund color of a previous cell a piece left
   - [x] backgorund color of a current cell a piece reachs
   - [x] circles on cells a selected pieace can move

   ![title](Images/motion.gif)

4. ~~Events~~

   - [x] mouse over and out a cell
   - [x] select a cell
   - [x] click another cell with a pieace (22.05.26)

   ![title](Images/events.gif)

## Making a Front Page

1. Making Components of Pages

   - [x] NavBar
   - [x] Chess
   - [] ReadingPage
   - [] WritingPage
   - [x] BoardCard (2022.05.24)
   - [] Login&SingUpFrom

2. Making Pages

   - Chess Page [x] (2022.05.23)
   - Board Page
   - Login Page
   - Profile Page
   - About

   ![title](Images/front1.PNG)

## Chess Logic

### ~~상대방 말 공격[x] (2022.05.26)~~

      1. 이동 가능한 범위에 있는 상대방의 말이 있는지 피스의 색을 통하여 확인한다.
      2. 공격범위에 왕이 있다면 체스를 선언하고 빨간색으로 바꾼다.
      3. 이동 가능한 범위에 상대방의 말이 있다면 클릭가능하게 한다.
      4. 상대의 말을 클릭하면 피스의 배경과 선택 가능한 상태를 바꾸고 이동시킨다.
      5. 공격당한 상대의 말의 배경색을 원상태로 바꾸고 옆으로 이동시켜 보드에서 사라지게한다.
      6. 이동 전 셀의 상태를 비우고, 이동 후 셀의 상태를 현재의 피스로 바꾼다.
      7. 현재셀에서 이동가능한 셀과 공격가능한 피스를 계산한다.
      8. 턴을 바꾼다.

![title](Images/attackMotion.gif)

### ~~앙파상[x] (2022.05.26)~~

      1.  지금 플레이어의 타입이 pawn인데, 색이 BLACK인 경우 이동한줄이 5번째줄인지 혹은 색이 WHITE인 경우 4번째줄인지 확인한다.

      2.  4번째 혹은 5번째줄에 옮겼을때, 옆애 상대방의 말이 있을경우 앙파상을 선언한다.
         - 오른쪽 혹은 왼쪽에 상대의 말이있는지 확인한다.
         - 있으면 앞칸뒤의 셀의 상태에 자기말을 넣는다.
         - 상대말 뒤의칸을 클릭하면 인패싱 모션을하고, 다른칸을 클릭하면 인패싱을 하지 않는다.
         - 앙파상을 하든 안하든 이번턴을 넘기면 앙파상 이벤트를 끝낸다.

![title](Images/INPASSING.gif)

### ~~캐슬링[x] (2022.05.29)~~

      1. 캐슬링 위치를 정해놓는다.
      2. 킹이 캐슬링 위치로 가면 캐슬링을 발동한다.
      3. 캐슬링이 발동하면 룩콰 킹은 각각 약속된 칸으로 이동한다.

![title](Images/castling.gif)

### 승리 혹은 패배조건

### 왕이 상대방의 말로 하여금 체크상태에서 더 이상 이동할수없다면 승리와 패배를 선언한다.

      1. 상대의 턴이 끝날때 상대의 변화로부터 킹이 공격받는 경우들을 가정한다.
         - 가로 세로로 공격받는 경우(퀸, 룩)
         - 좌우 대각선으로 공격받는 경우(퀸, 비숍, 폰)
         - 사방에서 대각선을 가로질러 공격받는 경우(나이트)
         - 퀸, 룩이 없어서 가로 세로로 공격할 수 없는 경우 같이 상대방의 말의 상태를 보면서 필요 없는 가정은 넘긴다.
         - 퀸이나 비숍 폰의 대각선의 공격 경로에 다른 말이 막고 있는 경우와 같이 공격 경로에 상관없는 말이 있는 경우 가정을 멈춘다.
      2.1. 공격받는 상황이 발생했다면 체크를 선언한다.
      2.2. 이때 공격받는 경우가 없다면 체크없이 넘어간다.
      3.체크가 선언되었을 경우 킹이 회피경로나 공격하고 있는 말을 잡거나 경로를 막아 저지지할수 있는 말이 없다면 체크 메이트를 선언한다.
