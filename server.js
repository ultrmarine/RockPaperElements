// server.js
const express = require("express");
const { WebSocketServer } = require("ws");
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const ws = new WebSocketServer({ server });

app.use(express.static("all_project"));


const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
})


let playerGestureChoice = "-"
let selectImgServ
ws.on("connection", socket => {
    console.log("подключился");

    socket.on("message", msg => {
        const data = msg.toString();
        console.log("Сообщение klienta:", data);

        if (data === "startTimer") {
            startRoundTimer();
        }
        if (gesture_wins[data]){ // сделать сравнение жестов
            playerGestureChoice = data
        }
        if (data === "confirm btn"){
            roundEnd()
        }
        if (data === "AvatarImgElemental"){
            selectImgServ = "elemental"
        }
        if (data === "AvatarImgWizard"){
            selectImgServ = "wizard"
        }
    });
});

let selectSkill = 0
let roundCount = 1
let botChooseGesture1

function startRoundTimer() {
    let defaultTimer = 60;

    const timerInterval = setInterval(() => {
        defaultTimer--;
        ws.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({
                    type: "timerUpdate",
                    value: defaultTimer
                }))
            }
        });

        if (defaultTimer <= 0) {
            clearInterval(timerInterval);
            console.log("конец таймера");
        }
    }, 1000);
}



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

let playerHp = 6
let botHp = 6


function roundEnd(){
    if(playerGestureChoice != "-") {
        if (playerGestureChoice == botChooseGesture1){
            ws.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: "roundStatus",
                        value: "У вас ничья"
                    }));
                }
            })

            ws.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: "roundScreenState",
                    }));
                }
            })

        selectSkill = 0
        } else if(gesture_wins[playerGestureChoice].includes(botChooseGesture1) && gesture_wins[botChooseGesture1].includes(playerGestureChoice) && selectSkill != 7){ //ravnie по силе жесты проверка
            //доработать
                ws.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: "roundStatus",
                        value: "Сыграны равные по силе жесты вы оба теряете hp"
                    }));
                }
                })
            playerHpLose()
            botHpLose()
            selectSkill = 0
        } else if (gesture_wins[playerGestureChoice].includes(botChooseGesture1)){
                ws.clients.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({
                            type: "roundStatus",
                            value: "Ты выйграл"
                        }));
                    }
                    })
            if(selectSkill == 7 && gesture_wins[botChooseGesture1].includes(playerGestureChoice)){
                ws.clients.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({
                            type: "roundStatus",
                            value: "Равный жест не сработал.Ты выйграл"
                        }));
                    }
                    })
            }
            botHpLose()
            selectSkill = 0
        } else{
            ws.clients.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({
                            type: "roundStatus",
                            value: "Ты проиграл вамп вамп"
                        }));
                    }
                    })
            playerHpLose()
            selectSkill = 0
        }

    } else{
         //потом заменить алёрт на pop окно по желанию конечно
    }
}

function playerHpLose(){
    // if (selectSkill == 9){
    //     textRoundTotal.innerHTML += ", но невиданный щит спас вас от урона :)"
    // } else if(selectSkill == 5 && botCast1 == 2){
    //     playerHp -= 3
    // } else if (selectSkill == 5 || botCast1 == 2){
    //     playerHp -= 2
    // } else{
    //     playerHp -= 1
    // }
    playerHp -= 1
    calcHpAvatarServ()
}

function botHpLose(){
    // if (selectSkill == 5 && botCast1 == 2){
    //     botHp -= 3
    // } else if(selectSkill == 5 || botCast1 == 2){
    //     botHp -= 2
    // }else {
    //     botHp -= 1
    // }
    botHp -= 1
    BotHpText.innerHTML = "BOT HP "+ botHp
    if(botHp <= 0){
        botHp = 0
        setTimeout(() => {
            win()
        },5500)
    }
}


function lose(){
    clearInterval(intervalTimer)
    loseWinScreen.style.display = "flex"
}

function win(){
    clearInterval(intervalTimer)
    loseWinText.innerHTML = "Ты выйграл!!!"
    loseWinScreen.style.display = "flex"
}

function calcHpAvatarServ(){

    const hp = ["assets/icons/red-hp.png","assets/icons/half-red-hp.png","assets/icons/empty-hp.png"]
    let avatar = ["assets/avatars/skeleton1.jpg","assets/avatars/skeleton2.jpg","assets/avatars/skeleton3.jpg"]

    if (selectImgServ == "wizard"){
        avatar = ["assets/avatars/wizard1.png","assets/avatars/wizard2.png","assets/avatars/wizard3.png"]
    } else if(selectImgServ == "elemental"){
        avatar = ["assets/avatars/elemental1.png","assets/avatars/elemental2.png","assets/avatars/elemental3.png"]
    }

    const testHp = {
        6: [hp[0],hp[0],hp[0],avatar[0]],
        5: [hp[1],hp[0],hp[0],avatar[0]],
        4: [hp[2],hp[0],hp[0],avatar[1]],
        3: [hp[2],hp[1],hp[0],avatar[1]],
        2: [hp[2],hp[2],hp[0],avatar[2]],
        1: [hp[2],hp[2],hp[1],avatar[2]]
    }

    for (let i = 0; i <= 6;i++){
        if (i == playerHp && playerHp != 0){
            ws.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: "testHp",
                        value: testHp[i][0],
                        value2: testHp[i][1],
                        value3: testHp[i][2],
                        value4: testHp[i][3]
                    }));
                }
            })
            break
        } else if (playerHp <= 0) {
            ws.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: "Hp",
                        value: hp[2],
                        value2: hp[2],
                        value3: hp[2],
                        value4: avatar[2],
                    }));
                }
            })
            setTimeout(() => {
                lose()
            },5500)
        }
    }
}

















function botChooseGesture(Group) {
    const gestures = Object.keys(gesture_wins)
    // тотальный ужас,короче фильтрует весь лист от 1 группы и бот пикает жесты без неё

    // gesture это прост название анонимной функции
    const availGestures = gestures.filter(gesture => {
        const all_gesture = gesture_wins[gesture] // а здесь мы обозначаем,что сейчас нужно обрабатывать фильтру,ну то есть перебераем список
        const all_group = all_gesture[all_gesture.length - 1] // здесь уже из всех жестов мы достаём их последнее значение а.к.а группу
        return all_group != Group // a zdes sravnivaem s ненужной группой и возращаем только то,что не совпадает с ней
    })
    const random = Math.floor(Math.random() * availGestures.length)
    return availGestures[random]
}

let botManaCount = 2

function botMana(){
    botManaCount += 2
    if (botManaCount >=10){
        botManaCount = 10
    }
    if (botManaCount <= 0){
        botManaCount = 0
    }

    testManaTEXT.innerHTML = botManaCount // UDALIT POTOM
}


// Пытаюсь в алгоритм или шансы
let botChanceSkill1 = 5
let botChanceSkill2 = 5
let botChanceSkill3 = 5

let botChanceSkipRound = 5

function botChanceCalc(){
    if (botManaCount >= 5 && playerHp <= 2 && botHp >= 3){
        botChanceSkill2 += 2
        botChanceSkill1 -= 1
        botChanceSkill3 -= 1

        botChanceSkipRound -= 4
    }
    if (botHp <= 2 && botManaCount >= 4){
        botChanceSkill1 += 3
        botChanceSkill2 -= 3
        botChanceSkill3 += 2

        botChanceSkipRound -= 3
    }
    if (botHp <= 1 && botManaCount >= 5){
        botChanceSkill1 -= 3
        botChanceSkill2 -= 5
        botChanceSkill3 += 5

        botChanceSkipRound -= 5
    }
    if (botHp >= 5 && playerManaCount <= 2 && botManaCount <=4){
        botChanceSkipRound += 2
    } else if(botHp >= 5 && playerManaCount <= 2){
        botChanceSkipRound -= 3
    }

    if (botManaCount <= 1){
        botChanceSkipRound += 999
        botChanceSkill2 -= 999
        botChanceSkill1 -= 999
        botChanceSkill3 -= 999
    }

    if (botManaCount >= 9){
        botChanceSkipRound -= 999
    }
}

function botInvoker(){
    botChanceCalc()
    rand_skill1 = Math.random() * botChanceSkill1
    rand_skill2 = Math.random() * botChanceSkill2
    rand_skill3 = Math.random() * botChanceSkill2

    rand_skipRound = Math.random() * botChanceSkipRound

    botChanceSkill1 = 5
    botChanceSkill2 = 5
    botChanceSkill3 = 5

    if(rand_skill1 > rand_skill2 && rand_skill1 > rand_skill3 && rand_skill1 > rand_skipRound && botManaCount >= 4 ){
        return 1
    } else if(rand_skill2 > rand_skill1 && rand_skill2 > rand_skill3 && rand_skill2 > rand_skipRound && botManaCount >= 5){
        return 2
    }else if(rand_skill3 > rand_skill2 && rand_skill3 > rand_skill1 && rand_skill3 > rand_skipRound && botManaCount >= 5){
        return 3
    } else{
        return 10
    }

}

function botCast(){
    botInvokerNum = botInvoker()
    textBotSkill.innerHTML = "Противник применил скилл:"

    if(botInvokerNum == 1){
        botManaCount -= 4
        textBotSkill.innerHTML += "Заблокировать тебе Эээ,какую то группу,я ещё не сделал"
        // Придумать как заблокировать игроку одну из 4 стихий
    } else if(botInvokerNum == 2){
        alert("Bot skill 2")
        botManaCount -= 5
        textBotSkill.innerHTML += "Увеличить урон!"
        return 2
    } else if(botInvokerNum == 3){
        alert("Bot skill 3")
        botManaCount -= 5
        botHp += 1
        textBotSkill.innerHTML += "Противник решил похилиться"
    } else{
        textBotSkill.innerHTML += "Противник решил пропустить ход"
    }
}