/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // const row = [];
  // for (let i = 0; i < HEIGHT; i++) {
  //   board.push(row);
  // }
  // for (let i = 0; i < WIDTH; i++) {
  //   row.push(null);
  // }

  /* We need our rows to be different references. 
  therefore we cant just push "row" to the board.

  Is there a way we can loop to create a row0, row1, row2?
  board[0] = [null, null, null, ...]
  board[1] = [null, null, null, ...]

  creating the null row array is a separate function?

  YAY It is!
  
  */
  const createRow = function () {
    const row = [];
    for (let i = 0; i < WIDTH; i++) {
      row.push(null);
    }
    return row;
  };
  for (let i = 0; i < HEIGHT; i++) {
    board.push(createRow());
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // Create top row, called "top" with click event handler
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //create cells for the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create empty rows, and loop over "HEIGHT" to create the proper number of rows
  // each cell gets its own id (y,x) now
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //  write the real version of this, rather than always returning 0
  for (let i = 5; i >= 0; i--) {
    if (board[i][x] === null) return i;
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make div and insert it in current spot

  const currSpot = document.getElementById(`${y}-${x}`);
  const pieceDiv = document.createElement("div");
  pieceDiv.setAttribute("class", `piece player${currPlayer}`);
  currSpot.append(pieceDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  //  pop up alert message
  alert(msg);
  board = [];
  const playedTiles = document.querySelectorAll(".piece");
  playedTiles.forEach((tile) => tile.remove());
  makeBoard();
  makeHtmlBoard();
  currPlayer = 1;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  //  add line to update in-memory board
  const row = board[y];
  placeInTable(y, x);
  row[x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame

  /*
  do a .every function for row 0. if every cell is filled then we call for a tie.
  */
  if (board[0].every((element) => element > 0)) {
    return endGame("It's a draw!");
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
