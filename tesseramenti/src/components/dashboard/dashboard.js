import { React, useContext, useState, useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import { useFetch, fetchPost } from '../../functions/useFetch.js';
import { sessionContext } from '../context.js';
import ProgressBar from '../elem/progressBar.js';
import Alert from '../elem/alert.js';
import Label from '../elem/label.js';
import './dashboard.css';

function Dashboard(props) {
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const fetchGio = useFetch("/elencoTesserati", {token : token}, null);
    const fetchDir = useFetch("/elencoDirigenti", {token : token}, null);
    const [msg, setMsg] = useState({mode : "", msg : ""});

    const [certTot, certValidi, certAtt, gioTot, gioValidi] = useMemo(() => calcolaStatGio(fetchGio), fetchGio);
    const dirTot = useMemo(() => calcolaStatDir(fetchDir), fetchDir);

    var invioOk = false;
    if(gioValidi === 20 && dirTot <= 4 && dirTot >= 1){
        invioOk = true;
    }

    const inviaElenco = async e => {
        e.preventDefault();
        if(!window.confirm("Sei sicuro di voler inviare l'elenco tesserati? Questa azione non è reversibile")){
            return;
        }
        setMsg({mode : "0", msg : ""});
        var resp = await fetchPost("/inviaElenco", token, []);
        if (resp.status){
            console.log("Elenco tesserati inviato con successo");
            window.location.reload();
        }
        else{
            console.log("Errore invio elenco tesserati", resp.msg);
            setMsg({mode : "r", msg : "Si è verificato un errore durante l'invio dell'elenco tesserati"});
        }
    }

    return (
        <div className="w3-container">
            <ReactTooltip 
                effect = "float"
				delayShow={100} 
				place = "right" 
			/>
            <div className='w3-row-padding w3-white w3-margin-top w3-mobile' >

                <div className = "w3-container  w3-margin contentholder">
                    <h4>Benvenuto, <b> {props.info.nome} </b> </h4>
                    <ul className = "w3-ul w3-margin-top">
                        <li className = "w3-border-0">Campionato : <b> {props.info.lega} </b> </li>
                        <li className = "w3-border-0">Squadra : <b> {props.info.squadra} </b> </li>
                        <li className = "w3-border-0">Stagione : <b> {props.info.stagione} </b> </li>
                    </ul>
                </div>

                <div className='w3-padding-large w3-container contentholder'>
                    <div className='w3-container w3-half'>
                        <h4>Panoramica giocatori</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {gioValidi / 20 * 100} green = {0} red = {(gioTot - gioValidi) / 20 * 100} 
                        />
                        <ul className='w3-ul w3-margin-top'>
                                <li className = "w3-border-0" data-tip="Numero totale di giocatori inseriti">Tesserati: <b>{gioTot} / 20</b></li>
                                <li className = "w3-border-0" data-tip="Giocatori completi di tutte le informazioni (n.maglia, taglia, ecc..)">Giocatori completati: <b>{gioValidi} / 20</b></li>
                        </ul>
                    </div>
                    <div className = "w3-container w3-half">
                        <h4>Certificati medici</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {certValidi / 20 * 100} green = {certAtt / 20 * 100} red = {(certTot - certValidi - certAtt) / 20 * 100} 
                        />
                        <ul className='w3-ul w3-margin-top'>
                            <li className = "w3-border-0" data-tip="Certificati medici inseriti">Certificati inseriti: <b>{certTot} / {gioTot}</b></li>
                            <li className = "w3-border-0" data-tip="In attesa di consegna della copia cartacea">In attesa: <b>{ certAtt } / {certTot}</b></li>
                            <li className = "w3-border-0" data-tip="Certificati validi">Validi: <b>{certValidi} / {certTot}</b></li>
                        </ul>
                    </div>
                    <div className = "w3-container w3-half">
                        <h4>Panoramica dirigenti</h4>
                        <ProgressBar 
                            style = {{width : "80%" }} 
                            blue = {dirTot / 4 * 100} green = {0} red = {0} 
                        />
                        <ul className = "w3-ul w3-margin-top">
                            <li className = "w3-border-0" data-tip="Numero di dirigenti inseriti">Tesserati: <b>{dirTot} / 4</b></li>
                        </ul>
                    </div>
                </div>
                
                <div className='w3-container w3-padding-large w3-margin contentholder'>
                    {props.info.elInviato == 1
                        ? <SezioneElencoInviato/>
                        : <SezioneInviaElenco invioOk = {invioOk} onClick = {inviaElenco}/> 
                    }
                </div>
                
                <div className='w3-container'>
                    <Label 
                        mode = {msg.mode} 
                        msg = {msg.msg} 
                        onClose = {() => setMsg({mode : "0", msg : ""})}
                    />
                </div>
            </div>
        </div>
        );

}

function SezioneInviaElenco(props){
    return(
        <div>
            <h4>Invia elenco tesserati</h4>
            <p>Inviando l'elenco tesserati le informazioni relative a giocatori e dirigenti non potranno più essere modificate. Sarai comunque in grado di aggiungere nuovi certificati medici e visualizzare quelli esistenti.</p>
            <Alert 
                mode = {"info"} 
                msg = {"L'elenco tesserati deve essere inviato entro il 20/01/2022."}
            />
            {props.invioOk ? null : 
                <Alert 
                    mode={"alert"} 
                    msg={"Tutte le informazioni relative a giocatori e dirigenti devono essere complete per poter inviare l'elenco tesserati."}
                />
            }
            <button className='w3-button w3-blue w3-round w3-right w3-margin-right' onClick = {(e) => props.onClick(e)} disabled = {!props.invioOk} >Invia elenco</button>
        </div> 
    );
}

function SezioneElencoInviato(props){
    return(
        <div>
            <h4>Elenco tesserati inviato</h4>
            <Alert 
                mode = {"info"}
                msg = {"L'elenco dei tesserati è stato inviato correttamente. In caso d'errore contatta via mail il nostro staff"}
            />
        </div>
    );
}

function calcolaStatGio(fetchGio) {
    var certTot = 0, certValidi = 0, certAtt = 0, gioTot = 0, gioValidi = 0;
    const nMaglia = new Set();
    if (fetchGio[0].status && fetchGio[0].vett != undefined) {
        const vett = fetchGio[0].vett;
        let scadenza;
        const dataOggi = Date.parse(new Date);
        vett.forEach((x) => {
            if(x.scadenza != null){
                certTot ++;
                scadenza = Date.parse(new Date(x.scadenza));
                if(scadenza > dataOggi){
                    if(x.fisico == 1){
                        certValidi++;
                    }
                    else{
                        certAtt++;
                    }
                }
            }
            if(x.numero_maglia != null && !nMaglia.has(x.numero_maglia)){
                nMaglia.add(x.numero_maglia);
                if(x.ruolo != "" && x.taglia != ""){
                    gioValidi++;
                }
            }
        });
        gioTot = vett.length;
    }
    else {
        console.log("Errore caricamento giocatori");
    }
    return [certTot, certValidi, certAtt, gioTot, gioValidi];        
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