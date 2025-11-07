const socket = new WebSocket("ws://REDACTED_IP:3000"); // socket

socket.addEventListener("message", event => {
    console.log("Сообщение от сервера:", event);
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

let textRoundCount = document.getElementById("text-round-count")

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
            socket.send(JSON.stringify({
                    type: "AvatarImg",
                    value: "wizard"
                }));
        }
        if (selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental1.png"
            socket.send(JSON.stringify({
                    type: "AvatarImg",
                    value: "elemental"
                }));
        }
        socket.send(JSON.stringify({
                    type: "startTimer"
                }));
        textNickname.innerHTML = nickInp.value
        gameScreen.style.display = 'flex'
        preGameScreen.style.display = 'none'
    }
})

// let data1,data2,data3,data4;
let textEnemyMove = document.getElementById("text-enemy-move")

const divManaCount = document.getElementById("div-mana-count")
const textManaCount = document.getElementById("text-mana-count")

const textBotSkill = document.getElementById("text-bot-skill")

socket.addEventListener("message", event => {
    const data = JSON.parse(event.data);

    if (data.type === "timerUpdate"){
        textTimer.innerHTML = `TIME: ${data.value} s`
    }
    if (data.type === "serverMessage"){
        console.log("server:", data.value);
    }
    if (data.type === "roundStatus"){
        textRoundTotal.innerHTML = data.value
    }
    if (data.type === "roundScreenState"){
        if (roundScreen.style.display == "none"){
            roundScreen.style.display = 'flex'
        }
        textRoundCount.innerHTML = data.value
        textRoundScreen.innerHTML = "Конец " + (data.value-1) + " раунда"
        textEnemyMove.innerHTML = "Противник сыграл " + data.value2
        gameScreen.style.pointerEvents = "none"
    }
    if (data.type === "EndTimerUpdate"){
        textTimerRound.innerHTML = "TIME: " + data.value +" s"
    }
    if (data.type === "EndTimerClose"){
        roundScreen.style.display = 'none'
        gameScreen.style.pointerEvents = "auto"
        textTimerRound.innerHTML = "TIME: 5 s"
        textTimer.innerHTML = `TIME: 60 s`
    }
    if (data.type === "testHp" ){
        calcHpAvatar(data.value,data.value2,data.value3,data.value4)
    }
    if (data.type === "Hp" ){
        // console.log("TESTTETESTETESTT",data1)
        // data1 = data.value
        // data2 = data.value2
        // data3 = data.value3
        // data4 = data.value4
        calcHpAvatar()
    }
    if (data.type === "loseGame" ){
        loseWinScreen.style.display = "flex"
    }
    if (data.type === "winGame" ){
        loseWinText.innerHTML = "Ты выйграл!!!"
        loseWinScreen.style.display = "flex"
    }
    if (data.type === "botHpStatus"){
        BotHpText.innerHTML = "BOT HP "+ data.value
    }
    if (data.type === "TextSkill"){
        textSkills(data.value)
    }
    if (data.type === "calcMana"){
        divManaCount.style.height = data.value + "px"
        divManaCount.style.display = "flex"
        textManaCount.innerHTML = data.value2 + " mana"
        if (data.value2 == 10){
            divManaCount.style.display = "none"
        }
        if (divManaHeight <= 0){
            textManaCount.style.display = "none"
        }
    }
    if (data.type === "botTextSkill"){
        textBotSkill.innerHTML = data.value
    }
    if (data.type === "selectSkillMsg"){
        alert("Недостаточно маны или применён другой скилл!")
    }

    if (data.type === "BotTrap"){
        alert("БОТ ПОПАЛ В ЛОВУШКУ")
    }

    if (data.type === "gameFullRestart"){
        gameScreen.style.pointerEvents = "auto"
        startScreen.style.display = 'flex'
        loseWinScreen.style.display = "none"
        gameScreen.style.display = 'none'
        BotHpText.innerHTML = "BOT HP 6"
    }
});

const firstHp = document.getElementById("first-hp")
const secondHp = document.getElementById("second-hp")
const thirdHp = document.getElementById("third-hp")

const BotHpText = document.getElementById("bot-hp")

function calcHpAvatar(data,data2,data3,data4){
    firstHp.src = data
    secondHp.src = data2
    thirdHp.src = data3
    avatarImg.src = data4
}


const gestureAllButtons = document.querySelectorAll("[data-gesture]")

let textPlayerChoice = document.getElementById("text-player-choice")

let playerGestureChoice = "-"
gestureAllButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerGestureChoice = button.dataset.gesture
        textPlayerChoice.innerHTML = "Твой выбор: " + playerGestureChoice
        socket.send(JSON.stringify({
                    type: "playerGestureChoice",
                    value: playerGestureChoice
                }));
    })
})

confirmBtn.addEventListener("click", ()=>{
    console.log(playerGestureChoice)
    if (playerGestureChoice != "-"){
        socket.send(JSON.stringify({
                    type: "confirmBtn",
                }))
    } else{
        alert("Для подтверждения нужно выбрать жест")
    }
})

function textSkills(skill){
    const pickSkill = skill
    let top = "0px"
    let fontSize = "25px"

    if (pickSkill == 0) {
        text = "No skills applied"
        top = "0px"
        fontSize = "40px"
    } else if (pickSkill >= 1 && pickSkill <= 4) {
        // та же самая тема,что и в питоне,только нужны эти ублюдские скобки который я не знаю как ставить на английской клаве
        text = `На следующий раунд заблокирована ${pickSkill} группа жестов`
    } else if (pickSkill == 5) {
        text = "На этот раунд ваш урон и проходящий по вам урон увеличен на 1 "
        top = "-20px"
        fontSize = "30px"
    } else if (pickSkill == 6) {
        pickSkill = 0
        top = "0px"
        fontSize = "40px"
        text = "Вы похилились на 1 хп!"
        setTimeout(() => {
            textSkills()
        }, "3000");
    } else if (pickSkill == 7) {
        text = "Вы отключили равные жесты противнику"
    } else if (pickSkill == 8) {
        top = "-20px"
        fontSize = "40px"
        text = `Вы поставили ловушку на жест ${playerGestureChoice}`
    } else if (pickSkill == 9) {
        top = "-35px"
        fontSize = "45px"
        text = `У вас полная неуязвимость :)`
    }

    textAppliedSkill.innerHTML = text
    textAppliedSkill.style.top = top
    textAppliedSkill.style.fontSize = fontSize
}



const firstSkillBtn = document.getElementById("first-skill-btn")
let divFirstSkill = document.getElementById("div-first-skill")

firstSkillBtn.addEventListener("click", () => {
    if (divFirstSkill.style.display != "flex") {
        divFirstSkill.style.display = "flex"
    } else{
        divFirstSkill.style.display = "none"
    }
})

const skillsBtn = document.querySelectorAll(".first-skills-btn")


skillsBtn.forEach(button =>{
    button.addEventListener("click", () => {
        firstSkills = button.dataset.firstskill
        socket.send(JSON.stringify({
                    type: "firstSkill",
                    value: firstSkills
                }));
    })
})

const allSkillsBtn = document.querySelectorAll("#AllSkill-btn")

allSkillsBtn.forEach(button =>{
    button.addEventListener("click", () => {
        allSkills = button.dataset.allskill
        if (allSkills != "trap"){
            socket.send(JSON.stringify({
                    type: "Skills",
                    value: allSkills
                }));
        } else if (allSkills === "trap"){
            let confirmBtn = confirm(`Вы точно хотите поставить ловушку на ${playerGestureChoice}?`)
            if (confirmBtn){
                socket.send(JSON.stringify({
                    type: "trapChoice",
                    value: playerGestureChoice
                }));
            }
        }
    })
})

playAgainBtn.addEventListener("click", () =>{
    socket.send(JSON.stringify({
        type: "playAgain"
    }));
})