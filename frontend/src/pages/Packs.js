import { useEffect, useState } from 'react'
import singleCardPack from '../images/singleCardPack.png'
import { useAuthContext } from '../hooks/useAuthContext'
import { useCreditsContext } from '../hooks/useCreditsContext'
import { useCollectionContext } from '../hooks/useCollectionContext'

function Packs() {
    const [openSingle, setOpenSingle] = useState(false)
    const [cards, setCards] = useState([])
    const [gacha, setGacha] = useState([])
    const [gachaLoaded, setGachaLoaded] = useState(false)
    const [rarity, setRarity] = useState('F')

    const { user } = useAuthContext()
    const { credits, dispatch } = useCreditsContext()
    const { collection, dispatch: collectionDispatch } = useCollectionContext()

    useEffect(() => {
        async function fetchCards() {
            //let pokeURL = 'https://api.pokemontcg.io/v2/cards?q=set.name:%22Diamond+%26+Pearl%22+supertype:%22Pokemon%22+name:%22Dialga%22'
            let pokeURL = 'https://api.pokemontcg.io/v2/cards?q=set.name:"Diamond+%26+Pearl"+supertype:"Pokemon"'
            //let pokeURL = 'https://api.pokemontcg.io/v2/cards?q=set.name:"Mcdonald%27s+Collection"'
            await fetch(pokeURL)
            .then(response => response.json())
            .then(data => setGacha(Object.values(data.data)))
            setGachaLoaded(true)
        }
        fetchCards()
    }, [])

    // add card to DB, used in handleClick functions
    async function addCard(card) {
        console.log("card", card)
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/cards`, {
            method: 'POST',
            body: JSON.stringify({card}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })
        const json = await response.json()
        
        if (response.ok) {
            setRarity(json.origRarity)
            if (json.copyS) {
                addCredits(100)
                return
            }
            if (json.card.rarity === json.origRarity) {
                collectionDispatch({type: 'SET_COLLECTION', payload: [...collection, json.card]})
            } else {
                collectionDispatch({type: 'SET_COLLECTION', payload: [...collection.filter(c => !(c._id in json.copyIDs)), json.card]})
            }
        }
    }

    // add credits to DB, used in handleClick functions
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
            
            dispatch({type: 'SET_CREDITS', payload: json.credits})
        }
    }

    // initial open
    function handleClickSingleOne() {
        if (credits < 10) {
            return
        }
        const randCard = gacha[Math.floor(Math.random()*gacha.length)]
        setCards([randCard])
        addCard(randCard)
        setOpenSingle(true)
        addCredits(-10)
    }

    // opens after initial open
    function handleClickSingleTwo() {
        if (credits < 10) {
            return
        }
        const randCard = gacha[Math.floor(Math.random()*gacha.length)]
        setCards([randCard])
        addCard(randCard)
        addCredits(-10)
    }

    return (
        <div className="packsContainer">
            {!openSingle && (
                <div>
                    <div className="packsImageContainer">
                        <img className="singleCardPack" src={singleCardPack} alt='singleCardPack' />
                    </div>
                    <div className="buttonContainer">
                        <button disabled={!gachaLoaded} onClick={handleClickSingleOne}>Open</button>
                    </div>
                </div>
            )}
            {openSingle && (
                <div>
                    {cards.map((card, i) => {
                        return (
                            <span key={card.id}>
                                <h3>{rarity}</h3>
                                <div><img src={card.images.small} alt={card.name} /></div>
                            </span>
                        )
                    })}
                    <div className="buttonContainer">
                        <button disabled={!gachaLoaded} onClick={handleClickSingleTwo}>Open</button>
                        <button onClick={() => setOpenSingle(false)}>Done</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Packs