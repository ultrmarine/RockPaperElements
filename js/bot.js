// Перенести логику бота сюда для удобства и делать всё дальше тут

function botChooseGesture(Group) {
    const gestures = Object.keys(gesture_wins)
    // тотальный ужас,короче фильтрует весь лист от 1 группы и бот пикает жесты без неё
    // gesture это мы обращаемся в html файл к аттрибуту дата-гестур
    const availGestures = gestures.filter(gesture => {
        const all_gesture = gesture_wins[gesture]
        const all_group = all_gesture[all_gesture.length - 1]
        return all_group != Group
    });
    const random = Math.floor(Math.random() * availGestures.length)
    return availGestures[random]
}

// сделать ему возможность выбирать способности