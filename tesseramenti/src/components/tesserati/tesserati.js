import { useEffect, useState, memo, useCallback, useContext, createContext } from 'react';
import React from 'react';
import './tesserati.css';
import FormGiocatore from './formGiocatore.js';
import ModificaGiocatore from './modificaGiocatore.js';
import FormDirigente from './formDirigente.js';
import {fetchPost, useFetch} from '../../functions/useFetch.js';
import { sessionContext } from '../context';
import LoadIcon from '../elem/loadIcon';
import ReactTooltip from 'react-tooltip';

//import { MDCDataTable } from '@material/data-table';
/*const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));*/

export const tesseratiContext = createContext();

function Tesserati (props){
    const [form, setForm] = useState({m : 0, value : null});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const [reload, setReload] = useState(true);
    const fetchGio = useFetch("/elencoTesserati", {token : token}, reload);
    const fetchDir = useFetch("/elencoDirigenti", {token : token}, reload);
    const [tesserati, setTesserati] = useState([]);
    const [dirigenti, setDirigenti] = useState([]);

    const closeForm = useCallback(() => {
            setForm({m : 0, value : null});
        }, []);
    
    const reloadTesserati = () =>{
        setReload(!reload);
    }

    useEffect(() => {
        setLoading(true);
        if (fetchGio[0].status && fetchGio[0].vett != undefined) {
            const vett = fetchGio[0].vett;
            let scadenza;
            const dataOggi = Date.parse(new Date);
            const gg10 = 864000000; /* millsec in 10 gg */
            vett.forEach((x, index) => {
                //x.id = index;
                x.t = 0; /* giocatore */
                if(x.scadenza == null){
                    x.cm = 4; /* cert mancante */
                }
                else{
                    scadenza = Date.parse(new Date(x.scadenza));
                    if(scadenza < dataOggi){
                        x.cm = 3; /* scaduto */
                    }
                    if(x.fisico == 1){
                        if(scadenza > dataOggi + gg10){
                            x.cm = 1; /*valido*/
                        }
                        else if(scadenza > dataOggi - gg10){
                            x.cm = 2; /* in scadenza */
                        }
                    }
                    else{
                        x.cm = 0;
                    }
                    
                }
            });
            //console.log(vett.length, "giocatori caricati: ", vett);
            setTesserati(vett);
            if(vett.length >= 20 && form.m == "g"){
                setForm({m : "0", value : null});
            }
        }
        else {
            console.log("Errore caricamento giocatori");
        }        
        setLoading(false);
    }, [fetchGio]);

    useEffect(() =>{
        setLoading(true);
        if (fetchDir[0].status && fetchDir[0].vett != undefined) {
            const vett = fetchDir[0].vett;
            vett.forEach((x) => {
                x.t = 1;
            })
            //console.log(vett.length, "dirigenti caricati: ", vett);
            setDirigenti(vett);
            if(vett.length >= 4 && form.m == "d"){
                setForm({m : "0", value : null});
            }
        }
        else{
            console.log("Errore caricamento dirigenti")
        }
        setLoading(false);
    }, [fetchDir])

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    const hideTltp = (e) =>{
        var id = setInterval(() => {
            ReactTooltip.hide();
            clearInterval(id);
        }, 1500);
    }

    return (
        <div className="w3-container">
            <ReactTooltip 
                effetc = "solid"
				delayShow={100} 
				place = "right" 
				id="tltp"
			/>
            <tesseratiContext.Provider value={[reloadTesserati, setForm, props.info]}>
                {props.info.elInviato == 0 ?
                    <>
                        <FormDirigente 
                        onClose={() => closeForm()} 
                        display={form.m == 'd'}
                        />
                        <FormGiocatore 
                            onClose={() => closeForm()} 
                            display={form.m == 'g'}
                        />
                    </>  
                    :null
                }
                <ModificaGiocatore 
                    onClose={() => closeForm()} 
                    display={form.m == 'mg'} 
                    giocatore = {form.value}
                    info = {props.info}
                />
                <div className = "w3-white">
                    <div className="w3-bar w3-margin-top w3-margin-bottom w3-padding-large">
                        <button className="w3-button w3-light-grey w3-round w3-margin-left w3-right" onClick={() => reloadTesserati()} ><i className="material-icons w3-large">refresh</i></button>
                        <input className="w3-input w3-quarter w3-right" type="text" placeholder="Cerca" value={search} onChange={(e) => { setSearch(e.target.value) } }/>
                    </div>
                    <div className="w3-padding">
                        <Tabella 
                            search={search} 
                            tesserati={tesserati.concat(dirigenti)}
                        />
                    </div>
                </div>
                {props.info.elInviato == 0 ?
                    <div className="w3-bar w3-right-align">
                        <button className="w3-button w3-blue w3-round w3-margin w3-mobile" onClick={() => setForm({m : 'g', value: null})} disabled = {tesserati.length >= 20}>Aggiungi giocatore</button>
                        <button className="w3-button w3-blue w3-round w3-margin w3-mobile" onClick={() => setForm({m : 'd', value: null})} disabled = {dirigenti.length >= 4}>Aggiungi dirigente</button>
                    </div>
                : null }
            </tesseratiContext.Provider>
            <LoadIcon show={loading} />
        </div>
    );

}


function Tabella(props) {
    const tesserati = props.tesserati;
    return (
        <div className="w3-responsive tabella-scorrevole" onScroll={() => {ReactTooltip.hide()}}>
            <table className="w3-table w3-bordered ">
                <thead>
                    <tr >
                        <th></th>
                        <th>Codice Fiscale</th>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>Certificato Medico</th>
                        <th>Taglia</th>
                        <th>N. Maglia</th>
                        <th>Ruolo</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody >
                    {tesserati.map((tesserato) => 
                        <Tesserato 
                            tesserato={tesserato} 
                            search={props.search} 
                            key={getId(tesserato)} 
                        /> 
                    )}
                </tbody>
            </table>
        </div>
        );
}

function getId(tesserato) {
    switch (tesserato.t) {
        case 0:
            return "g" + tesserato.id;
        case 1:
            return "d" + tesserato.id;
        default:
            return tesserato.id;
    }
}

function cercaTesserato(tesserato, key) {
    const keywords = key.toLowerCase().split(" ");
    for (let x in keywords) {
        if (tesserato.cf.toLowerCase().search(keywords[x]) == -1 && tesserato.nome.toLowerCase().search(keywords[x]) == -1 && tesserato.cognome.toLowerCase().search(keywords[x]) == -1) {
            return false;
        }
    }
    return true;
}

function Tesserato(props) {
    const tesserato = props.tesserato;
    if (!cercaTesserato(tesserato, props.search)) {
        return null;
    }
    switch (tesserato.t) {
        case 0:
            return (Giocatore(tesserato));
        case 1:
            return (Dirigente(tesserato));
        default:
            return null;
    }
}

function Dirigente(dirigente) {
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const [reloadTesserati, setForm, info] = useContext(tesseratiContext);
    return (
        <tr className="w3-hover-light-grey testo-centrale">
            <td>{IconaTesserato(1)}</td>
            <td>{dirigente.cf}</td>
            <td>{dirigente.nome}</td>
            <td>{dirigente.cognome}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                {info.elInviato == 0 ?
                    <button className="w3-button w3-red w3-round w3-padding-small" 
                        onClick={() => deleteDirigente(dirigente.id, token, reloadTesserati)}>
                            <i className="material-icons w3-large">delete</i>
                    </button>
                    :null
                }
            </td>
        </tr>
    )
}

function Giocatore(giocatore) {
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const [reloadTesserati, setForm, info] = useContext(tesseratiContext);
    return (
        <tr className="w3-hover-light-grey testo-centrale">
            <td>{IconaTesserato(0)}</td>
            <td>{giocatore.cf}</td>
            <td>{giocatore.nome}</td>
            <td>{giocatore.cognome}</td>
            <td>{IconaCertificatoMedico(giocatore.cm)}{StampaScadenza(giocatore.scadenza)}</td>
            <td>{giocatore.taglia}</td>
            <td>{giocatore.numero_maglia}</td>
            <td>{giocatore.ruolo}</td>
            <td className="w3-center"><button className="w3-button w3-small w3-blue w3-round" onClick={() => setForm({m : "mg", value : giocatore})} >Modifica</button></td>
            <td>
                {info.elInviato == 0 ?
                    <button className="w3-button w3-red w3-round w3-padding-small" 
                        onClick={() => deleteGiocatore(giocatore.id, token, reloadTesserati)} >
                            <i className="material-icons w3-large">delete</i>
                    </button>
                    : null
                }
            </td>
        </tr>
        )
}

function StampaScadenza(scadenza){
    if(scadenza == null){
        return(null);
    }
    return(
        <font style ={{paddingLeft : '5px'}} >
            {scadenza.slice(8, 10)}/{scadenza.slice(5, 7)}/{scadenza.slice(0, 4)}
        </font>
    );
}

function IconaCertificatoMedico(cm) {
    switch (cm) {
        case 0:
            return (<><span className="w3-badge w3-yellow" data-tip="Copia cartacea mancante" data-for="tltp">C</span></>);
        case 1:
            return (<><span className="w3-badge w3-green" data-tip="Certificato valido" data-for="tltp">V</span></>);
        case 2:
            return (<><span className="w3-badge w3-yellow" data-tip="Certificato in scadenza" data-for="tltp">V</span></>);
        case 3:
            return (<><span className="w3-badge w3-red" data-tip="Certificato scaduto" data-for="tltp">S</span></>);
        case 4:
            return (<><span className="w3-badge w3-red" data-tip="Certificato mancante" data-for="tltp">M</span></>);
        default:
            return (<><span className="w3-badge w3-grey" data-tip="Mancante" data-for="tltp">D</span></>);
    }
}

function IconaTesserato(t) {
    switch (t) {
        case 0:
            return (<><i className="material-icons" data-tip="Giocatore" data-for="tltp">sports_soccer</i></>);
        case 1:
            return (<><i className="material-icons" data-tip="Dirigente" data-for="tltp">person</i></>);
    }
}

/*const Tooltip = (text) => {
    const dieTime = 1500;
    const def = < p style = {{ position: "absolute", left: "50px", bottom: "0px" }} className = "w3-text w3-tag w3-round w3-grey w3-text-white" > { text }</p >;
    return (def);
}*/

async function deleteGiocatore(id, token, onSuccess){
    var  result = await fetchPost('/deleteGiocatore', token, {"idgiocatore" : id});
    if(result.status){
        console.log("Giocatore eliminato", id);
        onSuccess();
    }
    else{
        console.log("Errore eliminazione giocatore:", result);
    }
}

async function deleteDirigente(id, token, onSuccess){
    var  result = await fetchPost('/deleteDirigente', token, {"iddirigente" : id});
    if(result.status){
        console.log("Dirigente eliminato", id);
        onSuccess();
    }
    else{
        console.log("Errore eliminazione dirigente:", result);
    }
}


export default memo(Tesserati);