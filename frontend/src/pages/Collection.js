import { useEffect } from 'react'
import { useCollectionContext } from '../hooks/useCollectionContext'

function Collection() {
    // cards are OBJECTS containing meta data
    // to get the actual card, use cards[i].card
    //const [cards, setCards] = useState([])
    
    // const {user} = useAuthContext()
    const { collection } = useCollectionContext()

    useEffect(() => {
        // async function fetchCards() {
        //     const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/cards', {
        //         headers: {
        //             'Authorization': `Bearer ${user.token}`
        //         }
        //     })
        //     const json = await response.json()

        //     if (response.ok) {
        //         // setCards(json)
        //         dispatch({type: 'SET_COLLECTION', payload: json})
        //     }
        // }
        // fetchCards()
    }, [])
    // TODO: DO SOMETHING ABOUT DUPES BC KEY
    return (
        <div>
            <div className="cardsContainer">
                {collection.map((card, i) => {
                    return (
                        <span key={card.card.id} className="cardInCollection">
                            <img src={card.card.images.small} alt={card.card.name} />
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

export default Collection