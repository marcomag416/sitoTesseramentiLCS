import { React, useContext, useState } from 'react';
/*import axios from 'axios';
import { API_BASE } from '../../config/config.js';*/
import { fetch } from '../../functions/useFetch.js';
/*import ReactDOM from 'react-dom';*/
import { sessionContext } from '../context.js';
import ProgressBar from '../elem/progressBar.js';

function Dashboard(props) {
    const [token, setToken, deleteToken] = useContext(sessionContext);

    return (
        <div className="w3-container">
            <h2>Dashboard</h2>
            <div className='w3-container w3-white'>
                <section className='w3-padding-large'>
                    <div className='w3-container w3-half'>
                        <h4>Panoramica giocatori</h4>
                        <ProgressBar style = {{width : "80%" }} blue = {0} green = {80} red = {3} />
                        <div className='w3-padding'>
                            <h6><b>Tesserati : 18 / 20</b></h6>
                            <h6><b>Certificati validi : 16 / 20</b></h6>
                        </div>
                    </div>
                    <div className = "w3-container w3-half">
                        <h4>Panoramica dirigenti</h4>
                        <ProgressBar style = {{width : "80%" }} blue = {75} green = {0} red = {0} />
                        <h6>Tesserati : 3 / 4</h6>
                    </div>
                </section>

                <div className='w3-container w3-padding-large w3-margin'>
                    <h4>Invia elenco tesserati</h4>
                    <p>Inviando l'elenco tesserati le informazioni relative a giocatori e dirigenti non potranno più essere modificate. Sarai comunque in grado di aggiungere nuovi certificati medici</p>
                    <button className='w3-button w3-blue w3-round'>Invia elenco</button>
                </div>
            </div>
        </div>
        );

}




export default Dashboard;