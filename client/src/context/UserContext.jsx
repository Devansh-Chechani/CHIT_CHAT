import React from "react";
import {createContext,useState,useEffect} from 'react'
import axios from 'axios'

 export const UserContext = createContext({})

 export const UserContextProvider = ({children})=>{
    const [username,setUsername] = useState(null)
    const [id,setId] = useState(null)

    useEffect(() => {
    axios.get('http://localhost:4000/api/auth/profile',{withCredentials:true}).then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);
    return(
      <UserContext.Provider value = {{username,setUsername,id,setId}}>{children}</UserContext.Provider>  
    )
 }

