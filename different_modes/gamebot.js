module.exports = function(io) { 

    const botGame = io.of("/bot")

    const players = new Map()

    botGame.on("connection", function (socket){
        console.log("igrok:", socket.id)

        players.set(socket.id, {
            hp: 6, // hp igroka
            mana: 2, // mana igroka
            botHp: 6, // hp botika
            botMana: 2, // mana botika
            botCast: null, // скилл бота
            gesture: "-", // jest vibranii igrokom
            botChoose: "-", // jest vibranii botom
            blockGroupBot: "-", // заблоканая группа на раунд для бота
            avatar: "skeleton", // avatarka igroka
            avatarSet: null,
            selectSkill: 0, // vibranii skill igroka
            skill8PlayerChoice: "-", // jest na kotorii postavlena lovushka
            roundCount: 1, // kol-vo raundov
            timerRun: false, // zapushen li taimer na 1 hod
            timerInterval: null, // ssilka na taimer dlja igroka
            intervalTimerEndRound: null, // ssilka na taimer mejdu raundami
            divManaHeight: 450, // razmer diva s manoi (мейби заменить на чёта стоит МИРОН ДЕЛАЙ CSS НУ ПЛИЗ НУ ПОЖАЛУЙТСА)
            botChanceSkill1: 5,
            botChanceSkill2: 5,
            botChanceSkill3: 5,
            botChanceSkipRound: 5,
            botInvokerNum: null
        })

        socket.on("disconnect", function (){
            players.delete(socket.id)
            console.log("DEL:",socket.id)
        })

        socket.on("chooseGesture", (gesture) => {
            const player = players.get(socket.id)
            if (!player) return
            if(gesture_wins[gesture] == undefined) return
            
            player.gesture = gesture
        })
        
        socket.on("AvatarImg", (avatar) =>{
            const player = players.get(socket.id)
            if (!player) return
            if (player.avatarSet != null) return
            if(avatar == "skeleton" || avatar == "wizard" || avatar == "elemental"){
                player.avatarSet = avatar
                player.avatar = avatar
                calcHpAvatarServ(socket)
            } else return 
        })

        socket.on("startTimer", () =>{
            const player = players.get(socket.id)
            if (!player) return
            startRoundTimer(socket)
        })

        socket.on("confirmBtn", () =>{
            const player = players.get(socket.id)
            if (!player) return
            roundEnd(socket)
        })

        socket.on("skills", (skill) =>{
            const player = players.get(socket.id)
            if (!player) return

            allSkills(socket, skill)
        })

        socket.on("firstSkill", (skill) =>{
            const player = players.get(socket.id)
            if (!player) return
            firstSkills(socket, skill)
        })

        socket.on("trapChoice", (gesture)=>{
            const player = players.get(socket.id)
            if (!player) return
            if (gesture_wins[gesture]){
                skill8PlayerChoice = gesture
                allSkills(socket,"trap")
            }
        })

        socket.on("playAgain", ()=>{
            const player = players.get(socket.id)
            if (!player) return

            if(player.hp === 0 || player.botHp === 0){
                playAgain(socket)
            }
        })
        
    })

    function startRoundTimer(socket) {
        const player = players.get(socket.id)
        if (!player) return
        if (player.timerRun) return
        player.timerRun = true

        let defaultTimer = 60
        player.botChoose = botChooseGesture(player.blockGroupBot)
        player.blockGroupBot = null
        player.timerInterval = setInterval(() => {
            defaultTimer--
            socket.emit("timerUpdate", defaultTimer)
            if (defaultTimer <= 0) {
                clearInterval(player.timerInterval)
                player.timerRun = false
                if (player.gesture == "-"){
                    player.gesture = "rock"
                }
                roundEnd(socket)
            }
        }, 1000)
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

    function roundEnd(socket){
        const player = players.get(socket.id)
        if (!player) return

        if(player.gesture != "-") {
            clearInterval(player.timerInterval)
            player.timerRun = false
            roundMana(socket)
            player.botCast = botCast(socket)
            botMana(socket)

            if (player.selectSkill == 8 && player.skill8PlayerChoice == player.botChoose){
                // потом сделать,либо потерю хп,либо потерю маны
                socket.emit("BotTrap")
                player.skill8PlayerChoice = ""
            }

            if (player.gesture == player.botChoose){
                socket.emit("roundStatus", "У вас ничья")
                player.selectSkill = 0
            } else if(gesture_wins[player.gesture].includes(player.botChoose) && gesture_wins[player.botChoose].includes(player.gesture) && player.selectSkill != 7){ //ravnie по силе жесты проверка
                //доработать
                socket.emit("roundStatus","Сыграны равные по силе жесты вы оба теряете hp")
                playerHpLose(socket)
                botHpLose(socket)
                player.selectSkill = 0
            } else if (gesture_wins[player.gesture].includes(player.botChoose)){
                    socket.emit("roundStatus","Ты выйграл")

                if(player.selectSkill == 7 && gesture_wins[player.gesture].includes(playerGestureChoice)){
                    socket.emit("roundStatus","Равный жест не сработал.Ты выйграл")
                }
                botHpLose(socket)
                player.selectSkill = 0
            } else{
                socket.emit("roundStatus","Ты проиграл")
                playerHpLose(socket)
                player.selectSkill = 0
            }
            endRoundTimer(socket)

        } else{
            //потом заменить алёрт на pop окно по желанию конечно
        }
    }

    function playerHpLose(socket){
        const player = players.get(socket.id)
        if (!player) return

        if (player.selectSkill == 9){
            // textRoundTotal.innerHTML += ", но невиданный щит спас вас от урона :)"
        } else if(player.selectSkill == 5 && player.botCast == 2){
            player.hp -= 3
        } else if (player.selectSkill == 5 || player.botCast == 2){
            player.hp -= 2
        } else{
            player.hp -= 1
        }
        calcHpAvatarServ(socket)
    }

    function botHpLose(socket){
        const player = players.get(socket.id)
        if (!player) return

        if (player.selectSkill == 5 && player.botCast == 2){
            player.botHp -= 3
        } else if(player.selectSkill == 5 || player.botCast == 2){
            player.botHp -= 2
        }else {
            player.botHp -= 1
        }
        socket.emit("botHpStatus",player.botHp)

        if(player.botHp <= 0){
            player.botHp = 0
            setTimeout(() => {
                win(socket)
            },5500)
        }
    }

    function endRoundTimer(socket){
        const player = players.get(socket.id)
        if (!player) return


        let defaultTimer = 5
        player.roundCount += 1

        player.intervalTimerEndRound = setInterval(() => {
            defaultTimer-=1
            socket.emit("EndTimerUpdate", defaultTimer)

            if (defaultTimer <= 0){
                player.timerRun = false
                clearInterval(player.intervalTimerEndRound)
                socket.emit("EndTimerClose")

                startRoundTimer(socket)
                textSkills(socket)
                
                
            }
        }, "1000")

        socket.emit("roundScreenState",player.roundCount,player.botChoose)
    }

    function lose(socket){
        const player = players.get(socket.id)
        if (!player) return

        clearInterval(player.timerInterval)
        socket.emit("loseGame")
    }

    function win(socket){
        const player = players.get(socket.id)
        if (!player) return

        clearInterval(player.timerInterval)
        socket.emit("winGame")
    }


    function textSkills(socket){
        const player = players.get(socket.id)
        if (!player) return

        socket.emit("TextSkill", player.selectSkill)
    }

    function calcHpAvatarServ(socket){
        const player = players.get(socket.id)
        if (!player) return

        const hp = ["assets/icons/red-hp.png","assets/icons/half-red-hp.png","assets/icons/empty-hp.png"]
        let avatar = ["assets/avatars/skeleton1.png","assets/avatars/skeleton2.png","assets/avatars/skeleton3.png"]

        if (player.avatar == "wizard"){
            avatar = ["assets/avatars/wizard1.png","assets/avatars/wizard2.png","assets/avatars/wizard3.png"]
        } else if(player.avatar == "elemental"){
            avatar = ["assets/avatars/elemental1.png","assets/avatars/elemental2.png","assets/avatars/elemental3.png"]
        } else if(player.avatar == "skeleton"){
            avatar = ["assets/avatars/skeleton1.png","assets/avatars/skeleton2.png","assets/avatars/skeleton3.png"]
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
            if (i == player.hp && player.hp != 0){
                socket.emit("testHp", testHp[i][0],testHp[i][1],testHp[i][2],testHp[i][3])
                break
            } else if (player.hp <= 0) {
                socket.emit("Hp", hp[2],hp[2],hp[2],avatar[2])
                setTimeout(() => {
                    lose(socket)
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


    function botMana(socket){
        const player = players.get(socket.id)
        if (!player) return

        player.botMana += 2
        if (player.botMana >=10){
            player.botMana = 10
        }
        if (player.botMana <= 0){
            player.botMana = 0
        }

    }


    // Пытаюсь в алгоритм или шансы

    function botChanceCalc(socket){
        const player = players.get(socket.id)
        if (!player) return

        if (player.botMana >= 5 && player.hp <= 2 && player.botHp >= 3){
            player.botChanceSkill2 += 2
            player.botChanceSkill1 -= 1
            player.botChanceSkill3 -= 1

            player.botChanceSkipRound -= 4
        }
        if (player.botHp <= 2 && player.botMana >= 4){
            player.botChanceSkill1 += 3
            player.botChanceSkill2 -= 3
            player.botChanceSkill3 += 2

            player.botChanceSkipRound -= 3
        }
        if (player.botHp <= 1 && player.botMana >= 5){
            player.botChanceSkill1 -= 3
            player.botChanceSkill2 -= 5
            player.botChanceSkill3 += 5

            player.botChanceSkipRound -= 5
        }
        if (player.botHp >= 5 && player.mana <= 2 && player.botMana <=4){
            player.botChanceSkipRound += 2
        } else if(player.botHp >= 5 && player.mana <= 2){
            player.botChanceSkipRound -= 3
        }

        if (player.botMana <= 1){
            player.botChanceSkipRound += 999
            player.botChanceSkill2 -= 999
            player.botChanceSkill1 -= 999
            player.botChanceSkill3 -= 999
        }

        if (player.botMana >= 9){
            player.botChanceSkipRound -= 999
        }
    }

    function botInvoker(socket){
        const player = players.get(socket.id)
        if (!player) return

        botChanceCalc(socket)
        rand_skill1 = Math.random() * player.botChanceSkill1
        rand_skill2 = Math.random() * player.botChanceSkill2
        rand_skill3 = Math.random() * player.botChanceSkill2

        rand_skipRound = Math.random() * player.botChanceSkipRound

        player.botChanceSkill1 = 5
        player.botChanceSkill2 = 5
        player.botChanceSkill3 = 5

        if(rand_skill1 > rand_skill2 && rand_skill1 > rand_skill3 && rand_skill1 > rand_skipRound && player.botMana >= 4 ){
            return 1
        } else if(rand_skill2 > rand_skill1 && rand_skill2 > rand_skill3 && rand_skill2 > rand_skipRound && player.botMana >= 5){
            return 2
        }else if(rand_skill3 > rand_skill2 && rand_skill3 > rand_skill1 && rand_skill3 > rand_skipRound && player.botMana >= 5){
            return 3
        } else{
            return 10
        }

    }

    function botCast(socket){
        const player = players.get(socket.id)
        if (!player) return

        player.botInvokerNum = botInvoker(socket)

        if(player.botInvokerNum == 1){
            player.botMana -= 4
            socket.emit("botTextSkill","Бот пытался заблокировать вам 1 из 4 стихий,но разраб ничего не сделал")
            // Придумать как заблокировать игроку одну из 4 стихий
        } else if(player.botInvokerNum == 2){
            player.botMana -= 5
            socket.emit("botTextSkill","Противник применил скилл: Увеличить урон!")
            return 2
        } else if(player.botInvokerNum == 3){
            player.botMana -= 5
            player.botHp += 1
            socket.emit("botTextSkill","Противник применил скилл: Хилл")
        } else{
            socket.emit("botTextSkill","Противник решил пропустить ход")
        }
    }

    function calcMana(socket){
        const player = players.get(socket.id)
        if (!player) return

        player.divManaHeight = (player.mana*10)
        socket.emit("calcMana",player.divManaHeight,player.mana)
        if (player.mana >= 10){
            player.mana = 10
        }
    }

    function roundMana(socket){
        const player = players.get(socket.id)
        if (!player) return

        if (player.mana < 10){
            player.mana+= 2
        }
        calcMana(socket)
    }

    function firstSkills(socket,skill){
        const player = players.get(socket.id)
        if (!player) return

        if (skill == "first" && player.mana >= 4){
            player.mana-= 4
            player.selectSkill = 1
            player.blockGroupBot = "group1"
        } else if (skill == "second" && player.mana >= 4){
            player.mana-= 4
            player.selectSkill = 2
            player.blockGroupBot = "group2"
        } else if (skill == "third" && player.mana >= 4){
            player.mana-= 4
            player.selectSkill = 3
            player.blockGroupBot = "group3"
        } else if (skill == "fourth" && player.mana >= 4){
            player.mana-= 4
            player.selectSkill = 4
            player.blockGroupBot = "group4"
        }
        calcMana(socket)
        textSkills(socket)
    }

    function allSkills(socket,skill){
        const player = players.get(socket.id)
        if (!player) return

        if (skill == "damage" && player.mana >= 3 && player.selectSkill == 0){ // damage uvel
            player.mana-= 3
            player.selectSkill = 5
        } else if(skill == "heal" && player.mana >= 5 && player.selectSkill == 0){ // pohill 
            player.mana-= 5
            player.selectSkill = 6
            player.hp += 1
        } else if(skill == "equalGesture" && player.mana >= 2 && player.selectSkill == 0){ // ravnie gestures otkl
            player.mana-= 2
            player.selectSkill = 7
        } else if(skill == "trap" && player.mana >= 4 && player.selectSkill == 0){ // trap
            player.mana-= 4
            player.selectSkill = 8
        } else if(skill == "invincible" && player.mana >= 8 && player.selectSkill == 0){ // neujazvimost
            player.mana -= 8
            player.selectSkill = 9
        } else if (player.selectSkill != 0) {
            socket.emit("selectSkillMsg")
        }
        calcMana(socket)
        textSkills(socket)
        calcHpAvatarServ(socket)
    }

    function fullRestart(socket){
        const player = players.get(socket.id)
        if (!player) return

        player.hp = 6
        player.botHp = 6
        player.selectSkill = 0
        player.roundCount = 1
        player.mana = 2
        player.botMana = 2
        player.timerRun = false
        player.avatarSet = null
    }

    function playAgain(socket) {
        const player = players.get(socket.id)
        if (!player) return

        socket.emit("gameFullRestart")
        fullRestart(socket)
        calcHpAvatarServ(socket)
        calcMana(socket)
        textSkills(socket)
    }

}