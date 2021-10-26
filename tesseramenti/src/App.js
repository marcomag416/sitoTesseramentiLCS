import React from 'react';
import './w3.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PswReset from './components/psw-reset/psw-reset.js';
import RecuperoPsw from './components/psw-reset/recupero-psw.js';
import Window from './components/window/window.js';
//import { render } from '@testing-library/react';

class App extends React.Component{
	render() {
		//console.log(token);
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/psw-reset">
						<PswReset/>
					</Route>
					<Route exact path="/recupero-psw">
						<RecuperoPsw />
					</Route>
					<Route path="/">
						<Window/>
					</Route>
				</Switch>
			</BrowserRouter>
		);
	}
	
  
}

export default App;
