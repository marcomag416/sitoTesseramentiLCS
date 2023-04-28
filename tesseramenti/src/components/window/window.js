import {useState, useEffect} from 'react';
//import ReactDOM from 'react-dom';
import { Route, Switch, useLocation } from "react-router-dom";
import { API_BASE } from '../../config/config.js';
import axios from 'axios';
import './window.css';
import Login from '../login/login.js';
import Dashboard from '../dashboard/dashboard.js';
import Tesserati from '../tesserati/tesserati.js';
import NotFound from '../not-found/notFound.js';
import CambioPsw from '../psw-reset/cambio-psw.js';
import Sidebar from './sidebar.js';
import Topbar from './topbar.js';
import LoadIcon from '../elem/loadIcon.js';
import useToken from '../../functions/useToken.js';
import { sessionContext } from '../context.js';


function Window (props){
	const [sidebar, setSidebar] = useState(true);
	const [token, setToken, deleteToken] = useToken();
	const [loading, setLoading] = useState(true);
	const [info, setInfo] = useState({});
	const location = useLocation();
	
	const validaSessione = useEffect(() => {
		const path = API_BASE + "/sessionCheck";
		const send = {
			token: token
		}

		axios({
			mode : "no-cors",
			method: 'post',
			url: path,
			headers: { 'content-type': 'application/json' },
			data: send
		})
			.then(result => {
				if (result.data.status) {
					setInfo({
						id: result.data.id,
						nome: result.data.mail,
						squadra: result.data.squadra,
						idsquadra: result.data.idsquadra,
						stagione: result.data.stagione,
						lega: result.data.lega,
						elInviato: result.data.elInviato,
						super: result.data.super
					});
					console.log("fetched info :", info);
					setLoading(false);
				}
				else {
					console.log(result.data.status, this.getToken());
					deleteToken();
				}
			})
			.catch(error => {
				console.log("Errore connessione con il server");
				deleteToken();
				if (error.message) {
					console.log(error);
					console.log(error.message);
				}
				if (error.response) {
					console.log(error.response.headers, error.response.status, error.response.data);
				}
			});
    }, [token, location]);

	const pageTitles = [{url : "/", title : "Dashboard"}, {url : "/tesserati", title : "Tesserati"}, {url : "/cambio-psw", title : "Gestione password"}];
	const titolo = pageTitles.filter((x) =>{
		return location.pathname === x.url;
	})[0];

	//console.log("Render window", token);
	if (token == null) {
		return (
			<Login setToken={setToken} />
		);
	}
	
	if (loading) {
		return (
			<LoadIcon show={true}/>
			);
	}
	return (
		<div>
			<sessionContext.Provider value = {[token, setToken, deleteToken]}>
				<Sidebar
					hideSidebar={() => setSidebar(false)}
					display={sidebar}
					info={info}
				/>
				<div className="w3-main full-height" style={sidebar ? { marginLeft: "180px" } : { margiLeft: "0px" }} >
					<Topbar
						switchSidebar={() => setSidebar(!sidebar)}
						sidebarOn={sidebar}
						title={titolo != null ? titolo.title : "Pagina non trovata"}
						info={info}
					/>
					<div className="w3-light-grey">
						<Switch>
							<Route exact path="/tesserati">
								<Tesserati info = {info}/>
							</Route>
							<Route exact path="/cambio-psw">
								<CambioPsw/>
							</Route>
							<Route exact path="/">
								<Dashboard info = {info}/>
							</Route>
							<Route>
								<NotFound/>
							</Route>
						</Switch>
					</div>
					
				</div>
			</sessionContext.Provider>
		</div>
	);
}


export default Window;