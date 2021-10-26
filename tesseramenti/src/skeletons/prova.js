import React from 'react';
//import ReactDOM from 'react-dom';
//import Testo from './elements.js';
import Testo2  from './elements.js'

class Prova extends React.Component {
    constructor() {
        super();
        this.state = {color : "RED"}
    }

    changeColor = () => {
        if (this.state.color == "RED") {
            this.setState({ color: "BLUE" });
        }
        else {
            this.setState({ color: "RED" });
        }
    }

    render() {
        return(
            <div>
                <h1>Pagina di prova</h1>
                <Testo2 colore={this.state.color} />
                <button
                    type="button"
                    onClick={this.changeColor}
                >Change color</button>
            </div>
        );
    }

    
}


export default Prova;