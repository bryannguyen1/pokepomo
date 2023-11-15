import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useCreditsContext } from "../hooks/useCreditsContext"
import { useBPContext } from '../hooks/useBPContext'

const socket = io(`${process.env.REACT_APP_BACKEND}`)
socket.on("connect", () => {
    console.log(`You connected with id: ${socket.id}`)
})
// socket.on("receive-card", card => {
//     console.log("RECEIVED CARD")
// })

function Battle() {
    const { user } = useAuthContext()
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

    const [opponentCards, setOpponentCards] = useState([])

    const winKeys = ['HP', 'Number', 'Pokedex']
    const cmp = ['lesser', 'greater']
    
    useEffect(() => {
        socket.emit('get-rooms', setRooms)
        socket.on('new-room', (r) => {
            setRooms(rooms => [...rooms, r])
        })
        socket.on('delete-room', (r) => {
            console.log("DELEEEE")
            setRooms(rooms.filter(item => item !== r))
        })
        socket.on('join-full', () => {
            setError('Room is full')
        })
        socket.on('full', (attr, compare) => {
            setKeyNum(attr)
            setCompareNum(compare)
            setRoomFull(true)
            //socket.emit('ready', room, cards)
        })
        socket.on('opponent-ready', (oppCards) => {
            setOpponentCards(oppCards)
        })
    }, [])

    useEffect(() => {   // game logic
        // if (cards.length > 0 && opponentCards.length > 0)
        console.log('compareNum', compareNum)
        if (cards.length > 0 && opponentCards.length > 0 && compareNum > -1) {
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
        if (youWin === 1) {
            addCredits(20)
        } else if (youWin === 0) {
            addCredits(-20)
        }
    }, [creditsDispatch, user.token, youWin])

    function handleSubmit(e) {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }
        socket.emit('join-room', room, bp, setCards)
        setWaiting(true)
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
                                <button onClick={() => socket.emit('join-room', r, bp, setCards)}>Join</button>
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
        </div>
    )
}

export default Battle;