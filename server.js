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

ws.on("connection", socket => {
    console.log("подключился");

    socket.on("message", msg => {
        const data = msg.toString();
        console.log("Сообщение klienta:", data);

        if (data == "startTimer") {
            startRoundTimer();
        }
        if (data === gesture_wins){ // сделать сравнение жестов

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
                }));
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
