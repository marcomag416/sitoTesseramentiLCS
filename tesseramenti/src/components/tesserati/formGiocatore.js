import React from 'react';

import "./form.css";

export default function FormGiocatore (props){
    var displayStyle = { display: "none" }
    if (props.display) {
        displayStyle = { display: "block" };
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
                <form className="w3-container scrollabile">
                    <fieldset>
                        <legend>
                                Dati personali 
                        </legend>

                        <div className="w3-row-padding">
                            <div className="w3-third w3-margin-bottom">
                                <label><b>Codice fiscale</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="" required/>
                            </div>
                            <div className="w3-third w3-margin-bottom">
                                <label><b>Nome</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="es. Mario" required/>
                            </div>
                            <div className="w3-third w3-margin-bottom">
                                <label><b>Cognome</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="es. Rossi" required/>
                            </div>
                        </div>

                        <div className="w3-row-padding">
                            <div className="w3-third w3-margin-bottom">
                                <label><b>Data di nascita</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="date" min="2000-01-01" required/>
                            </div>
                            <div className="w3-third w3-margin-bottom">
                                <label><b>Comune di nascita</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="es. Torino" />
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
                                <input className="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="es. 4A" required/>
                            </div>
                            <div className="w3-quarter w3-margin-bottom">
                                <label><b>Numero maglia</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="number" placeholder="es. 10" min="1" max="99"/>
                            </div>
                            <div className="w3-quarter w3-margin-bottom">
                                <label><b>Taglia divisa</b></label>
                                <select className="w3-select w3-border w3-round w3-light-grey" name="taglia" defaultValue="">
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
                                <select className="w3-select w3-border w3-round w3-light-grey" name="ruolo" defaultValue="cen" >
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
                                <input className="w3-input w3-border w3-round w3-light-grey" type="date" min="2021-10-20" />
                            </div>
                            <div className="w3-third w3-margin-bottom">
                                <label><b>Carica certificato</b></label>
                                <input className="w3-input" type="file" />
                            </div>
                        </div>
                    </fieldset>

                </form>
                <div className="w3-border w3-margin-top w3-padding-large">
                    <button className="w3-button w3-round w3-red" onClick={() => props.onClose()}>Chiudi</button>
                    <button className="w3-button w3-round w3-blue w3-right">Aggiungi</button>
                </div>
            </div>
        </div>
    );
}

