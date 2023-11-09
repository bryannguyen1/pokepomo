import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthContext } from '../hooks/useAuthContext'
import { useTasksContext } from '../hooks/useTasksContext'
import { useCreditsContext } from '../hooks/useCreditsContext';

function TaskDetails({ task }) {
    const { user } = useAuthContext()
    const { dispatch } = useTasksContext()
    const { dispatch: creditsDispatch } = useCreditsContext()

    async function handleClick() {
        if (!user) {
            return
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/tasks/` + task._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_TASK', payload: json})
            // setTasks(tasks => tasks.filter((t) => t._id !== json._id))
        }
    }

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

    async function handleDone() {
        if (!user) {
            return
        }
        handleClick()
        addCredits(10)
    }

    return (
        <div className="task-details">
            <h4>{task.title}</h4>
            <p>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</p>
            <span onClick={handleClick}>delete</span>
            <button style={{marginLeft: '95%'}} onClick={handleDone}>Done</button>
        </div>
    )
}

export default TaskDetails