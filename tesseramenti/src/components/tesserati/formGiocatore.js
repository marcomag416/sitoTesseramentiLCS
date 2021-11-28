import {useState} from 'react';

import "./form.css";

export default function FormGiocatore (props){
    const [inputVal, setInputVal] = useState({
        cf : "",
        nome : "",
        cognome : "",
        data_nascita : "",
        comune_nascita : "",
        classe : "",
        numero : "",
        taglia : "",
        ruolo : "",
        scadenza : "",
        certificato : ""
    });
    var displayStyle = { display: "none" }
    if (props.display) {
        displayStyle = { display: "block" };
    }

    const submitForm = (e) =>{
        e.preventDefault();
        console.log("Submit", inputVal);
    }

    const handleInputChange = (event) =>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setInputVal((prev) => ({...prev, [name]: value}));
    }

    const getInputValue = (name) =>{
        return inputVal[name] || "";
    }

    const d = new Date();
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
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="date" name="data_nascita"  value={getInputValue("data_nascita")} onChange={handleInputChange} min="2000-01-01" required/>
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Comune di nascita</b></label>
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="text" name="luogo_nascita"  value={getInputValue("luogo_nascita")} onChange={handleInputChange} placeholder="es. Torino" />
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
                                    <input className="w3-input w3-border w3-round w3-light-grey" type="date" name="scadenza"  value={getInputValue("scadenza")} onChange={handleInputChange} min="2021-10-20" />
                                </div>
                                <div className="w3-third w3-margin-bottom">
                                    <label><b>Carica certificato</b></label>
                                    <input className="w3-input" type="file" name="certificato"  value={getInputValue("certificato")} onChange={handleInputChange}/>
                                </div>
                            </div>
                        </fieldset>

                    </div>
                    <div className="w3-border w3-margin-top w3-padding-large">
                        <button className="w3-button w3-round w3-red" onClick={(e) => {e.preventDefault(); props.onClose()}}>Chiudi</button>
                        <input className="w3-button w3-round w3-blue w3-right" type = "submit" value ="Aggiungi"/>
                    </div>
                </form>
            </div>
        </div>
    );

    
}

