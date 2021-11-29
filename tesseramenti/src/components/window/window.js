import {useState, useEffect} from 'react';
//import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from "react-router-dom";
import { API_BASE } from '../../config/config.js';
import axios from 'axios';
import './window.css';
import Login from '../login/login.js';
import Dashboard from '../dashboard/dashboard.js';
import Tesserati from '../tesserati/tesserati.js';
import Sidebar from './sidebar.js';
import Topbar from './topbar.js';
import LoadIcon from '../elem/loadIcon.js';
import useToken from '../../functions/useToken.js';
import { sessionContext } from '../context.js';


function Window (){
	const [sidebar, setSidebar] = useState(true);
	const [token, setToken, deleteToken] = useToken();
	const [loading, setLoading] = useState(true);
	const [info, setInfo] = useState({});
	
	const validaSessione = useEffect(() => {
		const path = API_BASE + "/sessionCheck";
		const send = {
			token: token
		}

		axios({
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
						stagione: result.data.stagione,
						lega: result.data.lega
					});
					setLoading(false);
				}
				else {
					//console.log(result.data.status, this.getToken());
					deleteToken();
				}
			})
			.catch(error => {
				console.log("Errore connessione con il server");
				if (error.message) {
					console.log(error.message);
				}
				if (error.response) {
					console.log(error.response.headers, error.response.status, error.response.data);
				}
			});
    }, [token]);


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
				/>
				<div className="w3-main full-height" style={sidebar ? { marginLeft: "180px" } : { margiLeft: "0px" }} >
					<Topbar
						switchSidebar={() => setSidebar(!sidebar)}
						sidebarOn={sidebar}
						title={"Pagina"}
					/>
					<div className="w3-light-grey">
						<Switch>
							<Route exact path="/tesserati">
								<Tesserati/>
							</Route>
							<Route exact path="/">
								<Dashboard/>
							</Route>
						</Switch>
					</div>
					
				</div>
			</sessionContext.Provider>
		</div>
	);


	/*setToken = (token) => {
		localStorage.setItem('token', JSON.stringify(token));
		this.setState({
			token: token,
			loading : false
		});
	}
	getToken() {
		const stringToken = localStorage.getItem('token');
		const token = JSON.parse(stringToken);
		if (token) {
			return token;
		}
		return null;
	}*/
}


export default Window;