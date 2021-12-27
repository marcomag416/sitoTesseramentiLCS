import { React, useContext, useState, useMemo } from 'react';
/*import axios from 'axios';
import { API_BASE } from '../../config/config.js';*/
import { useFetch } from '../../functions/useFetch.js';
/*import ReactDOM from 'react-dom';*/
import { sessionContext } from '../context.js';
import ProgressBar from '../elem/progressBar.js';
import Alert from '../elem/alert.js';

function Dashboard(props) {
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const fetchGio = useFetch("/elencoTesserati", {token : token}, null);
    const fetchDir = useFetch("/elencoDirigenti", {token : token}, null);

    const [certTot, certValidi, gioTot, gioValidi] = useMemo(() => calcolaStatGio(fetchGio), fetchGio);
    const dirTot = useMemo(() => calcolaStatDir(fetchDir), fetchDir);

    var invioOk = false;
    if(gioValidi === 20 && dirTot <= 4 && dirTot >= 1){
        invioOk = true;
    }

    return (
        <div className="w3-container">
            <h2>Dashboard</h2>
            <div className='w3-container w3-white'>
                <div className='w3-padding-large'>
                    <div className='w3-container w3-half'>
                        <h4>Panoramica giocatori</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {gioValidi / 20 * 100} green = {0} red = {(gioTot - gioValidi) / 20 * 100} 
                        />
                        <div className='w3-padding'>
                            <h6>Tesserati : {gioTot} / 20</h6>
                            <h6>Giocatori completi : {gioValidi} / 20</h6>
                        </div>

                        <h4>Certificati medici</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {certValidi / 20 * 100} green = {0} red = {(certTot - certValidi) / 20 * 100} 
                        />
                        <div className='w3-padding'>
                            <h6>Certificati inseriti : {certTot} / 20</h6>
                            <h6>Certificati non validi : {certTot - certValidi}</h6>
                        </div>
                    </div>
                    <div className = "w3-container w3-half">
                        <h4>Panoramica dirigenti</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {dirTot / 4 * 100} green = {0} red = {0} 
                        />
                        <h6>Tesserati : {dirTot} / 4</h6>
                    </div>
                </div>
                
                <div className='w3-container w3-padding-large w3-margin'>
                    <h4>Invia elenco tesserati</h4>
                    <p>Inviando l'elenco tesserati le informazioni relative a giocatori e dirigenti non potranno più essere modificate. Sarai comunque in grado di aggiungere nuovi certificati medici</p>
                    <Alert 
                        mode = {"info"} 
                        msg = {"L'elenco tesserati deve essere inviato entro il 10/2/2022."}
                    />
                    {invioOk ? null : 
                        <Alert 
                            mode={"alert"} 
                            msg={"Tutti i giocatori devono essere completi per poter inviare l'elenco tesserati."}
                        />
                    }
                    <button className='w3-button w3-blue w3-round' disabled = {!invioOk} >Invia elenco</button>
                </div>
            </div>
        </div>
        );

}

function calcolaStatGio(fetchGio) {
    var certTot = 0, certValidi = 0, gioTot = 0, gioValidi = 0;
    if (fetchGio[0].status && fetchGio[0].vett != undefined) {
        const vett = fetchGio[0].vett;
        console.log(vett);
        let scadenza;
        const dataOggi = Date.parse(new Date);
        vett.forEach((x) => {
            if(x.scadenza != null){
                certTot ++;
                scadenza = Date.parse(new Date(x.scadenza));
                if(scadenza > dataOggi){
                    certValidi++;
                }
            }
            if(x.numero_maglia != null && x.ruolo != "" && x.taglia != ""){
                gioValidi++;
            }
        });
        gioTot = vett.length;
    }
    else {
        console.log("Errore caricamento giocatori");
    }
    return [certTot, certValidi, gioTot, gioValidi];        
}

function calcolaStatDir(fetchDir){
    if (fetchDir[0].status && fetchDir[0].vett != undefined) {
        const vett = fetchDir[0].vett;
        return vett.length;
    }
    else{
        console.log("Errore caricamento dirigenti");
        return 0;
    }
}




export default Dashboard;