import {useEffect, useState, memo, useContext} from 'react';
import { sessionContext } from '../context';
import { fetchPost } from '../../functions/useFetch';
import Label from '../elem/label';
import controllaCf from '../../functions/controlloCampi.js';
import "./form.css";
import { tesseratiContext } from './tesserati';

function FormGiocatore (props){
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const [reloadTesserati]=useContext(tesseratiContext);
    const defaultGioVal = {
        cf : "",
        nome : "",
        cognome : "",
        data_nascita : "",
        comune_nascita : "",
        classe : "",
        numero : "",
        taglia : "",
        ruolo : "",
    };
    const [inputVal, setInputVal] = useState(defaultGioVal);
    const[label, setLabel] = useState({mode : "0", msg : ""});

    var displayStyle = { display: "none" }
    if (props.display) {
        displayStyle = { display: "block" };
    }

    const loadInputVal = useEffect(() => {
        var values = sessionStorage.getItem("dataFormGiocatore");
        if(values != "" && values != null){
            values = JSON.parse(values);
            setInputVal(values);
            console.log("stored data: ", values);
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("dataFormGiocatore", JSON.stringify(inputVal));
        //console.log(sessionStorage.getItem("dataFormGiocatore"));
    }, [inputVal])

    const submitForm = async e =>{
        e.preventDefault();
        setLabel({mode : "0", msg : ""});
        if(checkForm(e.target, (txt) => {setLabel({mode : "r", msg : txt})})){
            var  result = await fetchPost('/uploadGiocatore', token, inputVal);
            if(result.status){
                console.log("Giocatore caricato con successo");
                setLabel({mode : "g", msg : "Giocatore aggiunto"});
                sessionStorage.removeItem("dataFormGiocatore");
                setInputVal(defaultGioVal);
                reloadTesserati();
            }
            else{
                console.log("Errore caricamento giocatore:", result.msg);
                setLabel({mode : "r", msg : result.msg + ". Giocatore non aggiunto"});
            }
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
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="date" name="data_nascita"  value={getInputValue("data_nascita")} onChange={handleInputChange} max={d10y.toISOString().slice(0, 10)} required/>
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
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="date" name="scadenza"  /*value={getInputValue("scadenza")} onChange={handleInputChange}*/ min={d.toISOString().slice(0, 10)} />
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Carica certificato</b></label>
                                    <input type="hidden" name="MAX_FILE_SIZE" value="300000"/>
                                    <input className="w3-input" type="file" name="certificato"/>
                                </div>
                            </div>
                        </fieldset>

                    </div>

                    <Label onClose = {(prev) => setLabel({msg : "", mode : "0"})} msg = {label.msg} mode = {label.mode} />

                    <div className="w3-border w3-margin-top w3-padding-large">
                        <button className="w3-button w3-round w3-red" onClick={(e) => {e.preventDefault(); props.onClose()}}>Chiudi</button>
                        <input className="w3-button w3-round w3-blue w3-right" type = "submit" value ="Aggiungi"/>
                    </div>
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
    if(form.numero != "" && (form.numero < 1 || form.numero > 99)){
        form.numero.focus();
        setMsg("Numero maglia non valido")
        return false;
    }
    /* campi obbligatori */
    const required_fields = [form.nome, form.cognome, form.data_nascita, form.classe, form.luogo_nascita];
    for(let x in required_fields){
        console.log(required_fields[x], x);
        if(required_fields[x] == undefined || required_fields[x] == "" || required_fields[x] == null){
            required_fields[x].focus();
            setMsg("Campo necessario");
            return false;
        }
    }
    /* data nascita */
    const dataOggi = Date.parse(new Date);
    var d = Date.parse(new Date(form.data_nascita));
    /* meno di 10 anni*/
    if(d + 315360000000 > dataOggi){  
        form.data_nascita.focus();
        setMsg("Data di nascita non valida");
        return false;
    }

    /* data scedenza certificato med */
    if(form.scadenza != ""){
        var d = Date.parse(new Date(form.scadenza));
        if(d < dataOggi){
            form.scadenza.focus();
            setMsg("Certificato medico scaduto");
            return false;
        }
    }
    return true;
}

export default memo(FormGiocatore);