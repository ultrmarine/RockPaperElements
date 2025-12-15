(function () {
    const socket = io("/bot")

    function emit(type, value){
        socket.emit(type, value)
    }

    funct = {
        chooseGesture: (gesture) => emit("chooseGesture", gesture),
        firstSkill: (skill) => emit("firstSkill", skill),
        skills: (skill) => emit("skills", skill),
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

    socket.on("calcMana", (manaHeight,manaCount) => {
        divManaCount.style.height = manaHeight + "%"
        divManaCount.style.display = "flex"
        textManaCount.style.display = "flex"
        textManaCount.innerHTML = manaCount + " mana"
    })

    socket.on("botTextSkill", (botSkill) =>{
        textBotSkill.innerHTML = botSkill
    })

    socket.on("selectSkillMsg", () =>{
        alert("Недостаточно маны или применён другой скилл!")
    })

    socket.on("BotTrap", () =>{
        alert("БОТ ПОПАЛ В ЛОВУШКУ")
    })

    socket.on("gameFullRestart", () =>{
        gameScreen.style.pointerEvents = "auto"
        startScreen.style.display = 'flex'
        loseWinScreen.style.display = "none"
        gameScreen.style.display = 'none'
        BotHpText.innerHTML = "BOT HP 6"
    })

    socket.on("loseGame", () =>{
        loseWinText.innerHTML = "Ты проиграл"
        loseWinScreen.style.display = "flex"
    })

    socket.on("winGame", () =>{
        loseWinText.innerHTML = "Ты выйграл!!!"
        loseWinScreen.style.display = "flex"
    })
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
const selectImg = document.getElementById("avatar-select")
const playAgainBtn = document.getElementById("play-again-btn")
const textAppliedSkill = document.getElementById("text-applied-skill")
const textRoundTotal = document.getElementById("text-round-total")
const textRoundCount = document.getElementById("text-round-count")
const hp = ["assets/icons/red-hp.png","assets/icons/half-red-hp.png","assets/icons/empty-hp.png"]
const textEnemyMove = document.getElementById("text-enemy-move")
const divManaCount = document.getElementById("mana-fill")
const textManaCount = document.getElementById("mana-text")
const textBotSkill = document.getElementById("text-bot-skill")
const firstHp = document.getElementById("first-hp")
const secondHp = document.getElementById("second-hp")
const thirdHp = document.getElementById("third-hp")
const BotHpText = document.getElementById("bot-hp")
const gestureAllButtons = document.querySelectorAll("[data-gesture]")
const textPlayerChoice = document.getElementById("text-player-choice")
const firstSkillBtn = document.getElementById("first-skill-btn")
const divFirstSkill = document.getElementById("div-first-skill")
const allSkillsBtn = document.querySelectorAll("#AllSkill-btn")
const skillsBtn = document.querySelectorAll(".first-skills-btn")

const multiplayerBtn = document.getElementById("multiplayer-btn")
const multiplayerScreen = document.getElementById("multiplayer-screen")
const closeMultiplayerScreen = document.getElementById("close-multiplayer-screen")

multiplayerBtn.addEventListener("click", () => {
    startScreen.style.display = 'none'
    multiplayerScreen.style.display = "flex"
})

closeMultiplayerScreen.addEventListener("click", () => {
    multiplayerScreen.style.display = "none"
    startScreen.style.display = 'flex'
})

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
        return
    }
    if (selectImg.value == "wizard"){
        avatarImg.src = "assets/avatars/wizard1.png"
        funct.setAvatar("wizard")
    }
    if (selectImg.value == "elemental"){
        avatarImg.src = "assets/avatars/elemental1.png"
        funct.setAvatar("elemental")
    }
    if (selectImg.value == "skeleton"){
        selectImg.src = "assets/avatars/skeleton1.png"
        funct.setAvatar("skeleton")
    }
    funct.startTimer()
    textNickname.innerHTML = nickInp.value
    gameScreen.style.display = 'flex'
    preGameScreen.style.display = 'none'
    
})

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
        funct.chooseGesture(playerGestureChoice)
        textPlayerChoice.innerHTML = "Твой выбор: " + playerGestureChoice
    })
})

confirmBtn.addEventListener("click", ()=>{
    if (playerGestureChoice != "-"){
        funct.confirm()
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
        funct.firstSkill(button.dataset.firstskill)
    })
})

allSkillsBtn.forEach(button =>{
    button.addEventListener("click", () => {
        if (button.dataset.allskill != "trap"){
            funct.skills(button.dataset.allskill)
        } else if (button.dataset.allskill === "trap"){
            let confirmBtn = confirm(`Вы точно хотите поставить ловушку на ${playerGestureChoice}?`)
            if (confirmBtn){
                funct.trapChoice(playerGestureChoice)
            }
        }
    })
})

playAgainBtn.addEventListener("click", () =>{
    funct.playAgain()
})

