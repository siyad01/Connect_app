import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserData } from './context/userContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import MyNetwork from './pages/MyNetwork';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import { Loading } from './components/Loading';
import Navbar from './components/Navbar';
import UserProfile from './pages/UserProfile';
import axios from 'axios';

function App() {
    const { loading, isAuth, setIsAuth, user, setUser } = UserData();
    const [authLoading, setAuthLoading] = useState(true); // State to manage auth loading

    useEffect(() => {
        const checkAuth = async () => {
            // Check if a token exists in localStorage
            const token = localStorage.getItem('authToken');

            if (token) {
                try {
                    // Optionally verify the token with the backend
                    const { data } = await axios.get('/api/auth/verify', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    setUser(data.user); // Set the authenticated user
                    setIsAuth(true); // Set auth status to true
                } catch (error) {
                    console.error('Token validation failed', error);
                    localStorage.removeItem('authToken'); // Remove invalid token
                    setIsAuth(false); // Set auth status to false
                }
            } else {
                setIsAuth(false); // No token means no authentication
            }
            setAuthLoading(false); // Stop showing the loading animation
        };

        checkAuth();
    }, [setIsAuth, setUser]);

    // Show loading screen until the auth status is known
    if (authLoading || loading) {
        return <Loading />;
    }

    return (
        <BrowserRouter>
            {/* Navbar is shown only when the user is authenticated */}
            {isAuth && <Navbar user={user} />}
            
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={isAuth ? <Navigate to="/feed" /> : <Login />} />
                <Route path="/register" element={isAuth ? <Navigate to="/feed" /> : <Register />} />

                {/* Protected Routes - Require Authentication */}
                <Route path="/feed" element={isAuth ? <Feed /> : <Navigate to="/login" />} />
                <Route path="/my-network" element={isAuth ? <MyNetwork user={user}/> : <Navigate to="/login" />} />
                <Route path="/messaging" element={isAuth ? <Messages /> : <Navigate to="/login" />} />

                <Route path="/messaging/:id" element={isAuth ? <Messages /> : <Navigate to="/login" />} />
                <Route path="/notifications" element={isAuth ? <Notifications /> : <Navigate to="/login" />} />
                <Route path="/account" element={isAuth ? <Profile user={user} /> : <Navigate to="/login" />} />
                <Route path="/user/:id" element={isAuth? <UserProfile user={user}/> : <Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
