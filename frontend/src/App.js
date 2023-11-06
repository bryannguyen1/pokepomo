import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

// pages and components
import Home from './pages/Home'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar'
import Packs from './pages/Packs';
import Collection from './pages/Collection';
import Userbar from './components/Userbar';
import Battle from './pages/Battle';

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        { user && <Userbar /> }
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/battle"
              element={user ? <Battle /> : <Navigate to="/login" />}
            />
            <Route
              path="/packs"
              element={user ? <Packs /> : <Navigate to="/login" />}
            />
            <Route
              path="/collection"
              element={user ? <Collection /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
