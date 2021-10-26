import React from 'react';
/*import ReactDOM from 'react-dom';*/
import { NavLink} from "react-router-dom";


class Sidebar extends React.Component {
    render() {
        let displayStyle = { display: "none" };
        if (this.props.display) {
            displayStyle = { display: "block", width : "180px"};
        }
        return (
            <div> 
                <div className="w3-sidebar w3-light-grey w3-bar-block w3-card w3-animate-left z-index" style={displayStyle} id="mySidebar">
                    <div className="w3-container w3-bar-item w3-teal">
                        <span className="w3-button w3-xlarge w3-hide-large material-icons w3-display-topright"
                            onClick={() => this.props.hideSidebar()}>close</span>
                        <h3 className="">LCS</h3>
                    </div>
                    <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/">Dashboard</NavLink>
                    <NavLink className="w3-bar-item w3-button" activeClassName="w3-border-right w3-dark-grey w3-border-red" exact to="/tesserati">Tesserati</NavLink>
                </div>
            </div>
        );
    }

}


export default Sidebar;

