import './window.css';
import './topbar.css';


function Topbar(props) {
    var img;
    switch(props.info.lega){
        case 'Mole Cup':
            img = "PNG-lcs_molecup_T.png";
            break;
        case 'Duomo Cup':
            img = "PNG-lcs_duomocup_T.png";
            break;
        default:
            img = "PNG-lcs_logo_t.png";

    }
    return (
        <div className="w3-teal w3-bar">
            <div className="w3-container">
                <button className="w3-button w3-teal w3-xlarge w3-bar-item"
                    onClick={() => props.switchSidebar()}
                    /*style={this.props.sidebarOn ? { display: "none" } : {display : "inline-block"}}*/
                >{props.sidebarOn ? <i className="material-icons">close</i> : <i className="material-icons">menu</i>}</button>
            
                <span className="w3-bar-item"><h2> {props.title }</h2></span>
                <span className='w3-bar-item w3-right'>
                    <div className="w3-circle w3-white cont-img w3-center"><img src={img} alt="Logo"/></div>
                </span>
            </div>
        </div>
    );
}

export default Topbar;