import { io } from 'socket.io-client'
import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useCreditsContext } from "../hooks/useCreditsContext"
import { useBPContext } from '../hooks/useBPContext'
import { useCollectionContext } from '../hooks/useCollectionContext'

// const socket = io(`${process.env.REACT_APP_BACKEND}`)
// socket.on("connect", () => {
//     console.log(`You connected with id: ${socket.id}`)
// })
// socket.on("receive-card", card => {
//     console.log("RECEIVED CARD")
// })

function Battle() {
    const { user } = useAuthContext()
    const { collection, dispatch: collectionDispatch } = useCollectionContext()
    const { dispatch: creditsDispatch } = useCreditsContext()
    const { bp } = useBPContext()
    
    const [room, setRoom] = useState('')
    const [rooms, setRooms] = useState([])
    const [error, setError] = useState(null)
    const [cards, setCards] = useState([])
    const [roomFull, setRoomFull] = useState(false)
    const [youWin, setYouWin] = useState(-1)
    const [keyNum, setKeyNum] = useState(-1)
    const [compareNum, setCompareNum] = useState(-1)
    const [waiting, setWaiting] = useState(false)
    const [rematchWaiting, setRematchWaiting] = useState(false)
    const [rematchPending, setRematchPending] = useState(false)
    const [matchRefresh, setMatchRefresh] = useState(false)

    const [opponentCards, setOpponentCards] = useState([])

    const [socket, setSocket] = useState(-1)

    const keyNumRef = useRef()
    const compareNumRef = useRef()
    const youWinRef = useRef()
    const collectionRef = useRef()
    keyNumRef.current = keyNum
    compareNumRef.current = compareNum
    youWinRef.current = youWin
    collectionRef.current = collection

    const winKeys = ['HP', 'Number', 'Pokedex']
    const cmp = ['lesser', 'greater']
    
    useEffect(() => {
        setSocket(io(`${process.env.REACT_APP_BACKEND}`))
    }, [])

    useEffect(() => {
        console.log('SOCKET HAS CHANGED')
        if (socket !== -1) {
            console.log('SOCKET WE IN')
            socket.on("connect", () => {
                console.log(`You connected with id: ${socket.id}`)
            })
            socket.emit('get-rooms', setRooms)
            socket.on('new-room', (r) => {
                setRooms(rooms => [...rooms, r])
            })
            socket.on('delete-room', (r) => {
                setRooms(rooms => rooms.filter(item => item !== r))
            })
            socket.on('join-full', () => {
                setError('Room is full')
            })
            socket.on('full', (attr, compare) => {
                if (keyNumRef.current === attr && compareNumRef.current === compare) {
                    setMatchRefresh(matchRefresh => !matchRefresh)
                }
                setKeyNum(attr)
                setCompareNum(compare)
                setRoomFull(true)
                setRematchWaiting(false)
                //socket.emit('ready', room, cards)
            })
            socket.on('opponent-ready', (oppCards) => {
                setOpponentCards(oppCards)
            })
            socket.on('rematch-req', () => {
                setRematchPending(true)
            })
            return function cleanup() {
                console.log('socket disconnected')
                socket.disconnect()
            }
        }
    }, [socket])

    useEffect(() => {   // game logic
        // if (cards.length > 0 && opponentCards.length > 0)
        if (cards.length > 0 && opponentCards.length > 0 && compareNum > -1) {
            console.log('we comparin', compareNum)
            switch(keyNum) {
                case 0:
                    if (Number(cards[0].card.hp) === Number(opponentCards[0].card.hp)) {
                        setYouWin(2)
                    } else {
                        if (compareNum === 0) {
                            if (Number(cards[0].card.hp) > Number(opponentCards[0].card.hp)) {
                                setYouWin(0)
                            } else {
                                setYouWin(1)
                            }
                        } else {
                            if (Number(cards[0].card.hp) > Number(opponentCards[0].card.hp)) {
                                setYouWin(1)
                            } else {
                                setYouWin(0)
                            }
                        }
                    }
                    setMatchRefresh(matchRefresh => !matchRefresh)
                    break
                case 1:
                    if (Number(cards[0].card.number) === Number(opponentCards[0].card.number)) {
                        setYouWin(2)
                    } else {
                        if (compareNum === 0) {
                            if (Number(cards[0].card.number) > Number(opponentCards[0].card.number)) {
                                setYouWin(0)
                            } else {
                                setYouWin(1)
                            }
                        } else {
                            if (Number(cards[0].card.number) > Number(opponentCards[0].card.number)) {
                                setYouWin(1)
                            } else {
                                setYouWin(0)
                            }
                        }
                    }
                    setMatchRefresh(matchRefresh => !matchRefresh)
                    break
                case 2:
                    if (Number(cards[0].card.nationalPokedexNumbers[0]) === Number(opponentCards[0].card.nationalPokedexNumbers[0])) {
                        setYouWin(2)
                    } else {
                        if (compareNum === 0) {
                            if (Number(cards[0].card.nationalPokedexNumbers[0]) > Number(opponentCards[0].card.nationalPokedexNumbers[0])) {
                                setYouWin(0)
                            } else {
                                setYouWin(1)
                            }
                        } else {
                            if (Number(cards[0].card.nationalPokedexNumbers[0]) > Number(opponentCards[0].card.nationalPokedexNumbers[0])) {
                                setYouWin(1)
                            } else {
                                setYouWin(0)
                            }
                        }
                    }
                    setMatchRefresh(matchRefresh => !matchRefresh)
                    break
                default:
                    break
            }
        }
    }, [cards, keyNum, compareNum, opponentCards])

    useEffect(() => {
        async function addCredits(num) {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/credits`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({addCredits: num})
            })
            const json = await response.json()
            
            if (response.ok) {
                //setCredits(json.credits)
                
                creditsDispatch({type: 'SET_CREDITS', payload: json.credits})
            }
        }
        async function addExp(num) {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/cards/exp`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({cardID: bp.card_id, exp: num})
            })
            const json = await response.json()
            if (response.ok) {
                const updatedCollection = collectionRef.current.map((c) => {
                    if (c._id === bp.card_id) {
                        c.exp = json.exp
                        c.level = json.level
                    }
                    return c
                })
                collectionDispatch({type: 'SET_COLLECTION', payload: updatedCollection})
            }
        }
        if (youWinRef.current === 1) {
            addCredits(10)
            addExp(10)
        }
        // else if (youWinRef.current === 0) {
        //     addCredits(-20)
        // }
    }, [creditsDispatch, user.token, matchRefresh, bp, collectionDispatch]) // bp unwanted?

    function handleSubmit(e) {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }
        socket.emit('join-room', room, bp, setCards)
        setWaiting(true)
    }

    function handleLeave() {
        socket.emit('leave-room')
        setWaiting(false)
        setRoomFull(false)
    }

    function handleRematch() {
        if (rematchPending) {
            socket.emit('rematch')
            setRematchPending(false)
        } else {
            socket.emit('rematch-req')
            setRematchWaiting(true)
        } 
    }

    return (
        <div>
            { !waiting && !roomFull &&
                <div>
                    <form className="create" onSubmit={handleSubmit}>
                        <h3>Create a New Room</h3>

                        <label>Room:</label>
                        <input
                            type="text"
                            onChange={(e) => setRoom(e.target.value)}
                            value={room}
                        />

                        <button>Join Room</button>
                        {error && <div className="error">{error}</div>}
                        <br /> <br />
                        {/* {inRoom && <img src={collection[0].card.images.small} alt={collection[0].card.name} />} */}
                        {/* { inRoom &&
                            <div>
                                {cards.map((card, i) => {
                                    return (
                                        <span key={card.card.id} className="cardInCollection">
                                            <img src={card.card.images.small} alt={card.card.name} />
                                        </span>
                                    )
                                })}
                            </div>
                        } */}
                        
                        
                    </form>
                    {rooms.map((r) => {
                        return (
                            <div key={r}>
                                <span>{r}</span>
                                <button onClick={() => {
                                    socket.emit('join-room', r, bp, setCards)
                                    setRoom(r)
                                }}>
                                    Join
                                </button>
                            </div>
                        )
                    })}
                </div>
            }
            
            { waiting && !roomFull &&
                <div>
                    <h3>Waiting</h3>    
                </div>
            }

            { roomFull && 
                <div className="battle">
                    <div>
                        {cards.map((card, i) => {
                            return (
                                <span key={card.card.id} className="cardInCollection">
                                    <img src={card.card.images.small} alt={card.card.name} />
                                    <h3>HP: {card.card.hp}</h3>
                                    <h3>Number: {card.card.number}</h3>
                                    <h3>Pokedex Number: {card.card.nationalPokedexNumbers[0]}</h3>
                                </span>
                            )
                        })}
                    </div>

                    { cards.length > 0 && opponentCards.length > 0 && compareNum > -1 && youWin > -1 &&
                        <h2>
                            {(youWin === 1 ? 'Win' : youWin === 0 ? 'Loss' : 'Tie')} based on {cmp[compareNum]} {winKeys[keyNum]}
                        </h2>
                    }

                    <div>
                        {opponentCards.map((card, i) => {
                            return (
                                <span key={card.card.id} className="cardInCollection">
                                    <img src={card.card.images.small} alt={card.card.name} />
                                    <h3>HP: {card.card.hp}</h3>
                                    <h3>Number: {card.card.number}</h3>
                                    <h3>Pokedex Number: {card.card.nationalPokedexNumbers[0]}</h3>
                                </span>
                            )
                        })}
                    </div>
                </div>
            }

            { rematchWaiting &&
                <p>Waiting for opponent to respond...</p>
            }

            { rematchPending &&
                <p>Opponent waiting for rematch...</p>
            }

            { (waiting || roomFull) &&
                <button onClick={handleLeave}>Leave</button>
            }

            { roomFull &&
                <button onClick={handleRematch}>Rematch</button>
            }
        </div>
    )
}

export default Battle;