import React from 'react';
//import ReactDOM from 'react-dom';

function LoadIcon(props) {
    return (
        <div style ={setStyle(props)} className="w3-modal">
            <div className="w3-display-middle">
                <p><i className="fa fa-spinner w3-spin " style={{ fontSize: '64px' }}></i></p>
            </div>
        </div>
    );
}

function setStyle(props) {
    if (props.show === true) {
        return { display: "block" };
    }
    else {
        return { display: "none" };
    }
}


export default LoadIcon;