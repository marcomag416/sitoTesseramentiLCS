import {useEffect, useState, memo, useContext, useMemo} from 'react';
import { sessionContext } from '../context';
import { fetchPost } from '../../functions/useFetch';
import Label from '../elem/label';
import controllaCf from '../../functions/controlloCampi.js';
import "./form.css";
import { tesseratiContext } from './tesserati';
import {MAX_FILE_SIZE, ALLOWED_FILE_TYPES} from '../../config/config.js'
import LoadIcon from '../elem/loadIcon';

function ModificaGiocatore (props){
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const [reloadTesserati]=useContext(tesseratiContext);
    
    const [inputVal, setInputVal] = useState(null);
    const [inputCert, setInputCert] = useState("");
    const[label, setLabel] = useState({mode : "0", msg : ""});
    const [loading, setLoading] = useState(false);
    const disabledFields = ["cf", "nome", "cognome", "luogo_nascita", "data_nascita", "classe"];

    var displayStyle = useMemo(() =>{
        if (props.display) {
            return { display: "block" };
        }
        return { display: "none" }
    }, [props.display]);

    useEffect(() =>{
        var gioVal;
        if(props.giocatore == null){
            gioVal = null;
        }
        else{
            gioVal = {
                cf : props.giocatore.cf,
                nome : props.giocatore.nome,
                cognome : props.giocatore.cognome,
                data_nascita : props.giocatore.data_nascita,
                luogo_nascita : props.giocatore.luogo_nascita,
                classe : props.giocatore.classe,
                numero : props.giocatore.numero_maglia,
                taglia : props.giocatore.taglia,
                ruolo : props.giocatore.ruolo,
            };
        }
        setInputVal(gioVal);
        console.log(props.giocatore);
    }, [props.giocatore])

    useEffect(() => {
        setLabel({mode : "0", msg : ""});
    }, [props.display]);

    const close = (e) =>{
        e.preventDefault();
        setInputVal(null);
        props.onClose();
    }

    const inviaCertificato = async e =>{
        if(!checkCertificato(e.target, (txt) => {setLabel({mode : "r", msg : txt})} )){
            console.log("Data di scadenza certificato mancante");
            return;
        }
        const sendData = {scadenza : inputCert, fileCertificato : cert.files[0], idgiocatore : idgiocatore};
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
            var  result = await fetchPost('/updateGiocatore', token, {...inputVal, idgiocatore : props.giocatore.id});
            if(result.status){
                console.log("Giocatore modificato con successo", result.idgiocatore);
                setLabel({mode : "g", msg : "Giocatore modificato."});
                reloadTesserati();
            }
            else{
                console.log("Errore modifica giocatore:", result.msg);
                setLabel({mode : "r", msg : result.msg + "Errore : modifica non salvata."});
            }
            setLoading(false);
        }
    }

    const handleInputChange = (event) =>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if(!name in disabledFields){
            setInputVal((prev) => ({...prev, [name]: value}));
        }
        //console.log(inputVal.certificato.name);
    }

    const getInputValue = (name) =>{
        return inputVal[name] || "";
    }

    const d = new Date();
    const d10y = new Date(Date.parse(d) - 315360000000);
    //console.log("form render");
    if(inputVal == null){
        return null;
    }
    return(
        <div className="w3-modal posizione-pannello" style={displayStyle}>
            <div className="w3-modal-content w3-card-4 w3-animate-zoom  dimensione-pannello">
                <div className="w3-container w3-teal w3-margin-bottom">
                    <h2>Modifica giocatore</h2>
                    <span onClick={(e) => close(e)}
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
                                    <label><b>Codice fiscale</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey w3-disabled" type="text" name="cf"  value={getInputValue("cf")} onChange={handleInputChange} placeholder="" disabled/>
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Nome</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey w3-disabled" type="text"  name="nome"  value={getInputValue("nome")} onChange={handleInputChange} placeholder="es. Mario" disabled/>
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Cognome</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey w3-disabled" type="text" name="cognome"  value={getInputValue("cognome")} onChange={handleInputChange}  placeholder="es. Rossi" disabled/>
                                </div>
                            </div>

                            <div className="w3-row-padding">
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Data di nascita</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey w3-disabled" type="date" name="data_nascita"  value={getInputValue("data_nascita")} onChange={handleInputChange} max={d10y.toISOString().slice(0, 10)} disabled/>
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Comune di nascita</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey w3-disabled" type="text" name="luogo_nascita"  value={getInputValue("luogo_nascita")} onChange={handleInputChange} placeholder="es. Torino" disabled/>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>
                                Altri dati
                            </legend>
                            <div className="w3-row-padding">
                                <div className="w3-quarter w3-margin-bottom">
                                    <label><b>Classe</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey w3-disabled" type="text" name="classe"  value={getInputValue("classe")} onChange={handleInputChange} placeholder="es. 4A" disabled/>
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
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="date" name="scadenza"  value={inputCert} onChange={(e) => setInputCert(e.target.value)} min={d.toISOString().slice(0, 10)} />
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Carica certificato</b></label>
                                    <input type="hidden" name="MAX_FILE_SIZE" value={MAX_FILE_SIZE}/>
                                    <input className="w3-input" type="file" name="certificato"/>
                                </div>
                            </div>
                        </fieldset>

                    </div>

                    <Label onClose = {(prev) => setLabel({msg : "", mode : "0"})} msg = {label.msg} mode = {label.mode} />

                    <div className="w3-border w3-margin-top w3-padding-large">
                        <button className="w3-button w3-round w3-red" onClick={(e) => close(e)}>Chiudi</button>
                        <input className="w3-button w3-round w3-blue w3-right" type = "submit" value ="Modifica"/>
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
    
    return true;
}

function checkCertificato(form, setMsg){
    if(form.certificato.files[0] == undefined){
        form.certificato.focus();
        setMsg("Seleziona un file");
        return false;
    }

    /* controllo dimensione e tipo di file */
    if(form.certificato.files[0].size > MAX_FILE_SIZE){
        form.certificato.focus();
        setMsg("Il file selezionato è troppo grande");
        return false;
    }

    if(!form.certificato.files[0].type in ALLOWED_FILE_TYPES){
        form.certificato.focus();
        setMsg("Il file del certificato medico deve essere un'immagine o un PDF");
        return false;
    }

    /* data scedenza certificato med */
    if(form.scadenza.value == "" || form.scadenza.value == null){
        form.scadenza.focus();
        setMsg("Inserisci la data di scadenza del certificato medico");
        return false;
    }
    var d = Date.parse(new Date(form.scadenza.value));
    if(d < dataOggi){
        form.scadenza.focus();
        setMsg("Data di scadenza certificato medico non valida");
        return false;
    }

    return true;
}

export default memo(ModificaGiocatore);