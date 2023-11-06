import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useCreditsContext } from "../hooks/useCreditsContext"
import { useBPContext } from '../hooks/useBPContext'

const socket = io('http://localhost:4000')
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
    const [error, setError] = useState(null)
    const [cards, setCards] = useState([])
    const [roomFull, setRoomFull] = useState(false)
    const [ready, setReady] = useState(false)
    const [youWin, setYouWin] = useState(null)
    const [keyNum, setKeyNum] = useState(-1)

    const [opponentCards, setOpponentCards] = useState([])

    const winKeys = ['HP', 'Number', 'Pokedex']
    
    useEffect(() => {
        socket.emit("custom-event", 10, 'hi')
        //console.log('collection: ', collection)
        socket.on("receive-card", card => {
            console.log("RECEIVED CARD")
            //setCards(cards => [...cards, card])
            setCards([card])
        })
        socket.on('join-full', () => {
            setError('Room is full')
        })
        socket.on('full', (num) => {
            console.log('NUM IS ', num)
            setKeyNum(num)
            setRoomFull(true)
            //socket.emit('ready', room, cards)
        })
        socket.on('opponent-ready', (oppCards) => {
            console.log('WE GOT AN OPPONENT')
            setOpponentCards(oppCards)
        })
    }, [])

    useEffect(() => {   // game logic
        // if (cards.length > 0 && opponentCards.length > 0)
        
        switch(keyNum) {
            case 0:
                if (Number(cards[0].card.hp) > Number(opponentCards[0].card.hp)) {
                    setYouWin(true)
                } else {
                    setYouWin(false)
                }
                break
            case 1:
                if (Number(cards[0].card.number) > Number(opponentCards[0].card.number)) {
                    setYouWin(true)
                } else {
                    setYouWin(false)
                }
                break
            case 2:
                if (Number(cards[0].card.nationalPokedexNumbers[0]) > Number(opponentCards[0].card.nationalPokedexNumbers[0])) {
                    setYouWin(true)
                } else {
                    setYouWin(false)
                }
                break
            default:
                break
        }
    }, [cards, keyNum, opponentCards])

    useEffect(() => {
        async function addCredits(num) {
            const response = await fetch('/api/credits', {
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
        if (youWin === true) {
            addCredits(20)
        } else if (youWin === false) {
            addCredits(-20)
        }
    }, [creditsDispatch, user.token, youWin])

    function handleSubmit(e) {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }
        console.log("b4 join")
        socket.emit('join-room', room, bp, setCards)
    }

    function onClickReady() {
        setReady(true)
        socket.emit('ready', room, cards)
    }

    return (
        <div>
            { !roomFull &&
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
            }
            
            { !ready && roomFull && 
                <div>
                    <button onClick={onClickReady}>Ready</button>
                </div>
            }

            { roomFull && 
                <div className="battle">
                    <div>
                        {cards.map((card, i) => {
                            console.log(card)
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

                    { youWin && opponentCards.length > 0 &&
                        <h2>
                            WWW based on greater {winKeys[keyNum]}
                        </h2>
                    }

                    { !youWin && opponentCards.length > 0 &&
                        <h2>
                            LLL based on greater {winKeys[keyNum]}
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