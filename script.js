const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const preGameScreen = document.getElementById("pre-game-screen")

const playBtn = document.getElementById("play-btn")
const closePreGameScreen = document.getElementById("close-pre-game-screen")

const confirmBtn = document.getElementById("confirm-btn")
const roundScreen = document.getElementById("round-screen")
const nickInp = document.getElementById("nick-input")
const textNickname = document.getElementById("text-nickname")
const textTimer = document.getElementById("text-timer")


// globalno zagaju переменную таймера так как он запрятан в функции
let intervalTimer

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    preGameScreen.style.display = 'flex';

});

playBtn.addEventListener('click', () => {
    if (nickInp.value == ""){
        nickInp.value = "Default user"
    } else{
        roundTimer()
        textNickname.innerHTML = nickInp.value
        gameScreen.style.display = 'flex';
        preGameScreen.style.display = 'none';
    }
});

closePreGameScreen.addEventListener('click', () => {
    startScreen.style.display = 'flex';
    preGameScreen.style.display = 'none';
});

// Чё та пока что не нужно
// const rockBtn = document.getElementById("btn-gesture1")
// const fireBtn = document.getElementById("btn-gesture2")
// const scissorsBtn = document.getElementById("btn-gesture3")
// const snakeBtn = document.getElementById("btn-gesture4")
// const personBtn = document.getElementById("btn-gesture5")
// const treeBtn = document.getElementById("btn-gesture6")
// const wolfBtn = document.getElementById("btn-gesture7")
// const spongeBtn = document.getElementById("btn-gesture8")
// const paperBtn = document.getElementById("btn-gesture9")
// const airBtn = document.getElementById("btn-gesture10")
// const waterBtn = document.getElementById("btn-gesture11")
// const boomBtn = document.getElementById("btn-gesture12")
// const dragonBtn = document.getElementById("btn-gesture13")
// const devilBtn = document.getElementById("btn-gesture14")
// const lightningBtn = document.getElementById("btn-gesture15")
// const pistolBtn = document.getElementById("btn-gesture16")

const textRoundTotal = document.getElementById("text-round-total")
let textPlayerChoice = document.getElementById("text-player-choice")
let textEnemyMove = document.getElementById("text-enemy-move")

const gesture_wins = {
    "rock": ["fire","scissors","snake","person","tree","wolf","sponge"],
    "fire": ["scissors","snake","person","tree","wolf","sponge","paper"],
    "scissors": ["snake","person","tree","wolf","sponge","paper","air"],
    "snake": ["person","tree","wolf","sponge","paper","air","water"],
    "person": ["tree","wolf","sponge","paper","air","water","boom"],
    "tree": ["wolf","sponge","paper","air","water","boom","dragon"],
    "wolf": ["sponge","paper","air","water","boom","dragon","devil"],
    "sponge": ["paper","air","water","boom","dragon","devil","lightning"],
    "paper": ["air","water","boom","dragon","devil","lightning","pistol"],
    "air": ["water","boom","dragon","devil","lightning","pistol","rock"],
    "water": ["boom","dragon","devil","lightning","pistol","rock","fire"],
    "boom": ["dragon","devil","lightning","pistol","rock","fire","scissors"],
    "dragon": ["devil","lightning","pistol","rock","fire","scissors","snake"],
    "devil": ["lightning","pistol","rock","fire","scissors","snake","person"],
    "lightning": ["pistol","rock","fire","scissors","snake","person","tree"],
    "pistol": ["rock","fire","scissors","snake","person","tree","wolf"],
}

// let test123 = Object.keys(gesture_wins);
// console.log(test123[15])  //выводит пистол
// const test141 = Object.keys(gesture_wins);
// console.log(Math.random() * test141.length) // чисто в теории рандомно всё выводит

let playerGestureChoice = "-";

const gestureAllButtons = document.querySelectorAll("[data-gesture]");

gestureAllButtons.forEach(button => {
    button.addEventListener("click", () => {
        // литерли просто берёт дата аттрибут из html
        playerGestureChoice = button.dataset.gesture;
        textPlayerChoice.innerHTML = "Твой выбор: " + playerGestureChoice;
    });
});


function botChooseGesture() {
    const gestures = Object.keys(gesture_wins);
    // матх рандом выдаёт рандом число от 0 до 1,потом перемножаем на всю длинну списка жестов и округляем - выходит типа псевдо-рандом
    const randomIndex = Math.floor(Math.random() * gestures.length);
    return gestures[randomIndex];
}

// если вызывать каждый раз функции по новой,то жест постояннл разный будет и это всё ломает
let botChooseGesture1 = botChooseGesture();

confirmBtn.addEventListener('click', () => {
    clearInterval(intervalTimer)
    if (roundScreen.style.display == "none"){
        roundScreen.style.display = 'flex';
    } else {
        roundScreen.style.display = "none"
    }
    textEnemyMove.innerHTML = "Противник сыграл " + botChooseGesture1
    if (playerGestureChoice == botChooseGesture1){
        textRoundTotal.innerHTML = "У вас ничья"
    } else{
        if (gesture_wins[playerGestureChoice].includes(botChooseGesture1)){
            textRoundTotal.innerHTML = "Ты выйграл"
        } else{
            textRoundTotal.innerHTML = "Ты проиграл вамп вамп"
        }
    }
});

// простейшая функция таймера,если таймер заканчивается,а игрок ничё не выбрал - пикает камень
function roundTimer(){
    let defaultTimer = 60
    intervalTimer = setInterval(() => {
        defaultTimer-=1
        textTimer.innerHTML = "TIME: " + defaultTimer +" s"
        if (defaultTimer <= 0){
            clearInterval(intervalTimer)
            playerGestureChoice = "rock"
            confirmBtn.click()
        }
    }, "1000")
}


// let testtimer = 60; // defoltni timer
// setInterval(() => {
//     console.log(testtimer-=1)
// }, "1000")

