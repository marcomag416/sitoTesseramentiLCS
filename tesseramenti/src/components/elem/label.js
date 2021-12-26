import { useMemo, memo } from "react";

function Label(props){
    const getColorStyle = useMemo(() => {
        switch(props.mode){
            case "r":
                return " w3-pale-red w3-border-red";
            case "b":
                return " w3-pale-blue w3-border-blue";
            case "g":
                return " w3-pale-green w3-border-green";
            default:
                return " ";
        }
    }, [props.mode]);

    const getShow = useMemo(() => {
        switch(props.mode){
            case "r":
            case "b":
            case "g":
                return true;
            default:
                return false;
        }
    }, [props.mode]);

    return(
        <div className = {"w3-panel w3-leftbar w3-display-container w3-margin " + getColorStyle}  style={getShow ? { display: 'block' } : { display: 'none' }}>
            <span onClick={() => props.onClose()}
                className="w3-button w3-display-topright">&times;
            </span>
            <p><i>{props.msg}</i></p>
        </div>
    );
}

export default memo(Label);