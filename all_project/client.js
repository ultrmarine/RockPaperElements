(function () {
    const socket = io()
    
    socket.on("init", (data) => {
        player = data;
    });

    // function send(type, value) {
    //     const msg = JSON.stringify({ type, value })
    //     socket.send(msg)
    // }

    function emit(type, value){
        socket.emit(type, value)
    }

    out_test = {
        chooseGesture: (gesture) => emit("chooseGesture", gesture),
        firstSkill: (skill) => emit("firstSkill", skill),
        skills: (skill) => emit("Skills", skill),
        trapChoice: (trap) => emit("trapChoice", trap),
        setAvatar: (avatar) => emit("AvatarImg", avatar),
        confirm: () => emit("confirmBtn"),
        playAgain: () => emit("playAgain"),
        startTimer: () => emit("startTimer")
    }

    socket.on("timerUpdate", (time) =>{
        textTimer.innerHTML = `TIME: ${time} s`
    })

    socket.on("roundStatus", (data) => {
        textRoundTotal.innerHTML = data
    })

    socket.on("roundScreenState", (roundCount, botChoose) =>{
        if (roundScreen.style.display == "none"){
            roundScreen.style.display = 'flex'
        }
        textRoundCount.innerHTML = roundCount
        textRoundScreen.innerHTML = "Конец " + (roundCount-1) + " раунда"
        textEnemyMove.innerHTML = "Противник сыграл " + botChoose
        gameScreen.style.pointerEvents = "none"  
    })

    socket.on("EndTimerUpdate", (data) => {
        textTimerRound.innerHTML = "TIME: " + data +" s"
    })

    socket.on("EndTimerClose", () => {
        roundScreen.style.display = 'none'
        gameScreen.style.pointerEvents = "auto"
        textTimerRound.innerHTML = "TIME: 5 s"
        textTimer.innerHTML = `TIME: 60 s`
    })

    socket.on("testHp", (hp1,hp2,hp3,avatar) =>{
        console.log(hp1, hp2, hp3, avatar)
        calcHpAvatar(hp1, hp2, hp3, avatar)
    })

    socket.on("Hp", (hp1,hp2,hp3,avatar) =>{
        calcHpAvatar(hp1, hp2, hp3, avatar)
    })

    socket.on("botHpStatus", (botHp) =>{
        BotHpText.innerHTML = "BOT HP "+ botHp
    })

    socket.on("TextSkill", (skill)=>{
        textSkills(skill)
    })

    socket.on("botTextSkill", (botSkill) =>{
        textBotSkill.innerHTML = botSkill
    })

    // outside = {
    //     chooseGesture: (gesture) => send("playerGestureChoice", gesture),
    //     firstSkill: (skill) => send("firstSkill", skill),
    //     skills: (skill) => send("Skills", skill),
    //     trapChoice: (trap) => send("trapChoice", trap),
    //     setAvatar: (avatar) => send("AvatarImg", avatar),
    //     confirm: () => send("confirmBtn"),
    //     playAgain: () => send("playAgain"),
    //     startTimer: () => send("startTimer")
    // }

//     socket.addEventListener("message", event => {
//         const data = JSON.parse(event.data);

//         switch(data.type){
//             case "timerUpdate":
//                 textTimer.innerHTML = `TIME: ${data.value} s`
//                 break
//             case "roundStatus":
//                 textRoundTotal.innerHTML = data.value
//                 break
//             case "roundScreenState":
//                 if (roundScreen.style.display == "none"){
//                     roundScreen.style.display = 'flex'
//                 }
//                 textRoundCount.innerHTML = data.value
//                 textRoundScreen.innerHTML = "Конец " + (data.value-1) + " раунда"
//                 textEnemyMove.innerHTML = "Противник сыграл " + data.value2
//                 gameScreen.style.pointerEvents = "none"    
//                 break
//             case "EndTimerUpdate":
//                 textTimerRound.innerHTML = "TIME: " + data.value +" s"
//                 break
//             case "EndTimerClose":
//                 roundScreen.style.display = 'none'
//                 gameScreen.style.pointerEvents = "auto"
//                 textTimerRound.innerHTML = "TIME: 5 s"
//                 textTimer.innerHTML = `TIME: 60 s`
//                 break
//             case "testHp":
//                 calcHpAvatar(data.value,data.value2,data.value3,data.value4)
//                 break
//             case "Hp":
//                 calcHpAvatar(data.value,data.value2,data.value3,data.value4)
//                 break
//             case "loseGame":
//                 loseWinScreen.style.display = "flex"
//                 break
//             case "winGame":
//                 loseWinText.innerHTML = "Ты выйграл!!!"
//                 loseWinScreen.style.display = "flex"
//                 break
//             case "botHpStatus":
//                 BotHpText.innerHTML = "BOT HP "+ data.value
//                 break
//             case "TextSkill":
//                 textSkills(data.value)
//                 break
//             case "calcMana":
//                 divManaCount.style.height = data.value + "px"
//                 divManaCount.style.display = "flex"
//                 textManaCount.innerHTML = data.value2 + " mana"
//                 if (data.value2 >= 10){
//                     divManaCount.style.display = "none"
//                 }
//                 if (data.value2 <= 0){
//                     divManaCount.style.display = "none"
//                 }
//                 break
//             case "botTextSkill":
//                 textBotSkill.innerHTML = data.value
//                 break
//             case "selectSkillMsg":
//                 alert("Недостаточно маны или применён другой скилл!")
//                 break
//             case "BotTrap":
//                 alert("БОТ ПОПАЛ В ЛОВУШКУ")
//                 break
//             case "gameFullRestart":
//                 gameScreen.style.pointerEvents = "auto"
//                 startScreen.style.display = 'flex'
//                 loseWinScreen.style.display = "none"
//                 gameScreen.style.display = 'none'
//                 BotHpText.innerHTML = "BOT HP 6"
//                 break
//             default:
//                 console.log("undef")
//         }
// });
})()



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
let textEnemyMove = document.getElementById("text-enemy-move")
const divManaCount = document.getElementById("div-mana-count")
const textManaCount = document.getElementById("text-mana-count")
const textBotSkill = document.getElementById("text-bot-skill")
const firstHp = document.getElementById("first-hp")
const secondHp = document.getElementById("second-hp")
const thirdHp = document.getElementById("third-hp")
const BotHpText = document.getElementById("bot-hp")
const gestureAllButtons = document.querySelectorAll("[data-gesture]")
let textPlayerChoice = document.getElementById("text-player-choice")
const firstSkillBtn = document.getElementById("first-skill-btn")
let divFirstSkill = document.getElementById("div-first-skill")
const allSkillsBtn = document.querySelectorAll("#AllSkill-btn")
const skillsBtn = document.querySelectorAll(".first-skills-btn")


// socket.addEventListener("message", event => {
//     console.log("Сообщение от сервера:", event);
// });

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
            out_test.setAvatar("wizard")
        }
        if (selectImg.value == "elemental"){
            avatarImg.src = "assets/avatars/elemental1.png"
            out_test.setAvatar("elemental")
        }
        out_test.startTimer()
        textNickname.innerHTML = nickInp.value
        gameScreen.style.display = 'flex'
        preGameScreen.style.display = 'none'
    }
})

// let data1,data2,data3,data4;

function calcHpAvatar(data,data2,data3,data4){
    firstHp.src = data
    secondHp.src = data2
    thirdHp.src = data3
    avatarImg.src = data4
}

let playerGestureChoice = "-"
gestureAllButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        playerGestureChoice = btn.dataset.gesture
        out_test.chooseGesture(playerGestureChoice)
        textPlayerChoice.innerHTML = "Твой выбор: " + playerGestureChoice
    })
})

confirmBtn.addEventListener("click", ()=>{
    console.log(playerGestureChoice)
    if (playerGestureChoice != "-"){
        out_test.confirm()
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

firstSkillBtn.addEventListener("click", () => {
    if (divFirstSkill.style.display != "flex") {
        divFirstSkill.style.display = "flex"
    } else{
        divFirstSkill.style.display = "none"
    }
})


skillsBtn.forEach(button =>{
    button.addEventListener("click", () => {
        firstSkills = button.dataset.firstskill
        outside.firstSkill(firstSkills)
    })
})

allSkillsBtn.forEach(button =>{
    button.addEventListener("click", () => {
        allSkills = button.dataset.allskill
        if (allSkills != "trap"){
            outside.skills(allSkills)
        } else if (allSkills === "trap"){
            let confirmBtn = confirm(`Вы точно хотите поставить ловушку на ${playerGestureChoice}?`)
            if (confirmBtn){
                outside.trapChoice(playerGestureChoice)
            }
        }
    })
})

playAgainBtn.addEventListener("click", () =>{
    outside.playAgain()
})