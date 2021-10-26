import React from 'react';
import './window.css';
/*import ReactDOM from 'react-dom';*/
import { BrowserRouter, Route, Link } from "react-router-dom";

class Topbar extends React.Component {
    render() {
        return (
            <div className="w3-teal w3-bar">
                <div className="w3-container">
                    <button className="w3-button w3-teal w3-xlarge w3-bar-item"
                        onClick={() => this.props.switchSidebar()}
                        /*style={this.props.sidebarOn ? { display: "none" } : {display : "inline-block"}}*/
                    >{this.props.sidebarOn ? <i className="material-icons">close</i> : <i className="material-icons">menu</i>}</button>
                
                    <span className="w3-bar-item"><h2> {this.props.title }</h2></span>
                </div>
            </div>
            );
    }
}

export default Topbar;