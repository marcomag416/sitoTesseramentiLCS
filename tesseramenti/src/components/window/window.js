import React from 'react';
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

class Window extends React.Component {
	constructor() {
		super();
		this.state = {
			sidebar: true,
			token: this.getToken(),
			id:"",
			nome:"",
			squadra:"",
			stagione:"",
			lega: "",
			loading: true
		}
	}
	render() {
		if (!this.state.token) {
			return (
				<Login setToken={this.setToken} />
			);
		}
		if (this.state.loading) {
			return (
				<LoadIcon show={true}/>
				);
        }
		return (
			<div>
				<Sidebar
					hideSidebar={() => this.setState({ sidebar: false })}
					display={this.state.sidebar}
				/>
				<div className="w3-main full-height" style={this.state.sidebar ? { marginLeft: "180px" } : { margiLeft: "0px" }} >
					<Topbar
						switchSidebar={() => this.setState({ sidebar: !this.state.sidebar })}
						sidebarOn={this.state.sidebar}
						title={"Pagina"}
					/>
					<div className="w3-light-grey">
						<Switch>
							<Route exact path="/tesserati">
								<Tesserati token={this.state.token}/>
							</Route>
							<Route exact path="/">
								<Dashboard token={this.state.token}/>
							</Route>
						</Switch>
					</div>
					
				</div>
            </div>
        );
	}

	componentDidMount() {
		this.validaSessione();
    }

	validaSessione() {
		const path = API_BASE + "/sessionCheck";
		const send = {
			token: this.getToken()
		}

		axios({
			method: 'post',
			url: path,
			headers: { 'content-type': 'application/json' },
			data: send
		})
			.then(result => {
				if (result.data.status) {
					this.setState({
						loading: false,
						id: result.data.id,
						nome: result.data.mail,
						squadra: result.data.squadra,
						stagione: result.data.stagione,
						lega: result.data.lega
					});
				}
				else {
					console.log(result.data.status, this.getToken());
					this.setState({
						token: null
					});
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
    }

	setToken = (token) => {
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
	}
}


export default Window;