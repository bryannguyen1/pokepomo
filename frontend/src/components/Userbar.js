import { useEffect, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import Stopwatch from '../components/Stopwatch'
import { useCreditsContext } from "../hooks/useCreditsContext"
import { useCollectionContext } from "../hooks/useCollectionContext"
import { useBPContext } from "../hooks/useBPContext"

function Userbar() {
    const [value, setValue] = useState('N/A')
    //const [card, setCard] = useState(null)

    const { credits, dispatch } = useCreditsContext()
    const { collection } = useCollectionContext()
    const { dispatch: bpdispatch } = useBPContext()

    const { user } = useAuthContext()

    useEffect(() => {
        async function fetchCredits() {
            const response = await fetch('/api/credits', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            
            if (response.ok) {
                //setCredits(json[0].credits)
                dispatch({type: 'SET_CREDITS', payload: json[0].credits})
            }
        }
        async function fetchBP() {
            const response = await fetch('/api/battlePokemon', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            
            if (response.ok) {
                setValue(json[0].card.name)
                //setCard(json[0])
                bpdispatch({type: 'SET_BP', payload: json[0]})
            }
        }
        fetchCredits()
        fetchBP()
    }, [dispatch, user, bpdispatch]) // was empty

    // useEffect(() => {
    //     async function 
    // }, [value])


    async function updateBP(ccard) {
        console.log('ccard.card', ccard.card)
        const response = await fetch('/api/battlepokemon', {
            method: 'PATCH',
            body: JSON.stringify({card: ccard.card}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
 
        const json = await response.json()
        
        if (response.ok) {
            console.log('jsonnn', json)
            //setCard(json)
            bpdispatch({type: 'SET_BP', payload: json})
        }
    }

    async function fetchCard(e) {
        const val = e.target.value
        //console.log('e1', e.target.value)
        const response = await fetch(`/api/cards/${e.target.value}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        //console.log('e2', e.target.value)
        const json = await response.json()

        if (response.ok) {
            setValue(val) // e.target.val changes after fetch
            updateBP(json)
        }
    }

    

    async function handleChange(e) {
        fetchCard(e) // updateBP called inside fetchCard
    }

    return (
        <div className="ubHeader">
            <div>
                <div>{user.email}</div>
                <div>Credits: {credits}</div>
            </div>
            <Stopwatch />
            <div>
                <h3>Selected pokemon: {value}</h3>
                <select value={value} onChange={handleChange}>
                    {collection.map((card, i) => {
                        return (
                            // <span key={card.card.id} className="cardInCollection">
                            //     <img src={card.card.images.small} alt={card.card.name} />
                            // </span>
                            <option key={card.card.id} value={card.card.name}>
                                {card.card.name}
                            </option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}

export default Userbar