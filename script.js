//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8; // horizontal position for the bird
let birdY = boardHeight / 2; //  vertical position for the bird
let birdImg;
////

// creating bird object
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes draw
let pipeArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

// game physics

let velocityX = -2; // pipes that are moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;
let gameOver = false;
let score = 0;

/////
window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // drawing flappy bird
    //context.fillStyle = "green";
    //context.fillRect(bird.x,bird.y,bird.width,bird.height)

    // load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";



    // updating the frames of the canvas (drawing the canvas over and over again)

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

// custom functions

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // this applies gravity to current bird.y, limiting the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if (bird.y > board.height) {
        gameOver= true;
    }
    //pipe
    for(let i=0;i<pipeArr.length;i++){

        let pipe = pipeArr[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score+= 5; // there are always 2 pipes so the bird crosses 2pipes simeltaneously, so now, two set of pipes gives 10score , I mean for single pipe logically
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArr.length > 0 && pipeArr[0].x < -pipeWidth){
        pipeArr.shift(); // this removes first element from the array
    }
    context.fillStyle = "white"
    context.font = "40px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("Game Over", 85, 100);
    }

    } // end of update function

function placePipes() {

    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight/2);
    let openingSpace = board.height/4;
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArr.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY+ pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArr.push(bottomPipe);
}

function moveBird(e){
	if(e.code == "Space" || e.code == "ArrowUP" || e.code == "keyX"){
	//jump
	velocityY = -6;
    //reset game
    if(gameOver){
        bird.y = birdY;
        pipeArr = [];
        score = 0;
        gameOver = false;
    }
}

}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y; 
    
 }

 function jumpBird() {
    if (!gameOver) {
        velocityY = -6;
    }
}



function playAgain(){

    
window.location.reload();
}
