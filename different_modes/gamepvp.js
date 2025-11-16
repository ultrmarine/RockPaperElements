module.exports = function(ws) {

    //краткая историческая справка,p1/p2 - обозначение игроков в каждой комнате,всего в каждой комнате их 2

    // /pvp - значит типа мини сервера внитри большого сервера,у нас есть галавной серв server js,а это мини сервер где связан этот файл и клиентский
    const pvpGame = ws.of("/pvp")

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

                const roomId = p1 + p2 + "_" + Math.random().toString(36).substring(2, 8)

                //лучшая фича socket io, позволяет создавать для сокетов отдельные комнаты где будут находиться они
                p1.join(roomId)
                p2.join(roomId)

                rooms[roomId] = {
                    player: [p1.id, p2.id],
                    hp: { [p1.id]: 6, [p2.id]: 6 },
                    timerInterval: null,
                    timerRun: false,
                    intervalTimerEndRound: null,
                    gesture: { [p1.id]: "-", [p2.id]: "-"}
                }
            
                pvpGame.to(roomId).emit("findGame", roomId)
                startRoundTimer(socket,roomId) // стартуем таймер здесь,так как пользователя 2 и нельзя чтоб таймер удваилвася 
            }
        })

        socket.on("chooseGesture", ({roomId, gesture}) =>{
            const room = rooms[roomId] // проверка на руму
            if (!room) return
            const p1 = rooms[roomId].player[0]
            const p2 = rooms[roomId].player[1]

            if (p1 == socket.id){ // проверка на какого именно пользователя выбравшего знак
                room.gesture[p1] = gesture
            } else if( p2 == socket.id){
                room.gesture[p2] = gesture
            }
        })

        
    })

    function startRoundTimer(socket,roomId) {
        const room = rooms[roomId]
        if (!room) return
        if (room.timerRun) return
        room.timerRun = true

        let p1Gesture = rooms[roomId].gesture[socket.id]
        let p2Gesture = rooms[roomId].gesture[socket.id]

        let defaultTimer = 60
        room.timerInterval = setInterval(() => {
            defaultTimer--
            pvpGame.to(roomId).emit("timerUpdate", defaultTimer)
            if (defaultTimer <= 0) {
                clearInterval(room.timerInterval)
                room.timerRun = false
                if (p1Gesture == "-"){
                    p1Gesture = "rock"
                }
                if (p2Gesture == ""){
                    p2Gesture = "rock"
                }

            }
        }, 1000)
    }

}