import './window.css';


function Topbar(props) {
    return (
        <div className="w3-teal w3-bar">
            <div className="w3-container">
                <button className="w3-button w3-teal w3-xlarge w3-bar-item"
                    onClick={() => props.switchSidebar()}
                    /*style={this.props.sidebarOn ? { display: "none" } : {display : "inline-block"}}*/
                >{props.sidebarOn ? <i className="material-icons">close</i> : <i className="material-icons">menu</i>}</button>
            
                <span className="w3-bar-item"><h2> {props.title }</h2></span>
            </div>
        </div>
    );
}

export default Topbar;