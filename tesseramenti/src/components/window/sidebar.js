import {useContext} from 'react';
import { NavLink} from "react-router-dom";
import { sessionContext } from '../context.js';
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
    return (
        <div> 
            <div className="w3-sidebar w3-light-grey w3-bar-block w3-card w3-animate-left z-index" style={displayStyle} id="mySidebar">
                <div className="w3-container w3-bar-item w3-teal">
                    <span className="w3-button w3-xlarge w3-hide-large material-icons w3-display-topright"
                        onClick={() => props.hideSidebar()}>close</span>
                    <h3 className="">LCS</h3>
                </div>
                <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/">Dashboard</NavLink>
                <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/tesserati">Tesserati</NavLink>
                <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/cambio-psw">Gestione password</NavLink>
                <button className=" w3-button w3-bottom w3-text-red text-left" style={displayStyle} onClick={() => logOut()}>Log out<i className="material-icons w3-large"></i></button>
            </div>
        </div>
    );
}




export default Sidebar;

