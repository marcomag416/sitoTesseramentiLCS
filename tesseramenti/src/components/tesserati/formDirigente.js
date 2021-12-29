import {useEffect, useState, memo, useContext, useMemo} from 'react';
import { sessionContext } from '../context';
import { fetchPost } from '../../functions/useFetch';
import Label from '../elem/label';
import controllaCf from '../../functions/controlloCampi.js';
import "./form.css";
import { tesseratiContext } from './tesserati';
import LoadIcon from '../elem/loadIcon';

function FormDirigente (props){
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const [reloadTesserati]=useContext(tesseratiContext);
    const defaultGioVal = {
        cf : "",
        nome : "",
        cognome : "",
    };
    const [inputVal, setInputVal] = useState(defaultGioVal);
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
        var values = sessionStorage.getItem("dataFormDirigente");
        if(values != "" && values != null){
            values = JSON.parse(values);
            setInputVal(values);
            console.log("stored data: ", values);
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("dataFormDirigente", JSON.stringify(inputVal));
        //console.log(sessionStorage.getItem("dataFormGiocatore"));
    }, [inputVal])

    const submitForm = async e =>{
        e.preventDefault();
        setLabel({mode : "0", msg : ""});
        if(checkForm(e.target, (txt) => {setLabel({mode : "r", msg : txt})})){
            setLoading(true);
            var  result = await fetchPost('/uploadDirigente', token, inputVal);
            if(result.status){
                console.log("Dirigente caricato con successo", result.idgiocatore);
                setLabel({mode : "g", msg : "Dirigente caricato con successo"});
                sessionStorage.removeItem("dataFormDirigente");
                setInputVal(defaultGioVal);
                reloadTesserati();
            }
            else{
                console.log("Errore caricamento dirigente:", result.msg);
                setLabel({mode : "r", msg : result.msg + "Errore inserimento dirigente : dirigente non aggiunto"});
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

    //console.log("form render");
    return(
        <div className="w3-modal posizione-pannello" style={displayStyle}>
            <div className="w3-modal-content w3-card-4 w3-animate-zoom  dimensione-pannello">
                <div className="w3-container w3-teal w3-margin-bottom">
                    <h2>Aggiungi dirigente</h2>
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
    /* campi obbligatori */
    const required_fields = [form.cf, form.nome, form.cognome];
    for(let x in required_fields){
        //console.log(required_fields[x], x);
        if(required_fields[x].value == undefined || required_fields[x].value == "" || required_fields[x].value == null){
            required_fields[x].focus();
            setMsg("Campo necessario");
            return false;
        }
    }
    
    return true;
}

export default memo(FormDirigente);