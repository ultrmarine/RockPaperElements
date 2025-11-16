(function() {
    const socket = io("/pvp")

    function emit(type, value){
        socket.emit(type, value)
    }

    let roomId = null

    socket.on("findGame", (id) =>{
        roomId = id
        gamePvpScreen.style.display = 'flex'
        multSearchBtn.style.display = "none"
        avatarSelect.style.display = "none"
        nickInp.style.display = "none"

        textNickname.innerHTML = nickInp.value
    })

    funct = {
        chooseGesture: (gesture) => emit("chooseGesture", {roomId,gesture}), // тут юзаем {} так как js гавно работающие по правилу запятой и если так не сделать,то отправит только крайнию правую переменную,короче калл непонятный ну просто сука ненавижу 20 минут на это потратил мрази
        searchRoom: () => emit("searchRoom")
    }

    socket.on("timerUpdate", (time) =>{
        textTimer.innerHTML = `TIME: ${time} s`
    })

})()

const multSearchBtn = document.getElementById("mult-search-btn")
const gamePvpScreen = document.getElementById("game-pvp-screen")
const textTimer = document.getElementById("text-timer")
const gestureAllButtons = document.querySelectorAll("[data-gesture]")
const textPlayerChoice = document.getElementById("text-player-choice")

const textNickname = document.getElementById("text-nickname")
const nickInp = document.getElementById("nick-input")
const avatarSelect = document.getElementById("avatar-select")

multSearchBtn.addEventListener("click", () => {
    funct.searchRoom()
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
