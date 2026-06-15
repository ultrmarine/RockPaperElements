(function () {
    const translations = {
        ru: {
            start: "Старт",
            closeBtn: "Назад",
            playBtn: "Играть",
            multiplayer: "Мультиплеер",
            defaultUser: "Игрок",
            skeletonOp: "Скелет",
            wizardOp: "Маг",
            elementalOp: "Элементаль",
            timer: "ВРЕМЯ: {time} сек",
            timerNext: "ВРЕМЯ: {time} сек",
            botHp: "ХП БОТА {hp}",
            choiceEmpty: "Ваш выбор: >>>",
            choice: "Ваш выбор: {gesture}",
            roundEnd: "Конец {round} раунда",
            enemyMove: "Противник сыграл: {gesture}",
            noSkills: "Умение не применено",
            skillBlockGroup: "На следующий раунд заблокирована {group} группа жестов",
            skillDamage: "На этот раунд ваш урон и входящий по вам урон увеличен на 1",
            skillHeal: "Вы восстановили 1 хп!",
            skillEqualGesture: "Вы отключили равные жесты противнику",
            skillTrap: "Вы поставили ловушку на жест {gesture}",
            skillInvincible: "У вас полная неуязвимость :)",
            "roundStatus.draw": "У вас ничья",
            "roundStatus.equalDamage": "Сыграны равные по силе жесты, вы оба теряете hp",
            "roundStatus.win": "Ты выиграл",
            "roundStatus.equalDisabledWin": "Равный жест не сработал. Ты выиграл",
            "roundStatus.lose": "Ты проиграл",
            "botSkill.damage": "Противник применил скилл: увеличить урон!",
            "botSkill.heal": "Противник применил скилл: лечение",
            "botSkill.skip": "Противник решил пропустить ход",
            "botSkill.red": "Вам заблокировали красную стихию",
            "botSkill.green": "Вам заблокировали зелёную стихию",
            "botSkill.blue": "Вам заблокировали синию стихию",
            "botSkill.yellow": "Вам заблокировали жёлтую стихию",
            chooseGestureAlert: "Для подтверждения нужно выбрать жест",
            selectSkillAlert: "Недостаточно маны или уже применён другой скилл!",
            botTrapAlert: "Бот попал в ловушку",
            trapConfirm: "Вы точно хотите поставить ловушку на {gesture}?",
            loseGame: "Ты проиграл",
            winGame: "Ты выиграл!!!",
            "gesture.rock": "Камень",
            "gesture.fire": "Огонь",
            "gesture.scissors": "Ножницы",
            "gesture.snake": "Змея",
            "gesture.person": "Человек",
            "gesture.tree": "Оливер Дерево",
            "gesture.wolf": "Волк",
            "gesture.sponge": "Губка",
            "gesture.paper": "Бумага",
            "gesture.air": "Воздух",
            "gesture.water": "Вода",
            "gesture.boom": "Взрыв",
            "gesture.dragon": "Дракон",
            "gesture.devil": "Дьявол",
            "gesture.lightning": "Молния",
            "gesture.pistol": "Пистолет",

        },
        et: {
            start: "Start",
            closeBtn: "Tagasi",
            playBtn: "Mängida",
            multiplayer: "Multiplayer",
            defaultUser: "Mängija",
            skeletonOp: "Skelett",
            wizardOp: "Maag",
            elementalOp: "Elementaal",
            timer: "AEG: {time} sek",
            timerNext: "AEG: {time} sek",
            botHp: "BOTI ELUD {hp}",
            choiceEmpty: "Sinu valik: >>>",
            choice: "Sinu valik: {gesture}",
            roundEnd: "{round}. vooru lõpp",
            enemyMove: "Vastane mängis: {gesture}",
            noSkills: "Oskusi pole kasutatud",
            skillBlockGroup: "Järgmiseks vooruks on blokeeritud {group}. žestirühm",
            skillDamage: "Selles voorus on sinu kahju ja sulle tehtav kahju 1 võrra suurem",
            skillHeal: "Taastasid 1 elu!",
            skillEqualGesture: "Lülitasid vastase võrdsed žestid välja",
            skillTrap: "Panid lõksu žestile {gesture}",
            skillInvincible: "Sul on täielik haavamatus :)",
            "roundStatus.draw": "Viik",
            "roundStatus.equalDamage": "Mängiti võrdse tugevusega žestid, mõlemad kaotate elu",
            "roundStatus.win": "Sa võitsid",
            "roundStatus.equalDisabledWin": "Võrdne žest ei toiminud. Sa võitsid",
            "roundStatus.lose": "Sa kaotasid",
            "botSkill.damage": "Vastane kasutas oskust: suurem kahju!",
            "botSkill.heal": "Vastane kasutas oskust: ravi",
            "botSkill.skip": "Vastane jättis käigu vahele",
            "botSkill.red": "Teie punane element on blokeeritud",
            "botSkill.green": "Teie roheline element on blokeeritud",
            "botSkill.blue": "Teie sinine element on blokeeritud",
            "botSkill.yellow": "Teie kollane element on blokeeritud",
            chooseGestureAlert: "Kinnitamiseks pead valima žesti",
            selectSkillAlert: "Mana ei piisa või teine oskus on juba kasutatud!",
            botTrapAlert: "Bot sattus lõksu",
            trapConfirm: "Kas soovid kindlasti panna lõksu žestile {gesture}?",
            loseGame: "Sa kaotasid",
            winGame: "Sa võitsid!!!",
            "gesture.rock": "Kivi",
            "gesture.fire": "Tuli",
            "gesture.scissors": "Käärid",
            "gesture.snake": "Madu",
            "gesture.person": "Inimene",
            "gesture.tree": "Puu",
            "gesture.wolf": "Hunt",
            "gesture.sponge": "Käsn",
            "gesture.paper": "Paber",
            "gesture.air": "Õhk",
            "gesture.water": "Vesi",
            "gesture.boom": "Plahvatus",
            "gesture.dragon": "Draakon",
            "gesture.devil": "Kurat",
            "gesture.lightning": "Välk",
            "gesture.pistol": "Püstol"
        }
    }

    function getLanguage() {
        const savedLanguage = localStorage.getItem("lang")
        const pageLanguage = document.documentElement.lang

        return translations[savedLanguage] ? savedLanguage : pageLanguage || "et"
    }

    window.currentLang = getLanguage()

    window.setLanguage = function (lang) {
        if (!translations[lang]) return

        window.currentLang = lang
        localStorage.setItem("lang", lang)
        document.documentElement.lang = lang
    }

    window.t = function (key, params = {}) {
        let text = translations[window.currentLang]?.[key] || translations.ru[key] || key

        Object.entries(params).forEach(([name, value]) => {
            text = text.replaceAll(`{${name}}`, value)
        })

        return text
    }

    window.gestureName = function (gesture) {
        return window.t(`gesture.${gesture}`)
    }

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n
        const text = translations[currentLang][key]

        if (!text) return

        if (el.querySelector("img")) {z
            el.title = text
            el.setAttribute("aria-label", text)
        } else {
            el.textContent = text
        } 
    })
})()
