import { React, useEffect, useState } from 'react';
/*import axios from 'axios';
import { API_BASE } from '../../config/config.js';*/
import { fetch } from '../../functions/useFetch.js';
/*import ReactDOM from 'react-dom';*/

function Dashboard(props) {
    const [recived, setRecived] = useState("");

    function ValidaSessione() {
        const send = { token: props.token };
        const fetchData = async () => {
            let data = await fetch("/sessionCheck", send);
            //console.log(data);
            if (data.status) {
                setRecived(data.mail + data.squadra + data.lega + data.stagione);
            }
            else {
                setRecived(data.msg);
            }
        }
        fetchData();
    }


    return (
        <div className="w3-container">
            <h1>Dashboard</h1>
            <h3>Richiesta back-end</h3>
            <p>{recived}</p>
            <button onClick={() => ValidaSessione() }>Valida Sessione</button>
            <button onClick={() => logOut()}>Log out</button>
        </div>
        );

}

function logOut() {
    console.log("Logut...");
    localStorage.removeItem('token');
    window.location.reload();
}


export default Dashboard;