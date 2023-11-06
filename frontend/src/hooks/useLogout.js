import { useAuthContext } from './useAuthContext'
import { useTasksContext } from './useTasksContext'
import { useCreditsContext } from './useCreditsContext'
import { useCollectionContext } from './useCollectionContext'

export function useLogout() {
    const { dispatch } = useAuthContext()
    const { dispatch: tasksDispatch } = useTasksContext()
    const { dispatch: creditsDispatch } = useCreditsContext()
    const { dispatch: collectionDispatch } = useCollectionContext()

    function logout() {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
        tasksDispatch({type: 'SET_TASKS', payload: null})
        creditsDispatch({type: 'SET_CREDITS', payload: 0})
        collectionDispatch({type: 'SET_COLLECTION', payload: []})
    }

    return { logout }
}