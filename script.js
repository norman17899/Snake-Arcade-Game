let gameboard = document.getElementById("gameboard");
let scoreDisplay = document.getElementById("score")

let speed = 7;
let snakeBody = [{x : 11, y : 11}];
let newSegments = 0;
let food = getRandomFoodPosition();
let growth = 1;
let inputDirection = {x : 0, y : 0};
let lastInputDirection = {x : 0, y : 0};

let gameOver = false;
let score = 0;

//game loop
function drawGame() {
    gameboard.innerHTML = "";
    // refresh after loss
    if (gameOver){
        if (confirm ("GAME OVER. PRESS OK TO RESTART")) {
            window.location.reload();
        } return scoreDisplay.innerHTML = "GAME OVER";
    }
    updateSnake();
    drawSnake();
    updateFood();
    drawFood();
    checkDeath();

    setTimeout(drawGame, 1000 / speed);

    // increase speed
    if (score > 10) {
        speed = 9;
    }
    if (score > 20) {
        speed = 11;
    }
    if (score > 30) {
        speed = 13;
    }
    if (score > 40) {
        speed = 15;
    }
    if (score > 50) {
        speed = 17;
    }
}

function getInputDirection () {
    lastInputDirection = inputDirection;
    return inputDirection;
}

// the snake portion
function updateSnake () {
   addSegment ();
    let direction = getInputDirection();
   for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = {...snakeBody[i]}
   }
   snakeBody[0].x += direction.x;
   snakeBody[0].y += direction.y;
}

function drawSnake (gameBoard) {
    snakeBody.forEach(segment => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add("snake");
        gameboard.appendChild(snakeElement);
    })
}

function growSnake (amount) {
    newSegments += amount;
}

function onSnake (position, {ignoreHead = false} = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) {
            return false;
        }
        return equalPostions (segment, position)
    })
}

function equalPostions (pos1, pos2) {
    return (
        pos1.x === pos2.x && pos1.y === pos2.y
    )
}

function addSegment () {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push ({...snakeBody[snakeBody.length - 1]})
    }
    newSegments = 0;
}

//the food portion
function updateFood () {
    if(onSnake(food)) {
        growSnake(growth)
        food = getRandomFoodPosition();
        score++;
        scoreDisplay.innerHTML = "Score: " + score;
    }
}

function drawFood (gameBoard) {
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    gameboard.appendChild(foodElement)
}

function getRandomFoodPosition () {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    } return newFoodPosition;
}

function randomGridPosition () {
    return {
        x: Math.ceil(Math.random() * 21),
        y: Math.ceil(Math.random() * 21)
    }
}



// arrow keys for control
document.body.addEventListener("keydown", function (event) {
    // up arrow key
    if (event.keyCode == 38) {
        if (lastInputDirection.y !== 0) {
            return;
        }
        inputDirection = {x : 0, y : -1}
    }
    // down arrow key
    if (event.keyCode == 40) {
        if (lastInputDirection.y !== 0) {
            return;
        }
        inputDirection = {x : 0, y : 1}
    }
    // left arrow key
    if (event.keyCode == 37) {
        if (lastInputDirection.x !== 0) {
            return;
        }
        inputDirection = {x : -1, y : 0}
    }
    // right arrow key
    if (event.keyCode == 39) {
        if (lastInputDirection.x !== 0) {
            return;
        }
        inputDirection = {x : 1, y : 0}
    }
})

function checkDeath () {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}

// if snake hits the boundary
function outsideGrid (position) {
    return (position.x < 1 || position.x > 21 || position.y < 1 || position.y > 21)
    }

function getSnakeHead () {
    return snakeBody[0];
}

// check if snake head touches anywhere on the body
function snakeIntersection () {
    return onSnake (snakeBody[0], {ignoreHead: true})
}

drawGame();