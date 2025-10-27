// Перенести логику бота сюда для удобства и делать всё дальше тут

function botChooseGesture(Group) {
    const gestures = Object.keys(gesture_wins)
    // тотальный ужас,короче фильтрует весь лист от 1 группы и бот пикает жесты без неё

    // gesture это прост название анонимной функции
    const availGestures = gestures.filter(gesture => {
        const all_gesture = gesture_wins[gesture] // а здесь мы обозначаем,что сейчас нужно обрабатывать фильтру,ну то есть перебераем список
        const all_group = all_gesture[all_gesture.length - 1] // здесь уже из всех жестов мы достаём их последнее значение а.к.а группу
        return all_group != Group // a zdes sravnivaem s ненужной группой и возращаем только то,что не совпадает с ней
    });
    const random = Math.floor(Math.random() * availGestures.length)
    return availGestures[random]
}

// сделать ему возможность выбирать способности