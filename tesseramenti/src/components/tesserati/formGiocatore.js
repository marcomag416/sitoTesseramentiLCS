import {useEffect, useState, memo, useContext, useMemo} from 'react';
import { sessionContext } from '../context';
import { fetchPost } from '../../functions/useFetch';
import Label from '../elem/label';
import controllaCf from '../../functions/controlloCampi.js';
import "./form.css";
import { tesseratiContext } from './tesserati';
//import {MAX_FILE_SIZE, ALLOWED_FILE_TYPES} from '../../config/config.js'
import LoadIcon from '../elem/loadIcon';

function FormGiocatore (props){
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const [reloadTesserati]=useContext(tesseratiContext);
    const defaultGioVal = {
        cf : "",
        nome : "",
        cognome : "",
        data_nascita : "",
        luogo_nascita : "",
        classe : "",
        numero : "",
        taglia : "",
        ruolo : "",
    };
    const [inputVal, setInputVal] = useState(defaultGioVal);
    const [inputCert, setInputCert] = useState("");
    const[label, setLabel] = useState({mode : "0", msg : ""});
    const [loading, setLoading] = useState(false);

    var displayStyle = useMemo(() =>{
        if (props.display) {
            return { display: "block" };
        }
        return { display: "none" }
    }, [props.display]);

    useEffect(() => {
        setLabel({mode : "0", msg : ""});
    }, [props.display]);

    const loadInputVal = useEffect(() => {
        var values = sessionStorage.getItem("dataFormGiocatore");
        if(values != "" && values != null){
            values = JSON.parse(values);
            setInputVal(values);
            console.log("stored data: ", values);
        }
        var valCert = sessionStorage.getItem("dataCertificato");
        if(valCert != "" && valCert != null){
            valCert = JSON.parse(valCert);
            setInputCert(valCert);
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("dataFormGiocatore", JSON.stringify(inputVal));
        //console.log(sessionStorage.getItem("dataFormGiocatore"));
    }, [inputVal])

    useEffect(() =>{
        sessionStorage.setItem("dataCertificato", JSON.stringify(inputCert));
    }, [inputCert]);

    const inviaCertificato = async (cert, idgiocatore) =>{
        if(inputCert == null || inputCert == ""){
            console.log("Data di scadenza certificato mancante");
            return;
        }
        const sendData = {scadenza : inputCert, /*fileCertificato : cert.files[0],*/ idgiocatore : idgiocatore};
        var result = await fetchPost('/uploadCertificatoId', token, sendData);
        if(result.status){
            console.log("Certificato caricato con successo");
            setLabel({mode : "g", msg : label.msg + " Giocatore aggiunto correttamente con certificato medico"});
        }
        else{
            console.log("Errore caricamento certificato:", result.msg);
            setLabel({mode : "r", msg : label.msg + " Errore caricamento certificato : giocatore aggiunto senza certificato medico"});
        }
    }

    const submitForm = async e =>{
        e.preventDefault();
        setLabel({mode : "0", msg : ""});
        if(checkForm(e.target, (txt) => {setLabel({mode : "r", msg : txt})})){
            setLoading(true);
            var  result = await fetchPost('/uploadGiocatore', token, inputVal);
            if(result.status){
                console.log("Giocatore caricato con successo", result.idgiocatore);
                if(e.target.scadenza.value != "" && e.target.scadenza.value != null){
                    setLabel({mode : "g", msg : "Giocatore aggiunto."});
                    await inviaCertificato(e.target.certificato, result.idgiocatore);
                }
                else{
                    setLabel({mode : "g", msg : "Giocatore aggiunto senza certificato medico"});
                }
                sessionStorage.removeItem("dataFormGiocatore");
                setInputVal(defaultGioVal);
                setInputCert("");
                /*e.target.certificato.value = "";*/
                reloadTesserati();
            }
            else{
                console.log("Errore caricamento giocatore:", result.msg);
                setLabel({mode : "r", msg : result.msg + "Errore inserimento giocatore : giocatore non aggiunto"});
            }
            setLoading(false);
        }
    }

    const handleInputChange = (event) =>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setInputVal((prev) => ({...prev, [name]: value}));
        //console.log(inputVal.certificato.name);
    }

    const getInputValue = (name) =>{
        return inputVal[name] || "";
    }

    const d = new Date();
    const d10y = new Date(Date.parse(d) - 315360000000);
    //console.log("form render");
    return(
        <div className="w3-modal posizione-pannello" style={displayStyle}>
            <div className="w3-modal-content w3-card-4 w3-animate-zoom  dimensione-pannello">
                <div className="w3-container w3-teal w3-margin-bottom">
                    <h2>Aggiungi giocatore</h2>
                    <span onClick={() => props.onClose()}
                        className="w3-button w3-display-topright material-icons">close</span>
                </div>
                <form onSubmit = {(e) => submitForm(e)}>
                    <div className="w3-container scrollabile" >
                        <fieldset>
                            <legend>
                                    Dati personali 
                            </legend>

                            <div className="w3-row-padding">
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Codice fiscale*</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="text" name="cf"  value={getInputValue("cf")} onChange={handleInputChange} placeholder="" required/>
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Nome*</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="text"  name="nome"  value={getInputValue("nome")} onChange={handleInputChange} placeholder="es. Mario" required/>
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Cognome*</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="text" name="cognome"  value={getInputValue("cognome")} onChange={handleInputChange}  placeholder="es. Rossi" required/>
                                </div>
                            </div>

                            <div className="w3-row-padding">
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Data di nascita*</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="date" name="data_nascita"  value={getInputValue("data_nascita")} onChange={handleInputChange} max={d10y.toISOString().slice(0, 10)} placeholder="yyyy-mm-dd" required/>
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Comune di nascita*</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="text" name="luogo_nascita"  value={getInputValue("luogo_nascita")} onChange={handleInputChange} placeholder="es. Torino" required/>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>
                                Altri dati
                            </legend>
                            <div className="w3-row-padding">
                                <div className="w3-quarter w3-margin-bottom">
                                    <label><b>Classe*</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="text" name="classe"  value={getInputValue("classe")} onChange={handleInputChange} placeholder="es. 4A" required/>
                                </div>
                                <div className="w3-quarter w3-margin-bottom">
                                    <label><b>Numero maglia</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="number" name="numero"  value={getInputValue("numero")} onChange={handleInputChange} placeholder="es. 10" min="1" max="99"/>
                                </div>
                                <div className="w3-quarter w3-margin-bottom">
                                    <label><b>Taglia divisa</b></label>
                                    <select className="w3-select w3-border w3-round w3-light-grey" name="taglia" value={getInputValue("taglia")} onChange={handleInputChange}>
                                        <option value="" disabled>Seleziona taglia</option>
                                        <option value="xs">XS</option>
                                        <option value="s">S</option>
                                        <option value="m">M</option>
                                        <option value="l">L</option>
                                        <option value="xl">XL</option>
                                    </select>
                                </div>
                                <div className="w3-quarter w3-margin-bottom">
                                    <label><b>Ruolo</b></label>
                                    <select className="w3-select w3-border w3-round w3-light-grey" name="ruolo"  value={getInputValue("ruolo")} onChange={handleInputChange}>
                                        <option value="" disabled>Seleziona ruolo</option>
                                        <option value="por">POR</option>
                                        <option value="dif">DIF</option>
                                        <option value="cen">CEN</option>
                                        <option value="att">ATT</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>
                                Certificato medico
                            </legend>
                            <div className="w3-row-padding">
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Scadenza certificato</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="date" name="scadenza"  value={inputCert} onChange={(e) => setInputCert(e.target.value)} min={d.toISOString().slice(0, 10)} placeholder="yyyy-mm-dd"/>
                                </div>
                            </div>
                        </fieldset>

                    </div>

                    <Label onClose = {(prev) => setLabel({msg : "", mode : "0"})} msg = {label.msg} mode = {label.mode} />

                    <div className="w3-border w3-margin-top w3-padding-large">
                        <button className="w3-button w3-round w3-red" onClick={(e) => {e.preventDefault(); props.onClose()}}>Chiudi</button>
                        <input className="w3-button w3-round w3-blue w3-right" type = "submit" value ="Aggiungi"/>
                    </div>
                    <LoadIcon show={loading}/>
                </form>
            </div>
        </div>
    );

    
}


function checkForm(form, setMsg){
    if(!controllaCf(form.cf, setMsg)){
        return false;
    }
    /* numero maglia */
    if(form.numero.value != "" && (form.numero.value < 1 || form.numero.value > 99)){
        form.numero.focus();
        setMsg("Numero maglia non valido")
        return false;
    }
    /* campi obbligatori */
    const required_fields = [form.nome, form.cognome, form.data_nascita, form.classe, form.luogo_nascita];
    for(let x in required_fields){
        //console.log(required_fields[x], x);
        if(required_fields[x].value == undefined || required_fields[x].value == "" || required_fields[x].value == null){
            required_fields[x].focus();
            setMsg("Campo necessario");
            return false;
        }
    }
    /* data nascita */
    const dataOggi = Date.parse(new Date);
    var d = Date.parse(new Date(form.data_nascita.value));
    /* meno di 10 anni*/
    if(d + 315360000000 > dataOggi){  
        form.data_nascita.focus();
        setMsg("Data di nascita non valida");
        return false;
    }

    /*if(form.certificato.files[0] != undefined){
        /* controllo dimensione e tipo di file 
        if(form.certificato.files[0].size > MAX_FILE_SIZE){
            form.certificato.focus();
            setMsg("Il file selezionato è troppo grande");
            return false;
        }

        if(!form.certificato.files[0].type in ALLOWED_FILE_TYPES){
            form.certificato.focus();
            setMsg("Il file del certificato medico deve essere un'immagine o un PDF");
            return false;
        }*/
    
    if(form.scadenza.value != "" && form.scadenza.value != null){
        /* data scedenza certificato med */
        var d = Date.parse(new Date(form.scadenza.value));
        if(d < dataOggi){
            form.scadenza.focus();
            setMsg("Data di scadenza certificato medico non valida");
            return false;
        }
    }
    
    return true;
}

export default memo(FormGiocatore);

/*

    <div className="w3-third w3-margin-bottom">
        <label><b>Carica certificato</b></label>
        <input type="hidden" name="MAX_FILE_SIZE" value={MAX_FILE_SIZE}/>
        <input className="w3-input" type="file" name="certificato"/>
    </div>
                                
*/