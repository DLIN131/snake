/** @type {HTMLCanvasElement} */
//畫布設定
let c = document.getElementById('myCanvas');
let ctx = c.getContext("2d");
//記分板變數
const scoreEle = document.getElementById('score');
const levelEle = document.getElementById('level');
//遊戲相關變數
const menuEle = document.getElementById("menu");
const start = document.getElementById("start");
const volumeEle = document.getElementById("volume");
const exitEle = document.getElementById("exit");
let gameHint = document.getElementById("game-hint");
let width = c.width;
let height = c.height;
let gameOver = false;
let intV = null;
let reqA = null;
const kiritoImage = new Image(10,10); // Using optional size for image
kiritoImage.src = "./img/kirito.jpg";
const gameOverImg = new Image(width,height);
gameOverImg.src = "./img/gameOver.jpg";
const bgm = new Audio("./music/Sword Art Online ost 刀劍神域.mp3");
const blueEyesDemonImg = new Image();
blueEyesDemonImg.src = "./img/blueEyes.jpg";

// kiritoImage.addEventListener("load",function(){
//     ctx.drawImage(kiritoImage,0,0,10,10);
// })
volumeEle.addEventListener("change",function(){
    bgm.volume = this.value/100;
})

class Food{
    constructor(x,y){
        this.x = x;
        this.y = x;
        this.width = 10;
        this.height = 10;
    }
    draw(){
        // ctx.fillStyle = "black";
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(blueEyesDemonImg,this.x,this.y,this.width,this.height);
    }
    changePosition(){
        let randomPositionX  = Math.round(Math.random()*((width-this.width)/10))*10;
        let randomPositionY  = Math.round(Math.random()*((height-this.height)/10))*10;
        this.x = randomPositionX;
        this.y = randomPositionY;
        //console.log(this.x + " " + this.y);
    }
}

class Snake{
    constructor(x,y){
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
        this.speed = 10;
        this.key = "";
        this.body = [{
            x:this.x,
            y:this.y
        }
        ];
        this.color = ["red","orange","yellow","green","blue","purple",]
    }

    draw(){
        //ctx.fillRect(this.x,this.y,10,10);
        for(let i=0;i<this.body.length;i++){
            // ctx.fillStyle = this.color[score%this.color.length];
            // ctx.strokeRect(this.body[i].x,this.body[i].y,this.width,this.height);
            ctx.drawImage(kiritoImage,this.body[i].x,this.body[i].y,this.width,this.height);

        }
    }

    getKey(e){
        this.key = e.key;
    }
    
    controlSnake(){
        document.addEventListener('keydown',this.getKey.bind(this))
    }

    //更新蛇的位置
    update(){
        
        switch(this.key){
            case "w":     
                if(this.body[1] && this.body[1].y<this.body[0].y){
                    
                    this.y+=this.speed;
                    console.log("yyy");
                }
                else{
                    this.y -= this.speed;
                }
                break;
            case "s":
                if(this.body[1] && this.body[1].y>this.body[0].y){
                    this.y-=this.speed;
                    console.log("yyy");
                }
                else{
                    this.y += this.speed;
                }
                break;
            case "a":
                if(this.body[1] && this.body[1].x<this.body[0].x){   
                    this.x+=this.speed;
                    console.log("yyy");
                }
                else{
                    this.x -= this.speed;
                }
                break;
            case "d":
                if(this.body[1] && this.body[1].x>this.body[0].x){ 
                    this.x-=this.speed;
                    console.log("yyy");
                }
                else{
                    this.x += this.speed;
                }
                break;
        }
        for(let i=this.body.length-1;i>0;i--){
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
            ctx.fillRect(this.body[i].x,this.body[i].y,this.width,this.height);
        }
        this.body[0].x = this.x;
        this.body[0].y = this.y;
        console.log(this.x+" "+this.y);
        if(this.x < 0 || this.x > width || this.y < 0 || this.y > height){
            gameOver = true;
            console.log(gameOver);
        }
        for(let i = 5;i<snake.body.length;i++){
            if(this.x === this.body[i].x && this.y === this.body[i].y){
                gameOver = true;
            }
        }

    }

    armor(){
        this.height += 10;

    }
}

//創立遊戲所需物件
let food = null;
let snake = null;


let score = 0;
let level = 1;
function scorePaneSet(){
    scoreEle.innerHTML = "score: "+score;
    if(score%5 == 0 && score != 0){
        level++;
        levelEle.innerHTML = "Level: "+level;
    }
}

function foodBeEaten(){
    if(food.x === snake.x && food.y === snake.y){
        snake.body.push({
            x:food.x,
            y:food.y
        })
        //console.log(snake.body[2].x+" "+snake.x);
        food.changePosition();
        score++;
        scorePaneSet();
    }
}


snake = new Snake(0,0);
food = new Food(0,0);

function init(){
    snake.x = 0;
    snake.y = 0;
    snake.body = [{
        x:0,
        y:0
    }];
    snake.key = '';
    food.changePosition();
    snake.controlSnake();
    score = 0;
    level = 1;
    scorePaneSet();
    gameHint.innerHTML = "start!";
    bgm.play();
    
}

function update(){
    //console.log(food.x,food.y);
    foodBeEaten();
    snake.update();
    if(gameOver){  
        clearInterval(intV);
        cancelAnimationFrame(reqA);
        gameHint.innerHTML = "GameOver!"; 
    }
}

function draw(){
    ctx.clearRect(0,0,c.width,c.height)
    food.draw();
    snake.draw();
    console.log("continue run");
    if(gameOver){
        ctx.drawImage(gameOverImg,0,0,width,height);
        bgm.pause();
        bgm.currentTime = 0;
    }

    if(!gameOver){
        requestAnimationFrame(draw);
    }
    
}

function startGame(){
    init();
    clearInterval(intV);
    intV = setInterval(update, 62.5-level*2.5);
    gameOver = false;
    cancelAnimationFrame(reqA);
    reqA =  requestAnimationFrame(draw);
    // this.disabled = true;
}


start.addEventListener("click",startGame);
exitEle.addEventListener("click",()=>{
    window.close();
})
