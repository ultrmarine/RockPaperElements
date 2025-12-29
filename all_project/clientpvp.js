(function() {
    const socket = io("/pvp")

    function emit(type, value){
        socket.emit(type, value)
    }

    let roomId = null
    let avatar1 = "skeleton"

    socket.on("findGame", (id) =>{
        roomId = id
        gamePvpScreen.style.display = 'flex'
        multSearchBtn.style.display = "none"
        selectImg.style.display = "none"
        nickInp.style.display = "none"
        emit("AvatarImg", {roomId, avatar: avatar1})
        funct.setNickname(nickInp.value)

    })

    funct = {
        chooseGesture: (gesture) => emit("chooseGesture", {roomId,gesture}), // тут юзаем {} так как js гавно работающие по правилу запятой и если так не сделать,то отправит только крайнию правую переменную,короче калл непонятный ну просто сука ненавижу 20 минут на это потратил мрази
        searchRoom: () => emit("searchRoom"),
        setAvatar: (avatar) => avatar1 = avatar,
        playAgain: () => emit("playAgain", roomId),
        confirm: () => emit("confirmBtn", roomId),
        firstSkill: (skill) => emit("firstSkill", {roomId,skill}),
        skills: (skill) => emit("skills", {roomId,skill}),
        trapChoice: (trap) => emit("trapChoice", {roomId,trap}),
        sendMsg: (msg) => emit("sendMsg", {roomId,msg}),
        setNickname: (nick) => emit("setNick", {roomId,nick})
    }

    socket.on("timerUpdate", (time) =>{
        textTimer.innerHTML = `TIME: ${time} s`
    })

    socket.on("testHp", (hp1,hp2,hp3,avatar) =>{
        calcHpAvatar(hp1, hp2, hp3, avatar)
    })

    socket.on("Hp", (hp1,hp2,hp3,avatar) =>{
        calcHpAvatar(hp1, hp2, hp3, avatar)
    })

    socket.on("roundStatus", (data) => {
        textRoundTotal.innerHTML = data
    })

    socket.on("roundStatusInvincible", (data) => {
        textRoundTotal.innerHTML += data
    })

    socket.on("roundScreenState", (roundCount, enemyChoose) =>{
        if (roundScreen.style.display == "none"){
            roundScreen.style.display = 'flex'
        }
        textRoundCount.innerHTML = roundCount
        textRoundScreen.innerHTML = "Конец " + (roundCount-1) + " раунда"
        textEnemyMove.innerHTML = "Противник сыграл " + enemyChoose
        gamePvpScreen.style.pointerEvents = "none"  
    })

    socket.on("EndTimerUpdate", (data) => {
        textTimerRound.innerHTML = "TIME: " + data +" s"
    })

    socket.on("EndTimerClose", () => {
        roundScreen.style.display = 'none'
        gamePvpScreen.style.pointerEvents = "auto"
        textTimerRound.innerHTML = "TIME: 5 s"
        textTimer.innerHTML = `TIME: 60 s`
    })

    socket.on("EnemyHp", (hp) =>{
        enemyHp.innerHTML = "ENEMY HP " + hp
    })

    socket.on("calcMana", manaCount => {
        console.log(manaCount)
        divManaCount.style.height = (450 - (manaCount*50)) + "px"
        divManaCount.style.display = "flex"
        textManaCount.style.display = "flex"
        textManaCount.innerHTML = manaCount + " mana"
        if (manaCount >= 10){
            divManaCount.style.display = "none"
        }
        if (manaCount <= 0){
            textManaCount.style.display = "none"
        }
    })

    socket.on("loseGame", () =>{
        loseWinText.innerHTML = "ема ты сосун XDDD"
        loseWinScreen.style.display = "flex"
        gamePvpScreen.style.pointerEvents = "none"
    })

    socket.on("winGame", () =>{
        loseWinText.innerHTML = "Ты выйграл!!!"
        loseWinScreen.style.display = "flex"
        gamePvpScreen.style.pointerEvents = "none"
    })

    socket.on("enemyLeave", () =>{
        loseWinText.innerHTML = "Противник с позором ливнул,мы вернём вас в главное меню"
        loseWinScreen.style.display = "flex"
        gamePvpScreen.style.pointerEvents = "none"
        loseWinScreen.style.pointerEvents = "none"
        playAgainBtn.style.display = "none"
        const timer = setInterval(() => {
            window.location.href = "index.html"
            clearInterval(timer)
        },5000)
    })

    socket.on("RestartGame", () =>{
        window.location.href = "index.html"
    })

    socket.on("TextSkill", (skill)=>{
        console.log("TextSkill", skill)
        textSkills(skill)
    })

    socket.on("enemyTextSkill", (enemySkill) =>{
        textEnemySkill.innerHTML = enemySkill
    })

    socket.on("getMSG", (msg,nickname) =>{
        let p = document.createElement("p")
        p.textContent = nickname + ": " + msg
        divChat.appendChild(p)

        divChat.scrollTop = divChat.scrollHeight;
    })

})()

const divChat = document.getElementById("msg-block")
const textChat = document.getElementById("text-chat")

const firstSkillBtn = document.getElementById("first-skill-btn")
const divFirstSkill = document.getElementById("div-first-skill")
const textAppliedSkill = document.getElementById("text-applied-skill")
const textEnemySkill = document.getElementById("text-bot-skill")

const allSkillsBtn = document.querySelectorAll("#AllSkill-btn")
const skillsBtn = document.querySelectorAll(".first-skills-btn")

const roundScreen = document.getElementById("round-screen")
const textRoundCount = document.getElementById("text-round-count")
const textEnemyMove = document.getElementById("text-enemy-move")
const textTimerRound = document.getElementById("text-timer-round-screen")
const textRoundScreen = document.getElementById("text-round-screen")

const multSearchBtn = document.getElementById("mult-search-btn")
const gamePvpScreen = document.getElementById("game-pvp-screen")
const textTimer = document.getElementById("text-timer")
const gestureAllButtons = document.querySelectorAll("[data-gesture]")
const textPlayerChoice = document.getElementById("text-player-choice")

const textNickname = document.getElementById("text-nickname")
const nickInp = document.getElementById("nick-input")
const selectImg = document.getElementById("avatar-select")

const firstHp = document.getElementById("first-hp")
const secondHp = document.getElementById("second-hp")
const thirdHp = document.getElementById("third-hp")
const avatarImg = document.getElementById("avatar-img")

const confirmBtn = document.getElementById("confirm-btn")

const textRoundTotal = document.getElementById("text-round-total")

const enemyHp = document.getElementById("enemy-hp")

const textManaCount = document.getElementById("text-mana-count")
const divManaCount = document.getElementById("div-mana-count")
const loseWinScreen = document.getElementById("lose-win-screen")
const loseWinText = document.getElementById("lose-win-text")

const playAgainBtn = document.getElementById("play-again-btn")

multSearchBtn.addEventListener("click", () => {
    if (nickInp.value == ""){
        nickInp.value = "Default user"
        return
    }
    if (selectImg.value == "wizard"){
        selectImg.src = "assets/avatars/wizard1.png"
        funct.setAvatar("wizard")
    }
    if (selectImg.value == "elemental"){
        selectImg.src = "assets/avatars/elemental1.png"
        funct.setAvatar("elemental")
    }
    if (selectImg.value == "skeleton"){
        selectImg.src = "assets/avatars/skeleton1.png"
        funct.setAvatar("skeleton")
    }
    funct.searchRoom()
    textNickname.innerHTML = nickInp.value
    const nick = nickInp.value
    multSearchBtn.style.pointerEvents = "none"
    
})

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
            textSkills(0)
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


let playerGestureChoice = "-"
gestureAllButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        playerGestureChoice = btn.dataset.gesture
        console.log(playerGestureChoice)
        funct.chooseGesture(playerGestureChoice)
        textPlayerChoice.innerHTML = "Твой выбор: " + playerGestureChoice
    })
})

function calcHpAvatar(data,data2,data3,data4){
    firstHp.src = data
    secondHp.src = data2
    thirdHp.src = data3
    avatarImg.src = data4
}

confirmBtn.addEventListener("click", ()=>{
    if (playerGestureChoice != "-"){
        funct.confirm()
    } else{
        alert("Для подтверждения нужно выбрать жест")
    }
})

playAgainBtn.addEventListener("click", () =>{
    funct.playAgain()
})



// ЧАТ БЛОК

const inpChat = document.getElementById("inp-chat")
const btnChat = document.getElementById("chat-form")

btnChat.addEventListener("submit", (e) =>{
    e.preventDefault() //что бы не перезагружало страницу
    funct.sendMsg(inpChat.value)
    inpChat.value = ""
})