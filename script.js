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
    startScreen.style.display = 'none';
    preGameScreen.style.display = 'flex';

});


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


let textRoundCount = document.getElementById("text-round-count")
let roundCount = 1

const gesture_wins = {
    "rock": ["fire","scissors","snake","person","tree","wolf","sponge",  "group1"],
    "fire": ["scissors","snake","person","tree","wolf","sponge","paper",  "group1"],
    "scissors": ["snake","person","tree","wolf","sponge","paper","air",  "group1"],
    "snake": ["person","tree","wolf","sponge","paper","air","water",  "group1"],
    "person": ["tree","wolf","sponge","paper","air","water","boom",  "group2"],
    "tree": ["wolf","sponge","paper","air","water","boom","dragon",  "group2"],
    "wolf": ["sponge","paper","air","water","boom","dragon","devil",  "group2"],
    "sponge": ["paper","air","water","boom","dragon","devil","lightning",  "group2"],
    "paper": ["air","water","boom","dragon","devil","lightning","pistol",  "group3"],
    "air": ["water","boom","dragon","devil","lightning","pistol","rock",  "group3"],
    "water": ["boom","dragon","devil","lightning","pistol","rock","fire",  "group3"],
    "boom": ["dragon","devil","lightning","pistol","rock","fire","scissors",  "group3"],
    "dragon": ["devil","lightning","pistol","rock","fire","scissors","snake",  "group4"],
    "devil": ["lightning","pistol","rock","fire","scissors","snake","person",  "group4"],
    "lightning": ["pistol","rock","fire","scissors","snake","person","tree",  "group4"],
    "pistol": ["rock","fire","scissors","snake","person","tree","wolf",  "group4"]
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

const gestureAllButtons = document.querySelectorAll("[data-gesture]");

gestureAllButtons.forEach(button => {
    button.addEventListener("click", () => {
        // литерли просто берёт дата аттрибут из html
        playerGestureChoice = button.dataset.gesture;
        textPlayerChoice.innerHTML = "Твой выбор: " + playerGestureChoice;
    });
});


// function botChooseGesture() {
//     const gestures = Object.keys(gesture_wins);
//     // матх рандом выдаёт рандом число от 0 до 1,потом перемножаем на всю длинну списка жестов и округляем - выходит типа псевдо-рандом жеста
//     const random = Math.floor(Math.random() * gestures.length);
//     return gestures[random];
// }

// если вызывать каждый раз функции по новой,то жест постояннл разный будет и это всё ломает
let botChooseGesture1
// console.log(botChooseGesture1)
// console.log(botChooseGesture1)
// botChooseGesture1 = botChooseGesture()
// console.log(botChooseGesture1)
// console.log(botChooseGesture1)
// console.log(botChooseGesture1)


confirmBtn.addEventListener('click', () => {
    if(playerGestureChoice != "-") {
        roundMana()
        textTimerRound.innerHTML = "TIME: 5 s"
        clearInterval(intervalTimer)
        textTimer.innerHTML = "TIME: 60 s"
        if (roundScreen.style.display == "none"){
            roundScreen.style.display = 'flex';
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
    }
    // нужно сделать уведомление того,что нужно выбрать жест для подтверждени по типу alert или pop окна
});

// простейшая функция таймера,если таймер заканчивается,а игрок ничё не выбрал - пикает камень
function roundTimer(){
    if (selectSkill == 1){
        botChooseGesture1 = botChooseGesture("group1")
        selectSkill = 0
        console.log("Virubili 1")
    } else if(selectSkill == 2){
        botChooseGesture1 = botChooseGesture("group2")
        selectSkill = 0
        console.log("Virubili 2")
    } else if(selectSkill == 3){
        botChooseGesture1 = botChooseGesture("group3")
        selectSkill = 0
        console.log("Virubili 3")
    } else if(selectSkill == 4){
        botChooseGesture1 = botChooseGesture("group4")
        selectSkill = 0
        console.log("Virubili 4")
    } else{
        botChooseGesture1 = botChooseGesture()
    }
    // console.log(botChooseGesture1)
    textRoundCount.innerHTML = roundCount;
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
    intervalTimerEndRound = setInterval(() => {
        defaultTimer-=1
        textTimerRound.innerHTML = "TIME: " + defaultTimer +" s"
        if (defaultTimer <= 0){
            clearInterval(intervalTimerEndRound)
            roundScreen.style.display = 'none';
            roundTimer()
        }
    }, "1000")
}

function playerHpLose(){
    playerHp -= 1
    if (playerHp == 5){
        // я 20 минут потратил,что бы понять что js не воспринимает нормально \ - вот такие базовые для путей слэши :)
        firstHp.src = "assets/icons/half-red-hp.png"
    }
    if (playerHp == 4) {
        firstHp.src = "assets/icons/empty-hp.png"

        avatarImg.src = "assets/avatars/skeleton2.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard2.png"
        } 
        if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental2.png"
        }
    }
    if (playerHp == 3) {
        firstHp.src = "assets/icons/empty-hp.png"
        secondHp.src = "assets/icons/half-red-hp.png"

        avatarImg.src = "assets/avatars/skeleton2.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard2.png"
        } 
        if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental2.png"
        }
    }
    if (playerHp == 2) {
        firstHp.src = "assets/icons/empty-hp.png"
        secondHp.src = "assets/icons/empty-hp.png"

        avatarImg.src = "assets/avatars/skeleton3.jpg"
        if (selectImg.value == "wizard"){
            avatarImg.src = "assets/avatars/wizard3.png"
        } 
        if(selectImg.value == "elemental"){
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
        } 
        if(selectImg.value == "elemental"){
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
        } 
        if(selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental3.png"
        }
        setTimeout(() => {
            loseWinScreen.style.display = "flex"
        },5500)
    }
}

function botHpLose(){
    botHp -= 1
    BotHpText.innerHTML = "BOT HP "+ botHp
    if(botHp <= 0){
        setTimeout(() => {
            loseWinText.innerHTML = "Ты выйграл!!!"
            loseWinScreen.style.display = "flex"
        },5500)
    }
}




// let testtimer = 60; // defoltni timer
// setInterval(() => {
//     console.log(testtimer-=1)
// }, "1000")


// всё что связано с маной и способностями
const divManaCount = document.getElementById("div-mana-count")
const textManaCount = document.getElementById("text-mana-count")

let playerManaCount = 2;
let divManaHeight = 450;


// вынеc всю проверку маны в отдельную функцию,чтоб не срать в остальных
function calcMana(){
    divManaHeight = 450 - (playerManaCount*50)
    divManaCount.style.height = divManaHeight + "px"
    divManaCount.style.display = "flex"
    if (playerManaCount >= 10){
        playerManaCount = 10
        divManaCount.style.display = "none"
    }
    textManaCount.innerHTML = playerManaCount + " mana"
    if (playerManaCount == 0){
        textManaCount.style.display = "none"
    } else{
        textManaCount.style.display = "flex"
    }
}

function roundMana(){
    if (playerManaCount < 10){
        playerManaCount+= 2
    }
    calcMana()
}

// пикает все кнопочки с классом этим,а потом я вызываю их через инлекс,так удобнее я глаголю
const skillsBtn = document.querySelectorAll(".skills-btn")

let selectSkill = 0

skillsBtn[0].addEventListener("click", () => {
    if (playerManaCount >= 2 && selectSkill == 0){
        playerManaCount-= 2
        selectSkill = 1
    }
    calcMana()
})

skillsBtn[1].addEventListener("click", () => {
    if (playerManaCount >= 2 && selectSkill == 0){
        playerManaCount-= 2
        selectSkill = 2
    }
    calcMana()
})

skillsBtn[2].addEventListener("click", () => {
    if (playerManaCount >= 2 && selectSkill == 0){
        playerManaCount-= 2
        selectSkill = 3
    }
    
    calcMana()
})

skillsBtn[3].addEventListener("click", () => {
    if (playerManaCount >= 2 && selectSkill == 0){
        playerManaCount-= 2
        selectSkill = 4
    }
    calcMana()
})

// тот же самый рандомный выбор бота,только теперь учитывает выключение одной из групп
function botChooseGesture(Group) {
    const gestures = Object.keys(gesture_wins)
    // тотальный ужас,короче фильтрует весь лист от 1 группы и бот пикает жесты без неё
    // gesture это мы обращаемся в html файл к аттрибуту дата-гестур
    const availGestures = gestures.filter(gesture => {
        const all_gesture = gesture_wins[gesture]
        const all_group = all_gesture[all_gesture.length - 1]
        return all_group != Group
    });
    const random = Math.floor(Math.random() * availGestures.length)
    return availGestures[random]
}