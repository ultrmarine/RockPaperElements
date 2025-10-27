// всё что связано с маной и способностями
const divManaCount = document.getElementById("div-mana-count")
const textManaCount = document.getElementById("text-mana-count")

let playerManaCount = 2
let divManaHeight = 450

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


const firstSkillBtn = document.getElementById("first-skill-btn")
let divFirstSkill = document.getElementById("div-first-skill")

firstSkillBtn.addEventListener("click", () => {
    if (divFirstSkill.style.display != "flex") {
        divFirstSkill.style.display = "flex"
    } else{
        divFirstSkill.style.display = "none"
    }
})


// пикает все кнопочки с классом этим,а потом я вызываю их через инлекс,так удобнее я глаголю
const skillsBtn = document.querySelectorAll(".first-skills-btn")

let selectSkill = 0

// СПООСОБНОСТЬ ОТКЛЮЧЕНИЯ ОДНОЙ ИЗ ГРУПП
skillsBtn[0].addEventListener("click", () => {
    if (playerManaCount >= 4 && selectSkill == 0){
        playerManaCount-= 4
        selectSkill = 1
    } else if (playerManaCount < 4){
        alert("Недостаточно маны!")
    } else if (selectSkill != 0) {
        alert("Уже применён другой скилл!")
    }
    calcMana()
    textSkills()
})

skillsBtn[1].addEventListener("click", () => {
    if (playerManaCount >= 4 && selectSkill == 0){
        playerManaCount-= 4
        selectSkill = 2
    } else if (playerManaCount < 4){
        alert("Недостаточно маны!")
    } else if (selectSkill != 0) {
        alert("Уже применён другой скилл!")
    }
    calcMana()
    textSkills()
})

skillsBtn[2].addEventListener("click", () => {
    if (playerManaCount >= 4 && selectSkill == 0){
        playerManaCount-= 4
        selectSkill = 3
    } else if (playerManaCount < 4){
        alert("Недостаточно маны!")
    } else if (selectSkill != 0) {
        alert("Уже применён другой скилл!")
    }
    calcMana()
    textSkills()
})

skillsBtn[3].addEventListener("click", () => {
    if (playerManaCount >= 4 && selectSkill == 0){
        playerManaCount-= 4
        selectSkill = 4
    } else if (playerManaCount < 4){
        alert("Недостаточно маны!")
    } else if (selectSkill != 0) {
        alert("Уже применён другой скилл!")
    }
    calcMana()
    textSkills()
})

// СПОСОБНОСТЬ УВЕЛИЧЕНИЯ ДЕМАДЖА ПО БОТУ И ИГРОКУ

const secondSkillBtn = document.getElementById("second-skill-btn")

secondSkillBtn.addEventListener("click", () => {
    if (playerManaCount >= 3 && selectSkill == 0) {
        playerManaCount-= 3
        selectSkill = 5
    } else if (playerManaCount < 3){
        alert("Недостаточно маны!")
    } else if (selectSkill != 0) {
        alert("Уже применён другой скилл!")
    }
    calcMana()
    textSkills()
})

const thirdSkillBtn = document.getElementById("third-skill-btn")

thirdSkillBtn.addEventListener("click", () =>{
    if (playerManaCount >= 5 && selectSkill == 0 && playerHp < 6){
        playerManaCount-= 5
        selectSkill = 6
        playerHp += 1
    } else if (playerManaCount < 5){
        alert("Недостаточно маны!")
    } else if (selectSkill != 0) {
        alert("Уже применён другой скилл!")
    } else if (playerHp >= 6){
        alert("Здоровье не может быть больше 6!")
    }
    calcMana()
    textSkills()
    calcHpAvatar()
})

const fourthSkillBtn = document.getElementById("fourth-skill-btn")

fourthSkillBtn.addEventListener("click", () => {
    if (playerManaCount >= 2 && selectSkill == 0) {
        playerManaCount-= 2
        selectSkill = 7
    } else if (playerManaCount < 2){
        alert("Недостаточно маны!")
    } else if (selectSkill != 0) {
        alert("Уже применён другой скилл!")
    }
    calcMana()
    textSkills()
})

