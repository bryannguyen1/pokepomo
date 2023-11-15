require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const taskRoutes = require('./routes/tasks')
const userRoutes = require('./routes/user')
const cardRoutes = require('./routes/cards')
const creditRoutes = require('./routes/credits')
const battlePokemonRoutes = require('./routes/battlePokemon')
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

// express app
const app = express()

// middleware
app.use(express.json())

app.use(cors(corsOptions))

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
        let playersOne = {}
        let playersTwo = {}
        let socketToRoom = {}
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
            socket.on('join-room', (room, bp, setCards) => {
                const getRoom = io.sockets.adapter.rooms.get(room)
                if (getRoom === undefined) { // no one has joined yet
                    socket.join(room)
                    playersOne[room] = {socket, bp}
                    socketToRoom[socket.id] = room
                    //socket.to(room).emit("receive-card", collection[0])
                    io.sockets.emit('new-room', room)
                    setCards([bp])
                } else if (getRoom.size === 1) { // one person is already in the room
                    socket.join(room)
                    //socket.to(room).emit("receive-card", collection[0])
                    //setCards(cards => [...cards, collection[0]])
                    socketToRoom[socket.id] = room
                    playersTwo[room] = {socket, bp}
                    setCards([bp])
                    let attr = Math.floor(Math.random() * 3) // [0, 3) = 3 attributes
                    let compare = Math.floor(Math.random() * 2) // [0, 2) = 2 attributes
                    io.sockets.in(room).emit('full', attr, compare) // two players joined
                    socket.to(room).emit('opponent-ready', [bp])
                    playersOne[room].socket.to(room).emit('opponent-ready', [playersOne[room].bp])
                } else {
                    socket.emit('join-full')
                }
            })
            socket.on('ready', (room, cards) => {
                console.log('OPP RDYYYY', socket.id)
                socket.to(room).emit('opponent-ready', cards)
                //io.sockets.in(room).emit('opponent-ready', cards)
            })
            socket.on('get-rooms', (setRooms) => {
                const rooms = []
                for (const [key, value] of Object.entries(playersOne)) {
                    rooms.push(key)
                }
                setRooms(rooms)
            })
            socket.on('disconnect', () =>{
                const r = socketToRoom[socket.id]
                const getRoom = io.sockets.adapter.rooms.get(r)
                if (r !== undefined) {
                    if (getRoom === undefined) { // player was alone
                        console.log('DELEEEEE')
                        io.sockets.emit('delete-room', r)
                        delete(playersOne[r])
                    } else { // player left from full room
                        if (playersOne[r].socket === socket) {
                            console.log('brrubrrub')
                            playersOne[r] = {socket: playersTwo[r].socket, bp: playersTwo[r].bp}
                        }
                        //delete playersTwo[r]
                        delete socketToRoom[socket]
                    }
                }
            });
        })
    })
    .catch((error) => {
        console.log(error)
    })

process.env 