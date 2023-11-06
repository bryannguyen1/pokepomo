require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const taskRoutes = require('./routes/tasks')
const userRoutes = require('./routes/user')
const cardRoutes = require('./routes/cards')
const creditRoutes = require('./routes/credits')
const battlePokemonRoutes = require('./routes/battlePokemon')


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/tasks', taskRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/credits', creditRoutes)
app.use('/api/battlepokemon', battlePokemonRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        // app.listen(process.env.PORT, () => {
        //     console.log('connected to db & listening on port', process.env.PORT)
        // })
        let currentConnections = {}
        const server = app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
        const io = require('socket.io')(server, {
            cors: {
                origin: "*"
            }
        })
        io.on('connection', socket => {
            console.log(socket.id)
            socket.on("custom-event", (number, string) => {
                console.log(number, string)
            })
            socket.on('join-room', (room, bp, setCards) => {
                const getRoom = io.sockets.adapter.rooms.get(room)
                if (getRoom === undefined) { // no one has joined yet
                    socket.join(room)
                    currentConnections[room] = {socket, bp}
                    //socket.to(room).emit("receive-card", collection[0])
                    setCards([bp])
                } else if (getRoom.size == 1) { // one person is already in the room
                    socket.join(room)
                    //socket.to(room).emit("receive-card", collection[0])
                    //setCards(cards => [...cards, collection[0]])
                    setCards([bp])
                    let num = Math.floor(Math.random() * 3) // [0, 3) = 3 attributes
                    io.sockets.in(room).emit('full', num) // two players joined
                    socket.to(room).emit('opponent-ready', [bp])
                    currentConnections[room].socket.to(room).emit('opponent-ready', [currentConnections[room].bp])
                } else {
                    socket.emit('join-full')
                }
            })
            socket.on('ready', (room, cards) => {
                console.log('OPP RDYYYY', socket.id)
                socket.to(room).emit('opponent-ready', cards)
                //io.sockets.in(room).emit('opponent-ready', cards)
            })
            // socket.on('disconnect', function() {
            //     delete currentConnections[client.id];
            // });
        })
    })
    .catch((error) => {
        console.log(error)
    })

process.env 