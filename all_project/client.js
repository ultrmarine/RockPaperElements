const socket = new WebSocket("ws://REDACTED_IP:3000"); // socket

socket.addEventListener("message", event => {
    console.log("📩 Сообщение от сервера:", event);
});

const startBtn = document.getElementById('start-btn')
const startScreen = document.getElementById('start-screen')
const gameScreen = document.getElementById('game-screen')
const preGameScreen = document.getElementById("pre-game-screen")

const playBtn = document.getElementById("play-btn")
const closePreGameScreen = document.getElementById("close-pre-game-screen")

const confirmBtn = document.getElementById("confirm-btn")
const roundScreen = document.getElementById("round-screen")
const nickInp = document.getElementById("nick-input")
const textNickname = document.getElementById("text-nickname")
const textTimer = document.getElementById("text-timer")
const textTimerRound = document.getElementById("text-timer-round-screen")
const textRoundScreen = document.getElementById("text-round-screen")

const loseWinScreen = document.getElementById("lose-win-screen")
const loseWinText = document.getElementById("lose-win-text")

const avatarImg = document.getElementById("avatar-img")

let selectImg = document.getElementById("avatar-select")

const playAgainBtn = document.getElementById("play-again-btn")

const textAppliedSkill = document.getElementById("text-applied-skill")

const textRoundTotal = document.getElementById("text-round-total")

const hp = ["assets/icons/red-hp.png","assets/icons/half-red-hp.png","assets/icons/empty-hp.png"]

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none'
    preGameScreen.style.display = 'flex'
})

closePreGameScreen.addEventListener('click', () => {
    startScreen.style.display = 'flex'
    preGameScreen.style.display = 'none'
})

playBtn.addEventListener('click', () => {
    if (nickInp.value == ""){
        nickInp.value = "Default user"
    } else{
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard1.png"
        }
        if (selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental1.png"
        }
        socket.send("startTimer")
        textNickname.innerHTML = nickInp.value
        gameScreen.style.display = 'flex'
        preGameScreen.style.display = 'none'
    }
})

socket.addEventListener("message", event => {
    const data = JSON.parse(event.data);

    if (data.type === "timerUpdate") {
        const textTimer = document.getElementById("text-timer");
        textTimer.innerHTML = `TIME: ${data.value} s`;
    }

    if (data.type === "timerUpdate") {
        const textTimer = document.getElementById("text-timer");
        textTimer.innerHTML = `TIME: ${data.value} s`;
    }

    if (data.type === "serverMessage") {
        console.log("server:", data.value);
    }
});


const gestureAllButtons = document.querySelectorAll("[data-gesture]")

gestureAllButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerGestureChoice = button.dataset.gesture
        socket.send(button.dataset.gesture)
        
    })
})



// игрок выбирает жест или ждет таймер
