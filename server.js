// server.js
const express = require("express")
const { createServer } = require("http")
const socketIO = require("socket.io")

const app = express()
const server = createServer(app)
const ws = socketIO(server)

app.use(express.static("all_project"))


require("./different_modes/gamebot")(ws)
require("./different_modes/gamepvp")(ws)

const PORT = 3000
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Сервер запущен на http://0.0.0.0:${PORT}`)
})