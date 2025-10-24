const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const preGameScreen = document.getElementById("pre-game-screen")

const playBtn = document.getElementById("play-btn")
const closePreGameScreen = document.getElementById("close-pre-game-screen")

const confirmBtn = document.getElementById("confirm-btn")
const roundScreen = document.getElementById("round-screen")



startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    preGameScreen.style.display = 'flex';
});

playBtn.addEventListener('click', () => {
    gameScreen.style.display = 'flex';
    preGameScreen.style.display = 'none';
});

closePreGameScreen.addEventListener('click', () => {
    startScreen.style.display = 'flex';
    preGameScreen.style.display = 'none';
});

confirmBtn.addEventListener('click', () => {
    if (roundScreen.style.display == "none"){
        roundScreen.style.display = 'flex';
    } else {
        roundScreen.style.display = "none"
    }
});

const rockBtn = document.getElementById("btn-gesture1")
const fireBtn = document.getElementById("btn-gesture2")
const scissorsBtn = document.getElementById("btn-gesture3")
const snakeBtn = document.getElementById("btn-gesture4")
const personBtn = document.getElementById("btn-gesture5")
const treeBtn = document.getElementById("btn-gesture6")
const wolfBtn = document.getElementById("btn-gesture7")
const spongeBtn = document.getElementById("btn-gesture8")
const paperBtn = document.getElementById("btn-gesture9")
const airBtn = document.getElementById("btn-gesture10")
const waterBtn = document.getElementById("btn-gesture11")
const boomBtn = document.getElementById("btn-gesture12")
const dragonBtn = document.getElementById("btn-gesture13")
const devilBtn = document.getElementById("btn-gesture14")
const lightningBtn = document.getElementById("btn-gesture15")
const pistolBtn = document.getElementById("btn-gesture16")

let playerGestureChoice = 0;

// забыл про взрыв,переделать

const gesture_wins = {
    "rock": ["fire","scissors","snake","person","tree","wolf","sponge"],
    "fire": ["scissors","snake","person","tree","wolf","sponge","paper"],
    "scissors": ["snake","person","tree","wolf","sponge","paper","air"],
    "snake": ["person","tree","wolf","sponge","paper","air","water"],
    "person": ["tree","wolf","sponge","paper","air","water","dragon"],
    "tree": ["wolf","sponge","paper","air","water","dragon","devil"],
    "wolf": ["sponge","paper","air","water","dragon","devil","lightning"],
    "sponge": ["paper","air","water","dragon","devil","lightning","pistol"],
    "paper": ["air","water","dragon","devil","lightning","pistol","rock"],
    "air": ["water","dragon","devil","lightning","pistol","rock","fire"],
    "water": ["dragon","devil","lightning","pistol","rock","fire","scissors"],
    "water": ["dragon","devil","lightning","pistol","rock","fire","scissors"],
}