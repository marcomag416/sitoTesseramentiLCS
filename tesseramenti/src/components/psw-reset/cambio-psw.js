import {memo, useState, useContext} from 'react';
import { sessionContext } from '../context';
import LoadIcon from '../elem/loadIcon.js';
import Label from '../elem/label.js';
import { fetchPost } from '../../functions/useFetch';

function CambioPsw(props){
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const errDef = {err : "0", msg : ""};
    const formDataDef = {pswVecchia : "", psw1 : "", psw2 : ""};
    const [formData, setFormData] = useState(formDataDef);
    const [err, setErr] = useState(errDef);

    const submitForm = async e => {
        e.preventDefault();
        if(controllaFormPsw(e.target, (txt) => {setErr({err : "r", msg : txt})})){
            setErr({err : "loading", msg: ""});
            var  result = await fetchPost('/updatePassword', token, {pswOld : formData.pswVecchia, psw : formData.psw1});
            if(result.status){
                console.log("Password modificata con successo", result.msg);
                setErr({err : "g", msg : "Password modificata"});
                setFormData(formDataDef);
            }
            else{
                console.log("Errore aggiornamento password:", result.msg);
                setErr({err : "r", msg : result.msg});
            }
        }
    }

    const handleInputChange = (event) =>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    return(
        <div className='w3-container' style = {{height : "88vh"}}>
            <div className='w3-container w3-white w3-margin-top'>
                <div className="w3-container w3-content w3-padding" style = {{width : "50%", minWidth:"300px"}}>
                    <form onSubmit={(event) => submitForm(event)} >
                        <h3 className='w3-center'>Aggiorna password</h3>
                        <div className="w3-row-padding">
                            <div className="w3-margin-bottom">
                                <label><b>Vecchia password</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="password" name="pswVecchia"  value={formData.pswVecchia} onChange={handleInputChange} placeholder="" required/>
                            </div>
                            <div className="w3-margin-bottom">
                                <label><b>Nuova password</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="password"  name="psw1"  value={formData.psw1} onChange={handleInputChange} placeholder="" required/>
                            </div>
                            <div className="w3-margin-bottom">
                                <label><b>Ripeti password</b></label>
                                <input className="w3-input w3-border w3-round w3-light-grey" type="password" name="psw2"  value={formData.psw2} onChange={handleInputChange}  placeholder="" required/>
                            </div>
                        </div>

                        <div className="w3-padding-large w3-center">
                            <button className="w3-button w3-round w3-blue" style = {{width : "50%"}} type="submit">Aggiorna password</button>
                        </div>
                        <LoadIcon show={err.err == "loading"}/>

                        <Label onClose = {(prev) => setErr({msg : "", err : "0"})} msg = {err.msg} mode = {err.err} />
                    </form>
                </div>
            </div>
        </div>
    );
}

function controllaFormPsw(form, setMsg){
    const psw1 = form.psw1;
    const psw2 = form.psw2;

    if(psw1.value != psw2.value){
        psw2.focus();
        setMsg("Le password non corrispondono");
        return false;
    }
    
    if(psw1.value.length < 8){
        psw1.focus();
        setMsg("La password deve contenere almeno 8 caratteri");
        return false;
    }

    return true;
}

export default memo(CambioPsw);