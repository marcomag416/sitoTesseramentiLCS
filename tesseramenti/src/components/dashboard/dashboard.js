import { React, useContext, useState } from 'react';
/*import axios from 'axios';
import { API_BASE } from '../../config/config.js';*/
import { fetch } from '../../functions/useFetch.js';
/*import ReactDOM from 'react-dom';*/
import { sessionContext } from '../context.js';
import ProgressBar from '../elem/progressBar.js';
import Alert from '../elem/alert.js';

function Dashboard(props) {
    const [token, setToken, deleteToken] = useContext(sessionContext);

    return (
        <div className="w3-container">
            <h2>Dashboard</h2>
            <div className='w3-container w3-white'>
                <div className='w3-padding-large'>
                    <div className='w3-container w3-half'>
                        <h4>Panoramica giocatori</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {60} green = {0} red = {25} 
                        />
                        <div className='w3-padding'>
                            <h6>Tesserati : 18 / 20</h6>
                            <h6>Giocatori completi : 16 / 20</h6>
                        </div>

                        <h4>Certificati medici</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {40} green = {0} red = {20} 
                        />
                        <div className='w3-padding'>
                            <h6>Certificati inseriti / validi : 10 / 16</h6>
                        </div>
                    </div>
                    <div className = "w3-container w3-half">
                        <h4>Panoramica dirigenti</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {75} green = {0} red = {0} 
                        />
                        <h6>Tesserati : 3 / 4</h6>
                    </div>
                </div>
                
                <div className='w3-container w3-padding-large w3-margin'>
                    <h4>Invia elenco tesserati</h4>
                    <p>Inviando l'elenco tesserati le informazioni relative a giocatori e dirigenti non potranno più essere modificate. Sarai comunque in grado di aggiungere nuovi certificati medici</p>
                    <Alert 
                        mode = {"info"} 
                        msg = {"L'elenco tesserati deve essere inviato entro il 10/2/2022."}
                    />
                    <Alert 
                        mode={"alert"} 
                        msg={"Tutti i giocatori devono essere completi per poter inviare l'elenco tesserati."}
                    />
                    <button className='w3-button w3-blue w3-round'>Invia elenco</button>
                </div>
            </div>
        </div>
        );

}




export default Dashboard;