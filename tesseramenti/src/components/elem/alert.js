function Alert(props){
    var modeStyle;

    switch (props.mode){
        case "alert":
            modeStyle = "w3-pale-red w3-border-red ";
            break;
        case "success":
            modeStyle = "w3-pale-green w3-border-green ";
            break;
        case "warning":
            modeStyle = "w3-pale-yellow w3-border-yellow ";
            break;
        case "info":
        default:
            modeStyle = "w3-pale-blue w3-border-blue ";
    }

    return (
        <div className= {modeStyle + "w3-panel w3-leftbar"} >
            <p>{props.msg}</p>
        </div>
    );
}

export default Alert;