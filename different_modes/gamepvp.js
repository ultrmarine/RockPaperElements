module.exports = function(io) {

    //краткая историческая справка,p1/p2 - обозначение игроков в каждой комнате,всего в каждой комнате их 2

    // /pvp - значит типа мини сервера внитри большого сервера,у нас есть галавной серв server js,а это мини сервер где связан этот файл и клиентский
    const pvpGame = io.of("/pvp")

    const wait = []
    const rooms = {}

    pvpGame.on("connection", socket => {
        console.log("PvP player connected:", socket.id)


        socket.on("disconnect", () =>{
            console.log("DEL:",socket.id)
        })

        socket.on("searchRoom", () =>{
            if (wait.includes(socket)) return // проверка на нахождении в списке ждунов
            wait.push(socket)

            if (wait.length >= 2){
                //вытаскивает из списка ждунов тока первого чела и удаляет его из списка
                const p1 = wait.shift()
                const p2 = wait.shift()

                const roomId = p1.id + p2.id + "_" + Math.random().toString(36).substring(2, 8)

                //лучшая фича socket io, позволяет создавать для сокетов отдельные комнаты где будут находиться они
                p1.join(roomId)
                p2.join(roomId)

                rooms[roomId] = {
                    player: [p1.id, p2.id],
                    hp: { [p1.id]: 6, [p2.id]: 6 },
                    avatar: { [p1.id]: "skeleton", [p2.id]: "skeleton"},
                    confirmBtn: {[p1.id]: false, [p2.id]: false},
                    timerInterval: null,
                    timerRun: false,
                    intervalTimerEndRound: null,
                    gesture: { [p1.id]: "-", [p2.id]: "-"},
                    roundCount: 1,
                    mana: {[p1.id]: 2, [p2.id]: 2},
                    skill: {[p1.id]: 0, [p2.id]: 0},
                    gameEnd: false
                }
            
                pvpGame.to(roomId).emit("findGame", roomId)
                startRoundTimer(socket,roomId) // стартуем таймер здесь,так как пользователя 2 и нельзя чтоб таймер удваилвася 
            }
        })

        socket.on("chooseGesture", ({roomId, gesture}) =>{
            const room = rooms[roomId] // проверка на руму
            if (room.gameEnd) return
            if (!room) return
            if(!gesture_wins[gesture]) return

            room.gesture[socket.id] = gesture // по айдишнику ищем нужного игрока и выдаём ему его выбранный жест
        })

        socket.on("AvatarImg", ({roomId,avatar}) =>{
            const room = rooms[roomId] // проверка на руму
            if (room.gameEnd) return
            if (!room) return

            rooms[roomId].avatar[socket.id] = avatar
            let player = socket.id
            calcHpAvatarServ(roomId, player)
        })


        socket.on("confirmBtn", roomId =>{
            const room = rooms[roomId] // проверка на руму
            if (room.gameEnd) return
            if (!room) return
            if(room.confirmBtn[socket.id]) return

            room.confirmBtn[socket.id] = true
            const p1 = room.player[0]
            const p2 = room.player[1]

            console.log(room.gesture[p1], " ",room.gesture[p2] )

            if (room.confirmBtn[p1] == true && room.confirmBtn[p2] == true){
                roundEnd(socket, roomId)
            }
        })




    })

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

    function startRoundTimer(socket,roomId) {
        const room = rooms[roomId]
        if (room.gameEnd) return
        if (!room) return
        if (room.timerRun) return
        room.timerRun = true

        const p1 = room.player[0]
        const p2 = room.player[1]


        let defaultTimer = 60
        room.timerInterval = setInterval(() => {
            defaultTimer--
            pvpGame.to(roomId).emit("timerUpdate", defaultTimer)
            if (defaultTimer <= 0) {
                clearInterval(room.timerInterval)
                room.timerRun = false
                if (room.gesture[p1] == "-"){
                    room.gesture[p1] = "rock"
                }
                if (room.gesture[p2] == "-"){
                    room.gesture[p2] = "rock"
                }
                roundEnd(socket,roomId)
            }
        }, 1000)
    }

    function calcHpAvatarServ(roomId,player){
        const room = rooms[roomId]
        if (room.gameEnd) return
        if (!room) return

        const playerSocket = pvpGame.sockets.get(player) // образаюсь к клиентам нппрямую по сокету 
        
        const hp = ["assets/icons/red-hp.png","assets/icons/half-red-hp.png","assets/icons/empty-hp.png"]
        let avatar = ["assets/avatars/skeleton1.jpg","assets/avatars/skeleton2.jpg","assets/avatars/skeleton3.jpg"]

        if (room.avatar[player] == "wizard"){
            avatar = ["assets/avatars/wizard1.png","assets/avatars/wizard2.png","assets/avatars/wizard3.png"]
        } else if(room.avatar[player] == "elemental"){
            avatar = ["assets/avatars/elemental1.png","assets/avatars/elemental2.png","assets/avatars/elemental3.png"]
        } else if(room.avatar[player] == "skeleton"){
            avatar = ["assets/avatars/skeleton1.jpg","assets/avatars/skeleton2.jpg","assets/avatars/skeleton3.jpg"]
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
            if (i == room.hp[player] && room.hp[player] != 0){
                playerSocket.emit("testHp", testHp[i][0],testHp[i][1],testHp[i][2],testHp[i][3])
                break
            } else if (room.hp[player] <= 0) {
                playerSocket.emit("Hp", hp[2],hp[2],hp[2],avatar[2])
                setTimeout(() => {
                    lose(roomId,player)
                },5500)
            }
        }
    }

    // СДЕЛАТЬ БЛОКИРОВКУ ВСЕХ ФУНКЦИЙ ПРИ ВЫГРЫЙШЕ ИЛИ ПОРАЖЕНИИ В ИГРЕ!!!

    function lose(roomId,player){
        const room = rooms[roomId]
        if (!room) return

        const playerSocket = pvpGame.sockets.get(player)

        clearInterval(room.timerInterval)
        room.gameEnd = true
        playerSocket.emit("loseGame")
        win(roomId,player)
    }

    function win(roomId,player){
        const room = rooms[roomId]
        if (!room) return


        const p1 = room.player[0]
        const p2 = room.player[1]

        let playerSocket = pvpGame.sockets.get(player)

        if(player == p1){
            playerSocket = pvpGame.sockets.get(p2)
        }


        clearInterval(player.timerInterval)
        room.gameEnd = true
        playerSocket.emit("winGame")
    }

    function roundEnd(socket,roomId){
        const room = rooms[roomId]
        if (room.gameEnd) return
        if (!room) return

        let p1 = room.player[0]
        let p2 = room.player[1]

        const playerSocket1 = pvpGame.sockets.get(p1) // образаюсь к клиентам нппрямую по сокету 
        const playerSocket2 = pvpGame.sockets.get(p2)


        if(room.gesture[p1] != "-" && room.gesture[p2] != "-") {
            clearInterval(room.timerInterval)
            room.timerRun = false
            roundMana(roomId)

            if (room.gesture[p1] == room.gesture[p2]){
                playerSocket1.emit("roundStatus", "У вас ничья")
                playerSocket2.emit("roundStatus", "У вас ничья")

                // player.selectSkill = 0
            } else if(gesture_wins[room.gesture[p1]].includes(room.gesture[p2]) && gesture_wins[room.gesture[p2]].includes(room.gesture[p1])){ //ravnie по силе жесты проверка
                //доработать
                playerSocket1.emit("roundStatus","Сыграны равные по силе жесты вы оба теряете hp")
                playerSocket2.emit("roundStatus","Сыграны равные по силе жесты вы оба теряете hp")
                playerHpLose(socket,roomId,p1)
                playerHpLose(socket,roomId,p2)
                
                // player.selectSkill = 0
            } else if (gesture_wins[room.gesture[p1]].includes(room.gesture[p2])){
                playerSocket1.emit("roundStatus","Ты выйграл")
                playerSocket2.emit("roundStatus","Ты проиграл вамп вамп")
                playerHpLose(socket,roomId,p2)
                

                // if(player.selectSkill == 7 && gesture_wins[player.gesture].includes(playerGestureChoice)){
                //     socket.emit("roundStatus","Равный жест не сработал.Ты выйграл")
                // }
                
                // player.selectSkill = 0
            } else{
                playerSocket1.emit("roundStatus","Ты проиграл вамп вамп")
                playerHpLose(socket,roomId,p1)
                playerSocket2.emit("roundStatus","Ты выйграл")

                // player.selectSkill = 0
            }
            endRoundTimer(socket,roomId)
        } else{
            //потом заменить алёрт на pop окно по желанию конечно
        }
    }

    function endRoundTimer(socket, roomId){
        const room = rooms[roomId]
        if (room.gameEnd) return
        if (!room) return

        const p1 = room.player[0]
        const p2 = room.player[1]

        const playerSocket1 = pvpGame.sockets.get(p1) // образаюсь к клиентам нппрямую по сокету 
        const playerSocket2 = pvpGame.sockets.get(p2)

        let defaultTimer = 5
        room.roundCount += 1

        room.intervalTimerEndRound = setInterval(() => {
            defaultTimer-=1
            pvpGame.to(roomId).emit("EndTimerUpdate", defaultTimer)

            if (defaultTimer <= 0){
                room.timerRun = false
                room.confirmBtn[p1] = false
                room.confirmBtn[p2] = false

                clearInterval(room.intervalTimerEndRound)
                pvpGame.to(roomId).emit("EndTimerClose")
                startRoundTimer(socket,roomId)

                // textSkills(socket)
                
                
            }
        }, "1000")

        playerSocket1.emit("roundScreenState", room.roundCount, room.gesture[p2])
        playerSocket2.emit("roundScreenState", room.roundCount, room.gesture[p1])
        
    }

    function playerHpLose(socket,roomId,player){
        const room = rooms[roomId]
        if (room.gameEnd) return
        if (!room) return

        const p1 = room.player[0]
        const p2 = room.player[1]

        const playerSocket1 = pvpGame.sockets.get(p1) // образаюсь к клиентам нппрямую по сокету 
        const playerSocket2 = pvpGame.sockets.get(p2)

        // if (player.selectSkill == 9){
        //     // textRoundTotal.innerHTML += ", но невиданный щит спас вас от урона :)"
        // } else if(player.selectSkill == 5 && player.botCast == 2){
        //     player.hp -= 3
        // } else if (player.selectSkill == 5 || player.botCast == 2){
        //     player.hp -= 2
        // } else{
        //     player.hp -= 1
        // }

        room.hp[player] -= 1

        if(p1 == player){
            playerSocket2.emit("EnemyHp", room.hp[player])
        } else{
            playerSocket1.emit("EnemyHp", room.hp[player])
        }


        calcHpAvatarServ(roomId, player)
    }

    function roundMana(roomId){
        const room = rooms[roomId]
        if (room.gameEnd) return
        if (!room) return

        const p1 = room.player[0]
        const p2 = room.player[1]

        if (room.mana[p1] < 10){
            room.mana[p1]+= 2
        }
        if (room.mana[p2] < 10){
            room.mana[p2]+= 2
        }
        calcMana(roomId)
    }

    function calcMana(roomId){
        const room = rooms[roomId]
        if (room.gameEnd) return
        if (!room) return

        const p1 = room.player[0]
        const p2 = room.player[1]

        const playerSocket1 = pvpGame.sockets.get(p1) // образаюсь к клиентам нппрямую по сокету 
        const playerSocket2 = pvpGame.sockets.get(p2)

        playerSocket1.emit("calcMana",room.mana[p1])
        playerSocket2.emit("calcMana",room.mana[p2])

        if (room.mana[p1] >= 10){
            room.mana[p1] = 10
        }
        if (room.mana[p2] >= 10){
            room.mana[p2] = 10
        }
    }

}