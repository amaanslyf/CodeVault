import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();  // Create a context for authentication to store user data and authentication status so that it can be shared between components

export const useAuth = () => {
    return useContext(AuthContext);  // Custom hook to access the AuthContext
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);  // State to hold the current user
    
    useEffect(() => {
        const userId = localStorage.getItem("userId");  // Retrieve user ID from local storage
        if (userId) {
            setCurrentUser(userId);  // If user ID exists, set the current user
        }
    }, []);  // Empty dependency array to run this effect only once on mount

    const value = {
        currentUser,  // Provide the current user in the context value
        setCurrentUser  // Provide a function to update the current user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;  // Return the provider with the context value
};