import {useContext} from 'react';
import { NavLink} from "react-router-dom";
import { sessionContext } from '../context.js';
import { fetchPost, useFetch } from '../../functions/useFetch.js';
import './sidebar.css';


function Sidebar(props){
    const [token, setToken, deleteToken] = useContext(sessionContext);

    function logOut() {
        console.log("Logut...");
        deleteToken();
    }

    let displayStyle = { display: "none" };
    if (props.display) {
        displayStyle = { display: "block", width : "180px"};
    }
    console.log("info:", props.info);
    return (
        <div> 
            <div className="w3-sidebar w3-light-grey w3-bar-block w3-card w3-animate-left z-index" style={displayStyle} id="mySidebar">
                <div className="w3-container w3-bar-item w3-teal">
                    <span className="w3-button w3-xlarge w3-hide-large material-icons w3-display-topright w3-transparent"
                        onClick={() => props.hideSidebar()}>close</span>
                    <h4 className="">{props.info.lega} Lcs</h4>
                </div>
                <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/">Dashboard</NavLink>
                <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/tesserati">Tesserati</NavLink>
                <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/cambio-psw">Gestione password</NavLink>
                {props.info.super == 1 ? <SwitchSquadre idSquadra={props.info.idsquadra}/> : null}
                <button className=" w3-button w3-bottom w3-text-red text-left" style={displayStyle} onClick={() => logOut()}>Log out<i className="material-icons w3-large"></i></button>
            </div>
        </div>
    );
}

function SwitchSquadre(props){
    const [token, setToken, deleteToken] = useContext(sessionContext);
    const fetchSq = useFetch("/elencoSquadre", {token : token}, null);

    const changeSquadra = async (e) =>{
        e.preventDefault();
        console.log(e.target.value);
        console.log("Cambio squadra in corso...");
        var result = await fetchPost('/cambiaSquadra', token, {idsquadra : e.target.value});
        if(result.status){
            console.log("Squadra cambiata con successo");
            window.location.reload();
        }
        else{
            console.log("Errore cambiamento squadra:", result.msg);
        }
    }

    console.log("Supervisor mode enabled");
    console.log("array squadre:", fetchSq[0]);
    console.log(props.idsquadra);
    return(
        <div className="w3-dropdown-hover">
            <button className="w3-button w3-bar-item">Cambia squadra</button>
            <div className="w3-dropdown-content w3-bar-block w3-border">
                <select className="w3-select w3-bar-item w3-align-left" name="switchSquadra" value = {props.idSquadra} onChange={(e) => changeSquadra(e)}>
                    {fetchSq[0].vett != undefined ? fetchSq[0].vett.map(x => {
                        return(
                            <option value={x.id} key ={x.id}>{x.nome}</option>
                        );
                    }) : null}
                </select>
            </div>
        </div>
        
    );
}




export default Sidebar;

