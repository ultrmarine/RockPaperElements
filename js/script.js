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


// globalno zagaju переменную таймера так как он запрятан в функции
let intervalTimer
let intervalTimerEndRound

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none'
    preGameScreen.style.display = 'flex'

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
        roundTimer()
        textNickname.innerHTML = nickInp.value
        gameScreen.style.display = 'flex'
        preGameScreen.style.display = 'none'
    }
})

closePreGameScreen.addEventListener('click', () => {
    startScreen.style.display = 'flex'
    preGameScreen.style.display = 'none'
})

const textAppliedSkill = document.getElementById("text-applied-skill")


function textSkills(){ 
    let top = "0px"
    let fontSize = "25px"

    if (selectSkill == 0) {
        text = "No skills applied"
        top = "0px"
        fontSize = "40px"
    } else if (selectSkill >= 1 && selectSkill <= 4) {
        // та же самая тема,что и в питоне,только нужны эти ублюдские скобки который я не знаю как ставить на английской клаве
        text = `На следующий раунд заблокирована ${selectSkill} группа жестов`
    } else if (selectSkill == 5) {
        text = "На этот раунд ваш урон и проходящий по вам урон увеличен на 1 "
        top = "-20px"
        fontSize = "30px"
    }

    textAppliedSkill.innerHTML = text;
    textAppliedSkill.style.top = top;
    textAppliedSkill.style.fontSize = fontSize;
}

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


let textRoundCount = document.getElementById("text-round-count")
let roundCount = 1

const gesture_wins = {
    "rock": ["fire","scissors","snake","person","tree","wolf","sponge","paper", "group1"],
    "fire": ["scissors","snake","person","tree","wolf","sponge","paper","air",  "group1"],
    "scissors": ["snake","person","tree","wolf","sponge","paper","air","water",  "group1"],
    "snake": ["person","tree","wolf","sponge","paper","air","water","boom",  "group1"],
    "person": ["tree","wolf","sponge","paper","air","water","boom","dragon",  "group2"],
    "tree": ["wolf","sponge","paper","air","water","boom","dragon","devil",  "group2"],
    "wolf": ["sponge","paper","air","water","boom","dragon","devil","lightning",  "group2"],
    "sponge": ["paper","air","water","boom","dragon","devil","lightning","pistol",  "group2"],
    "paper": ["air","water","boom","dragon","devil","lightning","pistol","rock",  "group3"],
    "air": ["water","boom","dragon","devil","lightning","pistol","rock","fire",  "group3"],
    "water": ["boom","dragon","devil","lightning","pistol","rock","fire","scissors",  "group3"],
    "boom": ["dragon","devil","lightning","pistol","rock","fire","scissors","snake",  "group3"],
    "dragon": ["devil","lightning","pistol","rock","fire","scissors","snake","person",  "group4"],
    "devil": ["lightning","pistol","rock","fire","scissors","snake","person","tree",  "group4"],
    "lightning": ["pistol","rock","fire","scissors","snake","person","tree","wolf",  "group4"],
    "pistol": ["rock","fire","scissors","snake","person","tree","wolf","sponge",  "group4"]
}

const firstHp = document.getElementById("first-hp")
const secondHp = document.getElementById("second-hp")
const thirdHp = document.getElementById("third-hp")

const BotHpText = document.getElementById("bot-hp")

let playerHp = 6
let botHp = 6

// let test123 = Object.keys(gesture_wins);
// console.log(test123[15])  //выводит пистол
// const test141 = Object.keys(gesture_wins);
// console.log(Math.random() * test141.length) // чисто в теории рандомно всё выводит

let playerGestureChoice = "-"

const gestureAllButtons = document.querySelectorAll("[data-gesture]")

gestureAllButtons.forEach(button => {
    button.addEventListener("click", () => {
        // литерли просто берёт дата аттрибут из html
        playerGestureChoice = button.dataset.gesture
        textPlayerChoice.innerHTML = "Твой выбор: " + playerGestureChoice
    })
})


// function botChooseGesture() {
//     const gestures = Object.keys(gesture_wins);
//     // матх рандом выдаёт рандом число от 0 до 1,потом перемножаем на всю длинну списка жестов и округляем - выходит типа псевдо-рандом жеста
//     const random = Math.floor(Math.random() * gestures.length);
//     return gestures[random];
// }

// если вызывать каждый раз функции по новой,то жест постояннл разный будет и это всё ломает
// console.log(botChooseGesture1)
// console.log(botChooseGesture1)
// botChooseGesture1 = botChooseGesture()
// console.log(botChooseGesture1)
// console.log(botChooseGesture1)
// console.log(botChooseGesture1)


let botChooseGesture1

confirmBtn.addEventListener('click', () => {
    if(playerGestureChoice != "-") {
        roundMana()
        textTimerRound.innerHTML = "TIME: 5 s"
        clearInterval(intervalTimer)
        textTimer.innerHTML = "TIME: 60 s"
        if (roundScreen.style.display == "none"){
            roundScreen.style.display = 'flex'
            endRoundTimer()
        }
        textEnemyMove.innerHTML = "Противник сыграл " + botChooseGesture1
        if (playerGestureChoice == botChooseGesture1){
            textRoundTotal.innerHTML = "У вас ничья"
        } else{
            if (gesture_wins[playerGestureChoice].includes(botChooseGesture1)){
                textRoundTotal.innerHTML = "Ты выйграл"
                botHpLose()
            } else{
                textRoundTotal.innerHTML = "Ты проиграл вамп вамп"
                playerHpLose()
            }
        }
    } else{
        alert("Для подтверждения нужно выбрать жест") //потом заменить алёрт на pop окно
    }
})

// простейшая функция таймера,если таймер заканчивается,а игрок ничё не выбрал - пикает камень
function roundTimer(){
    if (selectSkill >= 1 && selectSkill <= 4) {
        botChooseGesture1 = botChooseGesture(`group${selectSkill}`)
        // console.log(`TETSTETESTET group${selectSkill}`)
        selectSkill = 0
        textSkills()
    } else {
        botChooseGesture1 = botChooseGesture()
    }
    // console.log(botChooseGesture1)
    textRoundCount.innerHTML = roundCount
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

function endRoundTimer(){
    let defaultTimer = 5
    roundCount += 1
    textRoundCount.innerHTML = roundCount
    textRoundScreen.innerHTML = "Конец " + (roundCount-1) + " раунда"

    gameScreen.style.pointerEvents = "none"
    intervalTimerEndRound = setInterval(() => {
        defaultTimer-=1
        textTimerRound.innerHTML = "TIME: " + defaultTimer +" s"
        if (defaultTimer <= 0){
            clearInterval(intervalTimerEndRound)
            roundScreen.style.display = 'none'
            gameScreen.style.pointerEvents = "auto"
            textSkills()
            roundTimer()
        }
    }, "1000")
}


// это всё желательно сократить,ну я вообще не представляю как
function playerHpLose(){
    if (selectSkill == 5){
        playerHp -= 2
        selectSkill = 0
    } else{
        playerHp -= 1
    }

    if (playerHp == 5){
        // я 20 минут потратил,что бы понять что js не воспринимает нормально \ - вот такие базовые для путей слэши :)))))))))
        firstHp.src = "assets/icons/half-red-hp.png"
    }
    if (playerHp == 4) {
        firstHp.src = "assets/icons/empty-hp.png"

        avatarImg.src = "assets/avatars/skeleton2.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard2.png"
        } else if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental2.png"
        }
    }
    if (playerHp == 3) {
        firstHp.src = "assets/icons/empty-hp.png"
        secondHp.src = "assets/icons/half-red-hp.png"

        avatarImg.src = "assets/avatars/skeleton2.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard2.png"
        } else if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental2.png"
        }
    }
    if (playerHp == 2) {
        firstHp.src = "assets/icons/empty-hp.png"
        secondHp.src = "assets/icons/empty-hp.png"

        avatarImg.src = "assets/avatars/skeleton3.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard3.png"
        } else if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental3.png"
        }
    }
    if (playerHp == 1) {
        firstHp.src = "assets/icons/empty-hp.png"
        secondHp.src = "assets/icons/empty-hp.png"
        thirdHp.src = "assets/icons/half-red-hp.png"

        avatarImg.src = "assets/avatars/skeleton3.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard3.png"
        } else if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental3.png"
        }
    }
    if (playerHp <= 0) {
        firstHp.src = "assets/icons/empty-hp.png"
        secondHp.src = "assets/icons/empty-hp.png"
        thirdHp.src = "assets/icons/empty-hp.png"

        avatarImg.src = "assets/avatars/skeleton3.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard3.png"
        } else if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental3.png"
        }
        setTimeout(() => {
            lose()
        },5500)
    }
}

function lose(){
    clearInterval(intervalTimer)
    loseWinScreen.style.display = "flex"
    gameScreen.style.pointerEvents = "none"
}

function win(){
    clearInterval(intervalTimer)
    loseWinText.innerHTML = "Ты выйграл!!!"
    loseWinScreen.style.display = "flex"
    gameScreen.style.pointerEvents = "none"
}

function botHpLose(){
    if (selectSkill == 5){
        botHp -= 2
        selectSkill = 0
    } else {
        botHp -= 1
    }
    BotHpText.innerHTML = "BOT HP "+ botHp
    if(botHp <= 0){
        botHp = 0
        setTimeout(() => {
            win()
        },5500)
    }
}

// let testtimer = 60; // defoltni timer
// setInterval(() => {
//     console.log(testtimer-=1)
// }, "1000")

