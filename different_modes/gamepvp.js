module.exports = function(io) {

    //краткая историческая справка,p1/p2 - обозначение игроков в каждой комнате,всего в каждой комнате их 2

    // /pvp - значит типа мини сервера внитри большого сервера,у нас есть галавной серв server js,а это мини сервер где связан этот файл и клиентский
    const pvpGame = io.of("/pvp")

    const wait = []
    const rooms = {}

    const activePlayer = []

    pvpGame.on("connection", socket => {
        console.log("PvP player connected:", socket.id)


        socket.on("disconnect", () =>{
            console.log("PvP player left:",socket.id)
        })

        socket.on("disconnecting", () => {
            const roomId = [...socket.rooms][1] // ... эт оператор который типа расширяет поиск по элементу,ну или как здесь по массиву,объяснить очень сложно,вбей в гугле spread operator
            if(roomId == undefined) return
            socket.leave(roomId)
            pvpGame.to(roomId).emit("enemyLeave")

            if (rooms[roomId].enemyLeave == true){ // проверка на лив из румы,без неё,когда выйдет второй юзер будет ошибка
                console.log("Del room: ", rooms[roomId])
                delete rooms[roomId]
                return
            }
            rooms[roomId].enemyLeave = true
            rooms[roomId].gameEnd = true
        })

        socket.on("searchRoom", () =>{
            if (wait.includes(socket)) return // проверка на нахождении в списке ждунов
            if(activePlayer.includes(socket)) return // проверка на то,что пытается ли юзер нагло запуститься в ещё одну руму
            wait.push(socket)
            activePlayer.push(socket)

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
                    avatar: { [p1.id]: undefined, [p2.id]: undefined},
                    confirmBtn: {[p1.id]: false, [p2.id]: false},
                    timerInterval: null,
                    timerRun: false,
                    intervalTimerEndRound: null,
                    gesture: { [p1.id]: "-", [p2.id]: "-"},
                    roundCount: 1,
                    mana: {[p1.id]: 2, [p2.id]: 2},
                    skill: {[p1.id]: 0, [p2.id]: 0},
                    gameEnd: false,
                    enemyLeave: false
                }
            
                pvpGame.to(roomId).emit("findGame", roomId)
                startRoundTimer(socket,roomId) // стартуем таймер здесь,так как пользователя 2 и нельзя чтоб таймер удваилвася
            }
        })

        socket.on("chooseGesture", ({roomId, gesture}) =>{
            const room = rooms[roomId] // проверка на руму
            if (!room) return
            if (room.gameEnd) return
            if(gesture_wins[gesture] == undefined) return

            room.gesture[socket.id] = gesture // по айдишнику ищем нужного игрока и выдаём ему его выбранный жест
        })

        socket.on("AvatarImg", ({roomId,avatar}) =>{
            const room = rooms[roomId] // проверка на руму
            if (!room) return
            if (room.gameEnd) return
            const p1 = room.player[0]
            const p2 = room.player[1]
            if (room.avatar[p1] != undefined && room.avatar[p2] != undefined){
                return
            }

            room.avatar[socket.id] = avatar
            let player = socket.id
            calcHpAvatarServ(roomId, player)
        })


        socket.on("confirmBtn", roomId =>{
            const room = rooms[roomId] // проверка на руму
            if (!room) return
            if (room.gameEnd) return
            if(room.confirmBtn[socket.id]) return

            room.confirmBtn[socket.id] = true
            const p1 = room.player[0]
            const p2 = room.player[1]

            // console.log(room.gesture[p1], " - ",room.gesture[p2] )

            if (room.confirmBtn[p1] == true && room.confirmBtn[p2] == true){
                roundEnd(socket, roomId)
            }
        })

        socket.on("playAgain", roomId =>{
            const room = rooms[roomId] // проверка на руму
            if (!room) return
            if (!room.gameEnd) return

            const p1 = room.player[0]
            const p2 = room.player[1]


            if (room.hp[p1] || room.hp[p2] || socket.rooms.size == 1){
                playAgain(socket,roomId)
            }
        })

        socket.on("firstSkill", ({roomId,skill}) =>{
            const room = rooms[roomId] // проверка на руму
            if (room.gameEnd) return
            if (!room) return

            firstSkills(socket,roomId, skill)
        })

        socket.on("skills", ({roomId,skill}) =>{
            const room = rooms[roomId] // проверка на руму
            if (room.gameEnd) return
            if (!room) return

            allSkills(socket,roomId,skill)
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
        if (!room) return
        if (room.gameEnd) return
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
        if (!room) return
        if (room.gameEnd) return

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
        room.gameEnd = true

        const playerSocket = pvpGame.sockets.get(player)

        clearInterval(room.timerInterval)
        playerSocket.emit("loseGame")
        win(roomId,player)
    }

    function win(roomId,player){
        const room = rooms[roomId]
        if (!room) return


        const p1 = room.player[0]
        const p2 = room.player[1]

        let playerSocket

        if(player == p1){
            playerSocket = pvpGame.sockets.get(p2)
        } else if(player == p2){
            playerSocket = pvpGame.sockets.get(p1)
        }
        clearInterval(player.timerInterval)
        playerSocket.emit("winGame")
    }

    function roundEnd(socket,roomId){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

        let p1 = room.player[0]
        let p2 = room.player[1]

        const playerSocket1 = pvpGame.sockets.get(p1) // образаюсь к клиентам нппрямую по сокету 
        const playerSocket2 = pvpGame.sockets.get(p2)


        if(room.gesture[p1] != "-" && room.gesture[p2] != "-") {
            clearInterval(room.timerInterval)
            room.timerRun = false
            roundMana(roomId)
            enemySkill(roomId,p1)
            enemySkill(roomId,p2)
            playerSocket1.emit("EnemyHp", room.hp[p2])
            playerSocket2.emit("EnemyHp", room.hp[p1])
            if (room.gesture[p1] == room.gesture[p2]){
                playerSocket1.emit("roundStatus", "У вас ничья")
                playerSocket2.emit("roundStatus", "У вас ничья")
                // равыне по силе жесты проверка
            } else if(gesture_wins[room.gesture[p1]].includes(room.gesture[p2]) && gesture_wins[room.gesture[p2]].includes(room.gesture[p1])){
                //вынести в отдельную функцию!!!!
                if (room.skill[p1] == 7){
                    playerSocket1.emit("roundStatus","Равный жест не сработал.Ты выйграл")
                    playerSocket2.emit("roundStatus","Равный жест не сработал.Ты проиграл")
                    playerHpLose(roomId,p2)
                } else if(room.skill[p2] == 7){
                    playerSocket1.emit("roundStatus","Равный жест не сработал.Ты проиграл")
                    playerSocket2.emit("roundStatus","Равный жест не сработал.Ты выйграл")
                    playerHpLose(roomId,p1)
                } else{
                    playerSocket1.emit("roundStatus","Сыграны равные по силе жесты вы оба теряете hp")
                    playerSocket2.emit("roundStatus","Сыграны равные по силе жесты вы оба теряете hp")
                    playerHpLose(roomId,p1)
                    playerHpLose(roomId,p2)
                }
            } else if (gesture_wins[room.gesture[p1]].includes(room.gesture[p2])){
                playerSocket1.emit("roundStatus","Ты выйграл")
                playerSocket2.emit("roundStatus","Ты проиграл вамп вамп")
                playerHpLose(roomId,p2)

            } else{
                playerSocket1.emit("roundStatus","Ты проиграл вамп вамп")
                playerHpLose(roomId,p1)
                playerSocket2.emit("roundStatus","Ты выйграл")

            }
            skillZero(roomId)
            textSkills(roomId)
            endRoundTimer(socket,roomId)
        } else{
            //потом заменить алёрт на pop окно по желанию конечно
        }
    }

    function enemySkill(roomId,player){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

        let p1 = room.player[0]
        let p2 = room.player[1]

        if(player == p1){
            p1 = room.player[1]
            p2 = room.player[0]
        }

        const playerSocket = pvpGame.sockets.get(p2)// образаюсь к клиентам нппрямую по сокету 

        //как же меня иф елсе бесят,ну чё та тут нигде свитч кейсы не поюзать нормально
        if(room.skill[p1] >= 1 && room.skill[p1] <= 4){
            playerSocket.emit("enemyTextSkill", "Противник заблокировал вам одну из 4 групп")
        } else if(room.skill[p1] == 5){
            playerSocket.emit("enemyTextSkill", "Противник увеличил урон!")
        } else if(room.skill[p1] == 6){
            playerSocket.emit("enemyTextSkill", "Противник похилился")
        } else if(room.skill[p1] == 7){
            playerSocket.emit("enemyTextSkill", "Отключил вам равные жесты")
        } else if(room.skill[p1] == 8){
            playerSocket.emit("enemyTextSkill", "Противник поставил ловушку")
        } else if(room.skill[p1] == 9){
            playerSocket.emit("enemyTextSkill", "Противник был неуязвимым этот ход")
        } else{
            playerSocket.emit("enemyTextSkill", "Противник пропустил этот ход")
        }
    }

    function skillZero(roomId){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

        let p1 = room.player[0]
        let p2 = room.player[1]

        room.skill[p1] = 0
        room.skill[p2] = 0
    }

    function endRoundTimer(socket, roomId){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

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
                textSkills(roomId)
            }
        }, "1000")

        playerSocket1.emit("roundScreenState", room.roundCount, room.gesture[p2])
        playerSocket2.emit("roundScreenState", room.roundCount, room.gesture[p1])
        
    }

    function playerHpLose(roomId,player){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

        const p1 = room.player[0]
        const p2 = room.player[1]

        const playerSocket1 = pvpGame.sockets.get(p1) // образаюсь к клиентам нппрямую по сокету 
        const playerSocket2 = pvpGame.sockets.get(p2)

        if (room.skill[player] == 9){
            let sock = pvpGame.sockets.get(player)
            sock.emit("roundStatusInvincible", ",но невиданный щит спас вас от урона :)")
        } else if(room.skill[p1] == 5 && room.skill[p2] == 5){
            room.hp[player] -= 3
        } else if (room.skill[p1] == 5 || room.skill[p2] == 5){
            room.hp[player] -= 2
        } else{
            room.hp[player] -= 1
        }

        if(p1 == player){
            playerSocket2.emit("EnemyHp", room.hp[player])
        } else{
            playerSocket1.emit("EnemyHp", room.hp[player])
        }
        calcHpAvatarServ(roomId, player)
    }

    function roundMana(roomId){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

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
        if (!room) return
        if (room.gameEnd) return

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

    function playAgain(socket,roomId) {
        const room = rooms[roomId]
        if (!room) return
        if (!room.gameEnd) return

        socket.emit("RestartGame")
    }

    function firstSkills(socket,roomId,skill){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

        let player = socket.id

        // console.log(room.skill[player])

        if (skill == "first" && room.mana[player] >= 4){
            room.mana[player] -= 4
            room.skill[player] = 1
        } else if (skill == "second" && room.mana[player] >= 4){
            room.mana[player] -= 4
            room.skill[player] = 2
        } else if (skill == "third" && room.mana[player] >= 4){
            room.mana[player] -= 4
            room.skill[player] = 3
        } else if (skill == "fourth" && room.mana[player] >= 4){
            room.mana[player] -= 4
            room.skill[player] = 4
        }
        calcMana(roomId)
        textSkills(roomId)
    }

    function allSkills(socket,roomId,skill){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

        let player = socket.id

        if (skill == "damage" && room.mana[player] >= 3 && room.skill[player] == 0){ // damage uvel
            room.mana[player]-= 3
            room.skill[player] = 5
        } else if(skill == "heal" && room.mana[player] >= 5 && room.skill[player] == 0){ // pohill 
            room.mana[player]-= 5
            room.skill[player] = 6
            room.hp[player] += 1
        } else if(skill == "equalGesture" && room.mana[player] >= 2 && room.skill[player] == 0){ // ravnie gestures otkl
            room.mana[player]-= 2
            room.skill[player] = 7
        } else if(skill == "trap" && room.mana[player] >= 4 && room.skill[player] == 0){ // trap
            room.mana[player]-= 4
            room.skill[player] = 8
        } else if(skill == "invincible" && room.mana[player] >= 8 && room.skill[player] == 0){ // neujazvimost
            room.mana[player] -= 8
            room.skill[player] = 9
        } else if (player.selectSkill != 0) {
            socket.emit("selectSkillMsg")
        }

        calcMana(roomId)
        textSkills(roomId)
        calcHpAvatarServ(roomId,player)
    }

    function textSkills(roomId){
        const room = rooms[roomId]
        if (!room) return
        if (room.gameEnd) return

        const p1 = room.player[0]
        const p2 = room.player[1]

        const playerSocket1 = pvpGame.sockets.get(p1) // образаюсь к клиентам нппрямую по сокету 
        const playerSocket2 = pvpGame.sockets.get(p2)


        playerSocket1.emit("TextSkill", room.skill[p1])
        playerSocket2.emit("TextSkill", room.skill[p2])
    }

}