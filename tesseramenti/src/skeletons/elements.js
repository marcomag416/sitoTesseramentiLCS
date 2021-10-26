import React from 'react';
import ReactDOM from 'react-dom';

/*class Testo extends React.Component {
    render() {
        return (
            <p>
                <font color={this.props.colore}>Questo testo cambia colore</font>
            </p>
        );
    }
}*/

function Testo(props) {
    return (
        <p>
            <font color={props.colore}>questo testo cambia colore</font>
        </p>
        );
}

function Testo2(props) {
    return (
        <p>
            <font color={props.colore}>questo è il testo 2</font>
        </p>
    );
}

export default Testo;