import { useState } from 'react';

export default function useToken() {
    const [token, setToken] = useState();

    const deleteToken = () => {
        sessionStorage.removeItem("session");
        setToken(null);
        /* fetch delete */
    }

    const getToken = useEffect(() => {
        const tokenString = sessionStorage.getItem('session');
        const session = JSON.parse(tokenString);
        if(session == null){
            setToken(null);
        }
        else if(session.time + 14400000 > Date.parse(new Date)){
            setToken(session.token);
        }
        else{
            deleteToken();
        }
    }, )

    const saveToken = (userToken) => {
        var session = {};
        session[token] = userToken;
        session[time] = Date.parse(new Date);
        sessionStorage.setItem('session', JSON.stringify(session));
        setToken(userToken);
    };

    return {
        token,
        setToken: saveToken,
        deleteToken: deleteToken
    }
}