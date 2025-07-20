import React,{useEffect} from 'react';
import {useNavigate,useRoutes} from 'react-router-dom';

//Auth Context
import { useAuth } from './authContext.jsx';

//Pages List
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import CreateRepo from "./components/repo/CreateRepo.jsx";


const ProjectRoutes = () => {
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userIdfromStorage = localStorage.getItem('userId');
         if (userIdfromStorage && !currentUser) {   // if userId exists in localStorage and currentUser is not set then set it
            setCurrentUser(userIdfromStorage);
        }
        if (!userIdfromStorage && !["/auth","/signup"].includes(window.location.pathname)) {
            navigate("/auth");  //if userId does not exist in localStorage and current path is not auth or signup, redirect to auth page
        }

        if (userIdfromStorage && window.location.pathname === "/auth") {
            navigate("/");  //if userId exists in localStorage and current path is auth, redirect to home page
        }
    },[currentUser, setCurrentUser, navigate]); //this dependency array ensures the effect runs when currentUser changes
    let element = useRoutes([
        {
            path: "/",
            element: <Dashboard />
        },
        {
            path:"/auth",
            element: <Login />
        },
        {
            path:"/signup",
            element: <Signup />
        },
        {
            path:"/profile",
            element: <Profile />
        },
        {
            path:"/createrepo",
            element: <CreateRepo />
        }
    ]);
    return element;
}

export default ProjectRoutes;            
