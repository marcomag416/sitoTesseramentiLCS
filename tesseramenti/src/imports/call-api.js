import { React } from 'react';

function callBackend() {
    const path = "";
    const send = "ciao, come va?";
    var error = null;
    var msg = null;

    axios({
        method: 'post',
        url: path,
        headers: { 'content-type': 'application/json' },
        data: send
    })
        .then(result => {
            msg = result;
        })
        .catch(error => this.setState({ error: error.message }));
}

export default callBackend();