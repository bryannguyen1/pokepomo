import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

function Navbar() {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    function handleClick() {
        logout()
    }

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>PokePomo</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <Link to="/battle">Battle</Link>
                            <Link to="/packs">Packs</Link>
                            <Link to="/collection">Collection</Link>
                            <Link to="/">Tasks</Link>&nbsp;&nbsp;
                            <span>{user.email}</span>
                            <button onClick={handleClick}>Log out</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;