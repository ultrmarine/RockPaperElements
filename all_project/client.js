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
        textTimer.textContent = t("timer", { time })
    })

    socket.on("roundStatus", (data) => {
        textRoundTotal.textContent = t(data)
    })

    socket.on("roundScreenState", (roundCount, botChoose) =>{
        if (roundScreen.style.display == "none"){
            roundScreen.style.display = 'flex'
        }
       textRoundCount.textContent = roundCount
        textRoundScreen.textContent = t("roundEnd", { round: roundCount - 1 })
        textEnemyMove.textContent = t("enemyMove", { gesture: gestureName(botChoose) })
        gameScreen.style.pointerEvents = "none"  
    })

    socket.on("EndTimerUpdate", (data) => {
        textTimerRound.textContent = t("timerNext", { time: data })
    })

    socket.on("EndTimerClose", () => {
        roundScreen.style.display = 'none'
        gameScreen.style.pointerEvents = "auto"
        textTimerRound.textContent = t("timerNext", { time: 5 })
        textTimer.textContent = t("timer", { time: 60 })
    })

    socket.on("testHp", (hp1,hp2,hp3,avatar) =>{
        calcHpAvatar(hp1, hp2, hp3, avatar)
    })

    socket.on("Hp", (hp1,hp2,hp3,avatar) =>{
        calcHpAvatar(hp1, hp2, hp3, avatar)
    })

    socket.on("botHpStatus", (botHp) =>{
        BotHpText.textContent = t("botHp", { hp: botHp })
    })

    socket.on("TextSkill", (skill)=>{
        textSkills(skill)
    })

    socket.on("calcMana", (manaHeight,manaCount) => {
        divManaCount[0].style.height = manaHeight + "%"
        textManaCount[0].textContent = manaCount
    })

    socket.on("botTextSkill", (botSkill) =>{
        textBotSkill.textContent = t(botSkill)
    })

    socket.on("selectSkillMsg", () =>{
        alert(t("selectSkillAlert"))
    })

    socket.on("BotTrap", () =>{
        alert(t("botTrapAlert"))
    })

    socket.on("gameFullRestart", () =>{
        gameScreen.style.pointerEvents = "auto"
        startScreen.style.display = 'flex'
        loseWinScreen.style.display = "none"
        gameScreen.style.display = 'none'
        BotHpText.textContent = t("botHp", { hp: 6 })
    })

    socket.on("loseGame", () =>{
        loseWinText.textContent = t("loseGame")
        loseWinScreen.style.display = "flex"
    })

    socket.on("winGame", () =>{
        loseWinText.textContent = t("winGame")
        loseWinScreen.style.display = "flex"
    })

    socket.on("BlockGrupp", (grupp) => {
        gestureAllButtons.forEach((btn, index) => {
            const img = btn.querySelector("img")
            if (grupp == 1){
                if (index <= 3) {
                    img.style.backgroundColor = 'red'
                    img.style.borderRadius = "10px"
                }
            }
            if (grupp == 2){
                if (index > 3 & index <= 7) {
                    img.style.backgroundColor = 'red'
                    img.style.borderRadius = "10px"
                }
            }
            if (grupp == 3){
                if (index > 7 & index <= 11) {
                    img.style.backgroundColor = 'red'
                    img.style.borderRadius = "10px"
                }
            }
            if (grupp == 4){
                if (index > 11) {
                    img.style.backgroundColor = 'red'
                    img.style.borderRadius = "10px"
                }
            }
        });
    })

    socket.on("Alert", (msg) => {
        alert(msg)
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
const divManaCount = document.getElementsByClassName("mana-fill")
const textManaCount = document.getElementsByClassName("mana-text")
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

const btnLang = document.querySelectorAll('#lang-btn');


btnLang.forEach((btn) => {
    btn.addEventListener("click", () => {
        location.reload()
    })
})
    

gestureAllButtons.forEach((button) => {
    const label = gestureName(button.dataset.gesture)
    button.title = label
    button.setAttribute("aria-label", label)
})

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
    textTimerRound.textContent = t("timerNext", { time: 5 });
    // BotHpText.textContent = "botHp", { hp: 6 }
    // textTimer.textContent = "timer", { time: 60 }
    btnLang[0].style.display = 'none'
    btnLang[1].style.display = 'none'
})

closePreGameScreen.addEventListener('click', () => {
    startScreen.style.display = 'flex'
    preGameScreen.style.display = 'none'
    btnLang[0].style.display = 'flex'
    btnLang[1].style.display = 'flex'
})

playBtn.addEventListener('click', () => {
    if (nickInp.value == ""){
        nickInp.value = t("defaultUser")
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
    textNickname.textContent = nickInp.value
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
        textPlayerChoice.textContent = t("choice", { gesture: gestureName(playerGestureChoice) })
    })
})

// gestureAllButtons.forEach((btn) => {
//     btn.addEventListener("mouseenter", () =>{
//         if(btn.id.length <= 12){
//                 arr_lenght = btn.id[btn.id.length - 1]
//                 for (const gesture of gestureAllButtons){
//                     if (gesture.id[gesture.id.length - 1] > arr_lenght){
//                         const img = gesture.querySelector("img");
//                         img.style.opacity = 0.3
//                     }
//                 }
//             }
//         for (const gesture of gestureAllButtons){
            
//             // console.log(gesture.id[gesture.id.length - 1])

//         }
//     })
// })


//отображение подсказок,что бъёт что
gestureAllButtons.forEach((btn, index) => {
    btn.addEventListener('mouseenter', () => {
        gestureAllButtons.forEach((gesture, ind) => {
            // вот эт нам нужно что бы замкнуть весь список и нормально всё это отображать
            const distance = (ind - index + 16) % 16; 
            const img = gesture.querySelector("img")
            if (distance == 0 || distance <= 8) {
                img.style.opacity = '1'
            } else {
                img.style.opacity = '0.33'
            }
        })
    })

    btn.addEventListener('mouseleave', () => {
        gestureAllButtons.forEach(gesture => {
            const img = gesture.querySelector("img")
            img.style.opacity = '1'
        });
    });
});



confirmBtn.addEventListener("click", ()=>{
    if (playerGestureChoice != "-"){
        funct.confirm()
    } else{
        alert(t("chooseGestureAlert"))
    }

    gestureAllButtons.forEach((btn) => {
            const img = btn.querySelector("img")
            img.style.backgroundColor = 'transparent'
        })
})

function textSkills(skill){
    const pickSkill = skill
    let text = t("noSkills")
    let top = "0px"
    let fontSize = "25px"

    if (pickSkill == 0 || pickSkill == undefined) {
        text = t("noSkills")
        fontSize = "40px"
    } else if (pickSkill >= 1 && pickSkill <= 4) {
        text = t("skillBlockGroup", { group: pickSkill })
    } else if (pickSkill == 5) {
        text = t("skillDamage")
        top = "-20px"
        fontSize = "30px"
    } else if (pickSkill == 6) {
        top = "0px"
        fontSize = "40px"
        text = t("skillHeal")
        setTimeout(() => {
            textSkills(0)
        }, 3000)
    } else if (pickSkill == 7) {
        text = t("skillEqualGesture")
    } else if (pickSkill == 8) {
        top = "-20px"
        fontSize = "40px"
        text = t("skillTrap", { gesture: gestureName(playerGestureChoice) })
    } else if (pickSkill == 9) {
        top = "-35px"
        fontSize = "45px"
        text = t("skillInvincible")
    }

    textAppliedSkill.textContent = text
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
            let confirmBtn = confirm(t("trapConfirm", { gesture: gestureName(playerGestureChoice) }))
            if (confirmBtn){
                funct.trapChoice(playerGestureChoice)
            }
        }
    })
})

playAgainBtn.addEventListener("click", () =>{
    funct.playAgain()
    btnLang[0].style.display = 'flex'
    btnLang[1].style.display = 'flex'
})