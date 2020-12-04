const board = document.querySelector(".board");
const upNextGrid = document.querySelector(".up-next-grid");
const scoreCounter = document.querySelector("#score-counter");
const linesClearedCounterBox = document.querySelector("#lines-cleared-counter");
const highScoreCounter = document.querySelector("#high-score-counter");
const playButton = document.querySelector("#play");
const gameOverButton = document.querySelector("#gameover");
const playAgainButton = document.querySelector("#play-again");
const pauseButton = document.querySelector("#pause");
const musicButton = document.querySelector("#music");
const width = 10;
const height = 21;
let boardSquares = [];
let nextRandomNumber = 0;
let intervalDrop;
let timerId;
let score = 0;
let linesCleared = 0;
let upNextWidth = 8;
const isStorage = "undefined" !== typeof localStorage;
let highScore;

document.addEventListener("keydown", function(e) {
    e.preventDefault();
});

if (isStorage && JSON.parse(localStorage.getItem("highScore"))) {
    highScore = (JSON.parse(localStorage.getItem("highScore")));
    highScoreCounter.innerHTML = `High Score: <br> ${highScore}`;
    } else if(JSON.parse(localStorage.getItem("highScore")) == null) {
        highScore = 0;
        highScoreCounter.innerHTML = `High Score: <br> 0`;
}

function saveScore(highScore) {
    if (highScore > (JSON.parse(localStorage.getItem("highScore")))) {
        localStorage.setItem("highScore", JSON.stringify(highScore));
    }
}

let createBoard = squares => {
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement("div");
        square.dataset.id = i;
        square.classList.add("squares");
        board.appendChild(square);
        squares.push(square);
        if (i > 199) {
            square.classList.add("taken");
        }
        if (i >12 && i<17) {
            square.classList.add("endGame");
        }
    }
};
createBoard(boardSquares);

let createUpNextSquares = () => {
    for (let i = 0; i < upNextWidth*upNextWidth; i++) {
        const square = document.createElement("div");
        square.dataset.id = i;
        square.classList.add("up-next-squares");
        upNextGrid.appendChild(square);
    }
};

createUpNextSquares();
const upNextSquares = document.querySelectorAll(".up-next-grid div");


let l1Shape = [
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2, width*2+1],
    [0, width, width+1, width+2],
    [1, 2, width+1, width*2+1]
];

let l2Shape = [
    [width, width+1, width+2, width*2],
    [0, 1, width+1, width*2+1],
    [2, width, width+1, width+2],
    [1, width+1, width*2+1, width*2+2]
];

let oShape = [
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2]
];

let z1Shape = [
    [0, 1, width+1, width+2],
    [1, width, width+1, width*2],
    [0, 1, width+1, width+2],
    [1, width, width+1, width*2]
];

let z2Shape = [
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1],
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1],
];

let kShape = [
    [0, 1, 2, width+1],
    [width+1, 2, width+2, width*2+2],
    [width+1, width*2, width*2+1, width*2+2],
    [0, width, width*2, width+1]
];

let iShape = [
    [1, width+1, width*2+1, width*3+1],
    [width*3, width*3+1, width*3+2, width*3+3],
    [1, width+1, width*2+1, width*3+1],
    [width*3, width*3+1, width*3+2, width*3+3]
];

let allShapes = [l1Shape, l2Shape, oShape, z1Shape, z2Shape, kShape, iShape];
let randomNumber = Math.floor(Math.random() * allShapes.length);
let currentRotation = 0;
let currentShape = allShapes[randomNumber][currentRotation];
let currentPosition = 3;

let drawShape = () => {
    currentShape.forEach(index => {
        if (randomNumber === 0) {
            boardSquares[currentPosition + index].classList.add("shape", "l1Shape");
        }
        if (randomNumber === 1) {
            boardSquares[currentPosition + index].classList.add("shape", "l2Shape");
        }
        if (randomNumber === 2) {
            boardSquares[currentPosition + index].classList.add("shape", "oShape");
        }
        if (randomNumber === 3) {
        boardSquares[currentPosition + index].classList.add("shape", "z1Shape");
        }
        if (randomNumber === 4) {
            boardSquares[currentPosition + index].classList.add("shape", "z2Shape");
        }
        if (randomNumber === 5) {
            boardSquares[currentPosition + index].classList.add("shape", "kShape");
        }
        if (randomNumber === 6) {
            boardSquares[currentPosition + index].classList.add("shape", "iShape");
        }
    });
};

let unDrawShape = () => {
    currentShape.forEach(index => {
        boardSquares[currentPosition + index].classList.remove("shape", "l1Shape", "l2Shape", "oShape", "z1Shape", "z2Shape", "kShape", "iShape");
    });
};

let stopDrop = () => {
    if (currentShape.some(index => boardSquares[currentPosition + index + width].classList.contains("taken", "shape"))) {
        currentShape.forEach(index => boardSquares[currentPosition + index].classList.add("taken"));
        if (endGame()) return;
        else {
            clearInterval(intervalDrop);
            intervalDrop = null;
            lineCleared();
        //get new shape dropping
            randomNumber = nextRandomNumber;
            nextRandomNumber = Math.floor(Math.random() * allShapes.length);
            currentShape = allShapes[randomNumber][0];
            currentPosition = 3;
            drawShape();
            upNext();
            if (currentShape.some(index => boardSquares[currentPosition + index + width].classList.contains("taken"))) {
                currentShape.forEach(index => boardSquares[currentPosition + index].classList.add("taken"));
                if (endGame()) return;
        }
        intervalDrop = setInterval(dropShape, 800);
      }
    }
};

let dropShape = () => {
    unDrawShape();
    currentPosition+=10;
    drawShape();
    if (currentShape.some(index => boardSquares[currentPosition + index + width].classList.contains("taken", "shape"))) {
        clearInterval(intervalDrop);
        setTimeout(function() {
          // console.log("activated") // appears at the end of the interval
          stopDrop()
        }, 800);
    if (currentShape.some(index => boardSquares[currentPosition + index + width].classList.contains("taken", "shape"))) {
      // console.log("activated")
    }
    }
};

let arrowPress = e => {
    let arrowDirection = e.keyCode;
    if (arrowDirection === 37) leftPress();
    if (arrowDirection === 38) rotate();
    if (arrowDirection === 39) rightPress();
    if (arrowDirection === 40) {
        if (currentShape.some(index => boardSquares[currentPosition + index + width].classList.contains("taken", "shape"))) return;
        else dropShape();
    }
};

document.addEventListener('keydown', arrowPress);

let leftPress = () => {
    unDrawShape();
    const atLeftEdge = currentShape.some(index => {
         return (currentPosition + index) % width === 0; 
    });
    if(!atLeftEdge) currentPosition -=1;
    if (currentShape.some(index => boardSquares[currentPosition + index].classList.contains("taken"))) currentPosition +=1;
    drawShape();
  };

  let rightPress = () => {
    unDrawShape();
    const atRightEdge = currentShape.some(index => {
        return (currentPosition + index) % width === 9;
    });
    if(!atRightEdge) currentPosition +=1;
    if (currentShape.some(index => boardSquares[currentPosition + index].classList.contains("taken"))) currentPosition -=1;
    drawShape();
  };

    
let isAtLeft = () => {
    return currentShape.some(index => (currentPosition + index) % width === 0);
};

let isAtRight = () => {
    return currentShape.some(index => (currentPosition + index) % width === 9);
};
  
let checkEdges = position => {
  position = position || currentPosition;
  if ((position + 1) % width < 4) {  //using position % width < 5 still allows it to go over the edge
    if (isAtRight()) {
      currentPosition += 1;
      checkEdges(position);
      }
  }
  else if (position % width > 5) {
    if (isAtLeft()) {
      currentPosition -= 1;
      checkEdges(position);
    }
  }
};

let rotate = () => {
    if (randomNumber === 2) return;    
    unDrawShape();
    if (currentRotation === 3) {
        currentRotation = 0;
    } else {
        currentRotation++;
    }
    currentShape = allShapes[randomNumber][currentRotation];
    checkEdges();
    if (currentShape.some(index => boardSquares[currentPosition + index].classList.contains("taken", "shape"))) {
      // console.log("contains taken!!!!!", currentRotation)
      if (currentRotation === 0) { 
        currentRotation = 3;
        // console.log(currentRotation)
      } else {
        currentRotation --;
        // console.log(currentRotation)
      }
    }
    currentShape = allShapes[randomNumber][currentRotation];
    drawShape();
    stopDrop();
};


let upNext = () => {
    upNextSquares.forEach(square => {
        square.classList.remove("l1Shape", "l2Shape", "oShape", "z1Shape", "z2Shape", "kShape", "iShape");
    });
    upNextShape[nextRandomNumber].forEach(index => {
        if (nextRandomNumber === 0) {
            upNextSquares[index].classList.add("l1Shape", "no-grid");
        }
        if (nextRandomNumber === 1) {
            upNextSquares[index].classList.add("l2Shape", "no-grid");
        }
        if (nextRandomNumber === 2) {
            upNextSquares[index].classList.add("oShape", "no-grid");
        }
        if (nextRandomNumber === 3) {
            upNextSquares[index].classList.add("z1Shape", "no-grid");
        }
        if (nextRandomNumber === 4) {
            upNextSquares[index].classList.add("z2Shape", "no-grid");
        }
        if (nextRandomNumber === 5) {
            upNextSquares[index].classList.add("kShape", "no-grid");
        }
        if (nextRandomNumber === 6) {
            upNextSquares[index].classList.add("iShape", "no-grid");
        }
    });
};

const upNextShape = [
    [17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30, 37, 38, 45, 46],
    [17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30, 33, 34, 41, 42],
    [18, 19, 20, 21, 26, 27, 28, 29, 34, 35, 36, 37, 42, 43, 44, 45],
    [17, 18, 19, 20, 25, 26, 27, 28, 35, 36, 37, 38, 43, 44, 45, 46],
    [19, 20, 21, 22, 27, 28, 29, 30, 33, 34, 35, 36, 41, 42, 43, 44],
    [17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30, 35, 36, 43, 44],
    [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
];

let startGame = () => {
    gameOverButton.classList.add("hidden");
    playAgainButton.classList.add("hidden");
    playButton.classList.add("hidden");
    drawShape();
    intervalDrop = setInterval(dropShape, 800);
    nextRandomNumber = Math.floor(Math.random() * allShapes.length);
    upNext();
};

playButton.addEventListener("click", startGame);

playAgainButton.addEventListener("click", function() {
    for (let i=0; i<=199;i++) {
        boardSquares[i].classList.remove("shape", "l1Shape", "l2Shape", "oShape", "z1Shape", "z2Shape", "kShape", "iShape", "taken");
    }    
    intervalDrop;
    timerId;
    randomNumber = Math.floor(Math.random() * allShapes.length);
    score = 0;
    linesCleared = 0;
    scoreCounter.innerText = "Score: " + score;
    linesClearedCounterBox.innerText = "Lines Cleared: " + linesCleared;
    startGame();
});

pauseButton.addEventListener("click", function() {
    if (playButton.classList.contains("hidden")) {
    if (timerId) {
        intervalDrop = setInterval(dropShape, 800);
        pauseButton.innerHTML = "Pause Game";
        timerId = 0;
    } else {
        clearInterval(intervalDrop);
        pauseButton.innerHTML = "Resume";
        timerId = 1;
        }
    } return;
});

let lineCleared = () => {
    for (let i = 0; i < 199; i +=width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
    if(row.every(index => boardSquares[index].classList.contains("taken"))) {
        row.forEach(index => boardSquares[index].classList.remove("taken", "shape", "l1Shape", "l2Shape", "oShape", "z1Shape", "z2Shape", "kShape", "iShape"));
        let squaresRemoved = boardSquares.splice(i, width);
        boardSquares = squaresRemoved.concat(boardSquares);
        boardSquares.forEach(square => board.appendChild(square));
        score += 100;
        if (highScore == score - 100) highScore += 100;
        scoreCounter.innerText = `Score: ${score}`;
        highScoreCounter.innerHTML = `High Score: <br> ${highScore}`;
        linesCleared++;
        linesClearedCounterBox.innerText = "Lines Cleared: " + linesCleared;
        saveScore(highScore);
        }
    }
};

let endGame = () => {
    for (let i=0; i<boardSquares.length; i++) {
        if (boardSquares[i].classList.contains("endGame") && boardSquares[i].classList.contains("taken")) {
            saveScore(highScore);
            clearInterval(intervalDrop);
            gameOverButton.classList.remove("hidden");
            playAgainButton.classList.remove("hidden");
            return true;
        }
    }             
};

let isMusicPlaying = false;
musicButton.addEventListener("click", function() {
    if (!isMusicPlaying) {
        themeTune.play(); 
        musicButton.innerHTML = "&#127925; &#10074;&#10074;";
        isMusicPlaying = true;
    } else if (isMusicPlaying) {
        themeTune.pause();
        musicButton.innerHTML = "&#127925; &#x23f5;";
        isMusicPlaying = false;
    }
});