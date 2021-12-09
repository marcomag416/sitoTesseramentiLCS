import { useState, useEffect } from 'react';
import { fetch } from './useFetch';

export default function useToken() {   
    const initToken = () =>{
        const tokenString = localStorage.getItem('session');
        const session = JSON.parse(tokenString);
        if(session == null){
            return null;
        }
        else if(session.time + 14400000 > Date.parse(new Date())){
            return session.token;
        }
        else{
            console.log("Sessione scaduta");
            const send = {token : session.token};
            fetch("/deleteSession", send);
            return null;
        }
    }
    
    const [token, setToken] = useState(initToken());

    const deleteToken = (storageToken) => {
        localStorage.removeItem("session");
        let send = {};
        if(storageToken != null && storageToken != undefined){
            send = {token : storageToken};
        }
        else{
            send = {token : token};
        }
        setToken(null);
        fetch("/deleteSession", send);
        console.log("Sessione eliminata");
    }

    const getToken = () => {
        const tokenString = localStorage.getItem('session');
        const session = JSON.parse(tokenString);
        if(session == null){
            return null;
        }
        else if(session.time + 14400000 > Date.parse(new Date())){
            return session.token;
        }
        else{
            console.log("Sessione scaduta");
            deleteToken(session.token);
            return null;
        }
    }

    useEffect(() => {
        setToken(getToken)
        //console.log("Session update:", token);
    });

    const saveToken = (userToken) => {
        var session = {};
        session.token = userToken;
        session.time = Date.parse(new Date());
        localStorage.setItem('session', JSON.stringify(session));
        setToken(userToken);
    };

    return [token, saveToken, deleteToken];
}