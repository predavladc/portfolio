let boxWid = window.innerWidth / 25;
let tableArr = []; //2D array of grid. 1 - Alive, 0 - Dead
let fps = 1; // 30 fps at start, 2 fps when game is active
let state = 0; // 0 = Setup, 1 = Active
let gridLn =
  window.innerHeight > window.innerWidth
    ? window.innerWidth / boxWid
    : window.innerHeight / boxWid; // Grid length
if (window.innerHeight > window.innerWidth) {
}
let startBtn;

// Populate the table with 0s
for (let r = 0; r < window.innerWidth / boxWid; r++) {
  let rowArr = [];
  for (let c = 0; c < window.innerHeight / boxWid; c++) {
    rowArr.push(Math.random() > 0.5 ? 1 : 0);
  }
  tableArr.push(rowArr);
}

function mousePressed() {
  let row = (mouseX - (mouseX % boxWid)) / boxWid; // Grab nearest row above click
  let col = (mouseY - (mouseY % boxWid)) / boxWid; // Grab nearest col left of click
  if (row <= gridLn && col <= gridLn) {
    // Valid row, col
    tableArr[row][col] = -1 * tableArr[row][col] + 1; // Invert the cell
    draw(); // Redraw table
  }
}

function startGame() {
  if (state == 0) {
    // If game hasn't yet started
    fps = 2;
    frameRate(fps);
    state = 1;
  }
}

function setup() {
  // Runs on start
  frameRate(fps);
  createCanvas(window.innerWidth, window.innerHeight);
  startGame();
}

function checkNeighbors(row, col) {
  // Return number of live neighbors

  let count = 0;

  for (let i = -1; i < 2; i++) {
    //This checks the row above and row below
    if (col + i >= 0 && col + i < gridLn - 1) {
      // Check for valid column
      if (row > 0 && tableArr[row - 1][col + i] == 1) {
        count++;
      }
      if (row < gridLn - 1 && tableArr[row + 1][col + i] == 1) {
        count++;
      }
    }
  }

  if (col - 1 >= 0 && tableArr[row][col - 1] == 1) {
    // Check left cell
    count++;
  }
  if (col + 1 < gridLn - 1 && tableArr[row][col + 1] == 1) {
    // Check right cell
    count++;
  }

  return count;
}

function draw() {
  tableArr.forEach((rowArr, row) => {
    rowArr.forEach((colVal, col) => {
      fill(colVal == 1 ? "#aff" : "transparent"); // Black if live, transparent if dead
      rect(row * boxWid, col * boxWid, boxWid, boxWid);
    });
  });
  if (state == 1) {
    // Apply rules
    let newTable = []; // Upcoming grid
    tableArr.forEach((rowArr, row) => {
      let newRow = [];
      rowArr.forEach((colVal, col) => {
        let cellVal = colVal;
        let nCount = checkNeighbors(row, col);
        if (cellVal == 1 && nCount < 2) {
          // If live and <2 live neighbors
          cellVal = 0;
        } else if (cellVal == 1 && nCount > 3) {
          // If live and >3 live neighbors
          cellVal = 0;
        } else if (cellVal == 0 && nCount == 3) {
          // If dead and 3 live neighbors
          cellVal = 1;
        }

        newRow.push(cellVal);
      });
      newTable.push(newRow);
    });
    tableArr = newTable; // Update the grid
  }

  for (let i = 0; i < 100; i++) {
    // give the fill opacity based on the row number
    fill(0,0,0, 255- ( i * 2.55))
    noStroke(); 
    rect(0, document.querySelector("canvas").height - i, document.querySelector("canvas").width, 1)
    // turn stroke back on
    stroke(0)
  }
}
