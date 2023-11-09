import { useEffect, useState} from 'react'
import { useTasksContext } from "../hooks/useTasksContext"
import Stopwatch from '../components/Stopwatch'
import TodoList from '../components/TodoList'
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails'
import { useAuthContext } from '../hooks/useAuthContext';
// {
//     method: 'GET',
//     headers: {
//         "X-Api-Key": "ca4cdb23-055f-4b38-8e2a-968759a3f437"
//     }
// }
function Home() {
    const { tasks, dispatch } = useTasksContext()

    const [gacha, setGacha] = useState([]);
    const [card, setCard] = useState();
    const [cards, setCards] = useState([])
    const [credits, setCredits] = useState(100);

    //const [tasks, setTasks] = useState(null)

    const {user} = useAuthContext()

    useEffect(() => {
        // fetch(`${process.env.REACT_APP_BACKEND}https://api.pokemontcg.io/v2/cards/base1-4')
        // .then(response => response.json())
        // .then(data => setCard(data.data.images.small));
        async function fetchTasks() {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/tasks`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_TASKS', payload: json})
                // setTasks(blabla)
            }
        }

        if (user) {
            fetchTasks()
        }
        
        // need to move into new useEffect or add context
        //const types = ['Fairy', 'Darkness', 'Colorless'];
        let tempGacha = [];
        async function fetchCards() {
            // for (let i = 0; i < 3; i++) {
            //     //let pokeURL = 'https://api.pokemontcg.io/v2/cards?pageSize=1&q=types:' + types[i];
                
    
            //     await fetch(pokeURL)
            //     .then(response => response.json())
            //     .then(data => tempGacha.push(data.data[0]))
            // }
            let pokeURL = 'https://api.pokemontcg.io/v2/cards?q=set.name:"Diamond+%26+Pearl"'
            await fetch(pokeURL)
            .then(response => response.json())
            .then(data => setGacha(Object.values(data.data)))//tempGacha.push(data.data.slice(0, 1)))
            
            //setGacha(tempGacha)
        }
        
        fetchCards()
        
    }, [dispatch, user])
    
    function roll() {
        if (credits >= 10) {
            setCredits(prevCredits => prevCredits - 10)
            const randCard = gacha[Math.floor(Math.random()*gacha.length)]
            setCard(randCard)
            setCards(oldCards => [...oldCards, randCard])
        }
    }

    return (
        <div className="home">
            
            <div className="tasks">
                {tasks && tasks.map((task) => (
                    <TaskDetails key={task._id} task={task} />
                ))}
            </div>
            <TaskForm />
            <Stopwatch setCredits={setCredits} />
            <br />
            <TodoList setCredits={setCredits} />
            <br />
            {card && <img src={card.images.small} alt={card.name} />}
            <br />
            <h3>Credits: {credits}</h3>
            <br />
            <button onClick={roll}>
                Roll
            </button>
            <br />
            {cards.map((card, i) => {
                return (
                    <span key={card.id}>
                        <img src={card.images.small} alt={card.name} />
                    </span>
                )
            })}
        </div>
    )
}

export default Home;
