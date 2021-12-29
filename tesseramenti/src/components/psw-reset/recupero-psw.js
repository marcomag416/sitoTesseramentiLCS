import {useState} from 'react';
import Label from '../elem/label.js';
import LoadIcon from '../elem/loadIcon.js';
import {fetchPost} from '../../functions/useFetch.js';

function RecuperoPsw(props) {
    const errDef = {err : '0', msg : ""};
    const formDef = {mail : ""};
    const [err, setErr] = useState(errDef);
    const [formData, setFormData] = useState(formDef);

    const submitForm = async e =>{
        e.preventDefault();
        setErr({err : "loading", msg : ""});
        var conn = await fetchPost("/recoverPsw", null, {mail : formData.mail});
        if(conn.status){
            console.log("Recupero psw effettuato con successo: ", conn.msg);
            setErr({err : "g", msg : "La mail di recupero è stata inviata correttamente all'indirizzo "+formData.mail});
            setFormData(formDef);
        }
        else{
            console.log("Errore invio mail di recupero:", conn.msg);
            setErr({err : "r", msg : "Errore invio mail di recupero"});
        }
    }

    const handleInputChange = (event) =>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    return (
        <div className='w3-container' style = {{height : "88vh"}}>
            <div className='w3-container w3-white w3-margin-top'>
                <div className="w3-container w3-content w3-padding" style = {{width : "50%", minWidth:"300px"}}>
                    <form onSubmit={(e)=> submitForm(e)}>
                        <h3 className="w3-center"><b>Recupero password</b></h3>
                        <div className="w3-margin-bottom">
                            <b>Una mail con le istruzioni per il recupero delle  credenziali verrà inviata all'indirizzo associato all'account</b>
                            <input className="w3-input w3-border w3-margin w3-round w3-light-grey" type="email" placeholder="Inserisci mail" name = "mail" value={formData.mail} onChange={handleInputChange} required />
                        </div>
                        <div className="w3-padding-large w3-center">
                            <button className="w3-button w3-round w3-blue" style = {{width : "50%"}} type="submit">Invia mail</button>
                        </div>
                    </form>

                    <LoadIcon show={err.err == "loading"}/>
                    <Label onClose = {() => setErr({msg : "", err : "0"})} msg = {err.msg} mode = {err.err} />
                </div>
            </div>
        </div>
    );
}


export default RecuperoPsw;