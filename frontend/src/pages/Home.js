import { useEffect } from 'react'
import { useTasksContext } from "../hooks/useTasksContext"
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails'
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollectionContext } from '../hooks/useCollectionContext'
// {
//     method: 'GET',
//     headers: {
//         "X-Api-Key": "ca4cdb23-055f-4b38-8e2a-968759a3f437"
//     }
// }
function Home() {
    const { tasks, dispatch } = useTasksContext()
    const { dispatch: collectionDispatch } = useCollectionContext()

    const {user} = useAuthContext()

    useEffect(() => {
        // fetch('https://api.pokemontcg.io/v2/cards/base1-4')
        // .then(response => response.json())
        // .then(data => setCard(data.data.images.small));
        async function fetchTasks() {
            const response = await fetch('/api/tasks', {
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
        async function fetchCards() {
            const response = await fetch('/api/cards', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                // setCards(json)
                console.log('collection', json)
                collectionDispatch({type: 'SET_COLLECTION', payload: json})
            }
        }
        fetchCards()
        fetchTasks()

        
    }, [collectionDispatch, dispatch, user])

    return (
        <div className="home">
            <div className="tasks">
                {tasks && tasks.map((task) => (
                    <TaskDetails key={task._id} task={task} />
                ))}
            </div>
            <TaskForm />
        </div>
    )
}

export default Home;
