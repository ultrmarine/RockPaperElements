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
    })

    funct = {
        chooseGesture: (gesture) => emit("chooseGesture", {roomId,gesture}), // тут юзаем {} так как js гавно работающие по правилу запятой и если так не сделать,то отправит только крайнию правую переменную,короче калл непонятный ну просто сука ненавижу 20 минут на это потратил мрази
        searchRoom: () => emit("searchRoom"),
        setAvatar: (avatar) => avatar1 = avatar,
        confirm: () => emit("confirmBtn", roomId)
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

    socket.on("roundScreenState", (roundCount, botChoose) =>{
        if (roundScreen.style.display == "none"){
            roundScreen.style.display = 'flex'
        }
        textRoundCount.innerHTML = roundCount
        textRoundScreen.innerHTML = "Конец " + (roundCount-1) + " раунда"
        textEnemyMove.innerHTML = "Противник сыграл " + botChoose
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

})()

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
    multSearchBtn.style.pointerEvents = "none"
    
})


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
