import React from 'react';
import { fetch } from '../../functions/useFetch.js';
import { NavLink } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: "",
            psw: "",
            storeSession: false,
            msg: ""
        }
    }
    render() {
        return (
            <div className="w3-container" style={{ padding: "20px", paddingTop : "8%" }} >
                <div className="w3-card-4 w3-content w3-container" style={{width:"25%", minWidth:"300px"}}>

                    <div className="w3-center"><br/>
                        <img src="logoMolecup.png" alt="Logo Molecup" style={{ width: "35%" , maxWidth:"150px"}} className="w3-circle w3-margin-top"/>
                    </div>

                    <form className="w3-container" onSubmit={(event) => this.submitLogin(event)} >
                        <div className="w3-section">
                            <h3 className="w3-center"><b>Login</b></h3>
                            <input className="w3-input w3-border w3-margin-bottom w3-round w3-light-grey" type="email" placeholder="Mail" name = "mail" value={this.state.mail} onChange={this.handleInputChange} required />
                            <input className="w3-input w3-border w3-margin-bottom w3-round w3-light-grey" type="password" placeholder="Password" name="psw" value={this.state.psw} onChange={this.handleInputChange} required />
                            <button className="w3-button w3-block w3-blue w3-hover-blue-grey w3-padding" type="submit">ACCEDI</button>
                            <p><input className="w3-check w3-margin-top" type="checkbox" name="storeSession" checked={this.state.storeSession} onChange={this.handleInputChange} /> Ricordami</p>
                        </div>
                    </form>

                    <div className="w3-panel w3-pale-red w3-display-container" style={this.isError() ? { display: 'block' } : { display: 'none' }}>
                        <span onClick={() =>this.setState({msg : ""})}
                            className="w3-button w3-display-topright">&times;</span>
                        <p><i>{this.state.msg}</i></p>
                    </div>

                    <div className="w3-container w3-border-top w3-padding-16">
                        <span className="w3-right w3-padding"><NavLink to="/recupero-psw">Recupera password</NavLink></span>
                    </div>

                </div>
            </div>
        );
    }

    isError() {
        if (this.state.msg === "") {
            return false;
        }
        return true;
    }

    handleInputChange = (event) =>{
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    submitLogin(event) {
        event.preventDefault();
        const send = {
            mail: this.state.mail.toLowerCase().trim(),
            psw: this.state.psw.trim()
        }
        const fetchData = async () => {
            let data = await fetch("/login", send);
            //console.log(data);
            if (data.status) {
                this.props.setToken(data.token);
                console.log("login effettuato con successo");
            }
            else {
                //console.log("Login fallito");
                console.log(data.msg);
                this.setState({
                    error: true,
                    msg: data.msg
                });
            }
        }
        fetchData();
    }
}


export default Login;