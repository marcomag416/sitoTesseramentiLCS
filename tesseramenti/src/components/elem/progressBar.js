import "./progressBar.css";
import {useState, useEffect} from 'react';


function ProgressBar(props){
    const [rate, setRate] = useState(0);
    const lay3 = props.green + props.red + props.blue;
    const lay2 = (props.blue + props.green) / (props.green + props.red + props.blue) * 100;
    const lay1 = props.blue / (props.blue + props.red) * 100;

    useEffect(() => {
        var id = setInterval(() => {
            if(rate < 1)
                setRate(rate + 0.02);
        }, 4);
        return () => {
            clearInterval(id);
        }
    })

    return (
        <div class="w3-light-grey w3-round" style = {props.style}>
            <div class="bar w3-round w3-red" style={{width : rate * lay3 + "%"}}>
                <div class="bar w3-round w3-green" style={{width : rate * lay2 + "%"}}>
                    <div class="bar w3-round w3-blue" style={{width : rate * lay1 + "%"}}></div>
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;