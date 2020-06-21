let height = 20;
let width = 10;
const board = document.querySelector('.board')
const leftside = document.querySelector('.left-side')
const scoreDisplay = document.querySelector('#score')
const startButton = document.querySelector('.start-btn')
let score = 0;
let randomNext = 0;
let timerID;
const colours = [
    '#a6dcef',
    '#cff6cf',
    '#f6def6',
    '#ffa5b0',
    '#3f3f44'
]

function createBoard() {
    for (let y = 0; y < width * height; y++){
        const block = document.createElement('div');
        board.append(block)
    }
}

function createTaken() {
    for (let i = 0; i < width; i++) {
        const taken = document.createElement('div');
        taken.className = "taken";
        board.append(taken)
    }
}

createBoard();
createTaken();

//must go after
let blocks= Array.from(document.querySelectorAll('.board div'))

const nextBoard = document.createElement('div');
nextBoard.className = "nextBoard";
leftside.append(nextBoard)

function mini() {
    for (let l = 0; l < 16; l++) {
        const mini = document.createElement('div');
        mini.className = "mini";
        nextBoard.append(mini)
    }
    const nextBoardCaption = document.createElement('p');
    nextBoardCaption.innerHTML = '<strong> ^ Next Shape ^</strong>';
    nextBoardCaption.style.fontSize = '0.85rem'
    nextBoard.append(nextBoardCaption);
}

mini(); 
        
const lTet = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

const zTet = [
    [0, width, width+1, width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
]

const tTet= [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTet = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]
 
const iTet = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const allTets = [lTet, zTet, tTet, oTet, iTet]

let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random() * allTets.length);
let current = allTets[random][currentRotation];

function drawShape() {
      current.forEach(index => {
          blocks[currentPosition + index].classList.add('tet');
          blocks[currentPosition + index].style.backgroundColor = colours[random];
      })
  }

function undrawShape() {
    current.forEach(index => {
        blocks[currentPosition + index].classList.remove('tet');
        blocks[currentPosition + index].style.backgroundColor = '';
    })
}

document.addEventListener('keyup', event => {
    if(event.keyCode === 37) { //left
        moveLeft();
    } else if (event.keyCode === 38) {
        rotateShape();
    } else if (event.keyCode === 39) {
        moveRight();
    } else if (event.keyCode === 40) {
        moveDown();
    }
})

function moveDown() {
    undrawShape();
    currentPosition += width
    drawShape();
    freezeShape();
}

function freezeShape() {
    if(current.some(index => blocks[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => blocks[currentPosition + index].classList.add('taken'))
        
        random = randomNext;
        randomNext = Math.floor(Math.random() * allTets.length);
        current = allTets[random][currentRotation];
        currentPosition = 4
        drawShape(); 
        displayNextShape();
        countScore();
        gameOver();
    }
}

function moveLeft() {
    undrawShape();
    const leftEdgeReached = current.some(index => (currentPosition + index) % width === 0)

    if(!leftEdgeReached) {
        currentPosition -=1;
    }

    if (current.some(index => blocks[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1;
    }

    drawShape();
}

function moveLeft() {
    undrawShape();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => blocks[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    drawShape();
}

function moveRight() {
    undrawShape();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width - 1))
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => blocks[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    drawShape();
}

function moveDown() {
    undrawShape();
    currentPosition += width;
    drawShape();
    freezeShape();
}

function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
}
  
function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
}

function checkRotatedPosition(P){
    P = P || currentPosition       
    if ((P+1) % width < 4) {           
      if (isAtRight()){          
        currentPosition += 1    
        checkRotatedPosition(P) 
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

function rotateShape() {
    undrawShape();
    currentRotation++;
    if (currentRotation === current.length) {
        currentRotation = 0;
    }
    current = allTets[random][currentRotation]
    checkRotatedPosition();
    drawShape();
    freezeShape();
}

const displayNext = Array.from(document.querySelectorAll('.nextBoard div'))
const upNextShapes = [
    [1,2,5,9],
    [5,6,8,9],
    [5,8,9,10],
    [5,6,9,10],
    [1,5,9,13]
]

function displayNextShape() {
    for (let i = 0; i < 16; i++) {
        displayNext[i].classList.remove('tet');
        displayNext[i].style.backgroundColor = '';
    }
    for (let i = 0; i < 4; i++) {
        const indexPos = upNextShapes[randomNext][i]
        displayNext[indexPos].classList.add('tet');
        displayNext[indexPos].style.backgroundColor = colours[randomNext];
    }
}

startButton.addEventListener('click', () => {
    afterSpeedChosen(1000);
});

const fasterButton = document.querySelector('.faster');
fasterButton.addEventListener('click', () => {
    afterSpeedChosen(500);
})

const fastestButton = document.querySelector('.fastest');
fastestButton.addEventListener('click', () => {
    afterSpeedChosen(100);
})

const scaryFastButton = document.querySelector('.scary-fast');
scaryFastButton.addEventListener('click', () => {
    afterSpeedChosen(20);
})

function afterSpeedChosen(time) {
    if(timerID) {
        clearInterval(timerID)
        timerID = null;
        startButton.innerHTML = `START`
    } else {
        drawShape();
        timerID = setInterval(moveDown, time)
        nextRandom = Math.floor(Math.random() * allTets.length);
        displayNextShape();
        startButton.innerHTML = `PAUSE`
    }
}

function countScore() {
    for (let m = 0; m < height*width; m +=width) {
      const row = [m, m+1, m+2, m+3, m+4, m+5, m+6, m+7, m+8, m+9]

      if(row.every(index => blocks[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          blocks[index].classList.remove('taken','tet')
          blocks[index].style.backgroundColor = ''
        })
        const blocksRemoved = blocks.splice(m, width)
        blocks = blocksRemoved.concat(blocks)
        blocks.forEach(cell => board.appendChild(cell))
      }
    }
  }

function gameOver() {
    if(current.some((index) => blocks[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'GAME OVER';
        startButton.addEventListener('click', clearBoard())
        fastButton.addEventListener('click', clearBoard())
        fasterButton.addEventListener('click', clearBoard())
        scaryFastButton.addEventListener('click', clearBoard())
        function clearBoard() {
            for (let cell = 0; cell < height * width; cell++) {
                blocks[cell].classList.remove('taken','tet')
                blocks[cell].style.backgroundColor = '';
            }
            for (let mini = 0; mini < 16; mini++) {
                displayNext[mini].classList.remove('tet');
                displayNext[mini].style.backgroundColor = ''; 
            }
            scoreDisplay.innerHTML = '0'
            clearInterval(timerID);
            startButton.innerHTML = 'RESTART'
        } 
    }
}