// Перенести логику бота сюда для удобства и делать всё дальше тут

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
// сделать ему возможность выбирать способности
let botManaCount = 2

const testManaTEXT = document.getElementById("test-mana-bot") // UDALIT POTOM
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

const textBotSkill = document.getElementById("text-bot-skill")

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