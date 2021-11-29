import { useState, useEffect } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem('session');
        const session = JSON.parse(tokenString);
        if(session == null){
            return null;
        }
        else if(session.time + 14400000 > Date.parse(new Date)){
            return session.token;
        }
        else{
            deleteToken();
            return null;
        }
    }

    const [token, setToken] = useState(getToken);

    const deleteToken = () => {
        sessionStorage.removeItem("session");
        setToken(null);
        console.log("Sessione eliminata");
        /* fetch delete */
    }

    const updateToken = useEffect(() => {
        setToken(getToken)
        //console.log("Update Token:", token);
    }, [token]);

    const saveToken = (userToken) => {
        var session = {};
        session.token = userToken;
        session.time = Date.parse(new Date);
        sessionStorage.setItem('session', JSON.stringify(session));
        setToken(userToken);
    };

    return [token, saveToken, deleteToken];
}