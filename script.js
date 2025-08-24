// Ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Get references to key DOM elements
  const gameGrid = document.getElementById("gameGrid");
  const winCanvas = document.getElementById("winCanvas");
  const turnIndicator = document.getElementById("turn-indicator");
  const restartButton = document.getElementById("restart-button");
  const playerXIndicator = document.querySelector(".player-x");
  const playerOIndicator = document.querySelector(".player-o");
  const ctx = winCanvas.getContext("2d");
  // Game state variables
  let currentPlayer = "X"; // ('X' or 'O')

  let board = ["", "", "", "", "", "", "", "", ""];
  let isGameActive = true; // Flag to control game

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  initializeGame();

  /**
   * Initializes or resets the Tic-Tac-Toe game.
   * Clears the board, resets player turns, and sets up event listeners for cells.
   */
  function initializeGame() {
    gameGrid.innerHTML = "";
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    ctx.clearRect(0, 0, winCanvas.width, winCanvas.height);

    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;

    // Create 9 cells for the game board
    for (let index = 0; index < 9; index++) {
      const cell = document.createElement("div");
      cell.classList.add("cell"); // Add 'cell' class for styling
      cell.dataset.index = index; // Store the cell's index as a data attribute
      cell.addEventListener("click", (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.index);

        if (board[clickedCellIndex] !== "" || !isGameActive) return;

        board[clickedCellIndex] = currentPlayer; // Update the board array with the current player's move
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // Add class for styling (e.g., 'x' or 'o')

        checkGameStatus(); // Check if there's a win or a draw
      });

      gameGrid.appendChild(cell);
    }
  }

  /**
   * Checks the current status of the game for a win or a draw.
   */
  function checkGameStatus() {
    let isWin = false;
    let winningCondition;

    for (let i = 0; i < winningConditions.length; i++) {
      const condition = winningConditions[i];

      const a = board[condition[0]];
      const b = board[condition[1]];
      const c = board[condition[2]];

      if (a === "" || b === "" || c === "") continue;

      if (a === b && b === c) {
        isWin = true;
        winningCondition = condition;
        break; // Exit the loop as a win is found
      }
    }

    // If a win occurred
    if (isWin) {
      isGameActive = false;
      turnIndicator.textContent = `🏆 Player ${currentPlayer} Wins! 🏆`;
      drawWinLine(winningCondition); // Draw the winning line on the canvas
      return;
    }

    // If the board is full and no winner, it's a draw
    if (!board.includes("")) {
      isGameActive = false;
      turnIndicator.textContent = "🎲 It's a Draw! 🎲";
      return;
    }

    changePlayer();
  }

  /**
   * Switches the current player from 'X' to 'O' or vice versa.
   * Updates the turn indicator and player active states.
   */
  function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    playerOIndicator.classList.toggle("active");
    playerXIndicator.classList.toggle("active");
  }

  //Draws a line on the canvas to indicate the winning combination.

  function drawWinLine(condition) {
    const startCell = gameGrid.children[condition[0]];
    const endCell = gameGrid.children[condition[2]];

    // Get the bounding rectangles of the start and end cells, and the game grid
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const gameRect = gameGrid.getBoundingClientRect();

    // Set canvas dimensions and position to match the game grid
    winCanvas.width = gameRect.width;
    winCanvas.height = gameRect.height;
    winCanvas.style.left = gameRect.left + "px";
    winCanvas.style.top = gameRect.top + "px";
    winCanvas.style.position = "absolute";

    // Calculate relative coordinates within the canvas for the start and end points of the line
    // Adding 40 to center the line within the 80x80 cells (assuming 80px cell size)
    const x1 = startRect.left - gameRect.left + 40;
    const y1 = startRect.top - gameRect.top + 40;
    const x2 = endRect.left - gameRect.left + 40;
    const y2 = endRect.top - gameRect.top + 40;

    // Animate the drawing of the winning line
    animateWinLine(x1, y1, x2, y2);

    function animateWinLine(startX, startY, endX, endY) {
      let progress = 0; // Progress of the line drawing (0 to 1)
      function draw() {
        ctx.clearRect(0, 0, winCanvas.width, winCanvas.height);
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Calculate the current point on the line based on progress
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "#4cc9f0");
        gradient.addColorStop(1, " #991953ff");

        ctx.strokeStyle = gradient;
        ctx.lineTo(currentX, currentY);

        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.shadowColor = "#25f7d8ff";
        ctx.shadowBlur = 20;
        ctx.stroke();

        progress += 0.02;
        if (progress <= 1) {
          requestAnimationFrame(draw); // Continue drawing if not finished
        }
      }

      draw();
    }
  }

  // Add event listener to the restart button to re-initialize the game
  restartButton.addEventListener("click", initializeGame);
});
