import "./progressBar.css";

function ProgressBar(props){
    const lay3 = props.green + props.red + props.blue;
    const lay2 = (props.blue + props.green) / (props.green + props.red + props.blue) * 100;
    const lay1 = props.blue / (props.blue + props.red) * 100;

    return (
        <div class="w3-light-grey w3-round" style = {props.style}>
            <div class="bar w3-round w3-red" style={{width : lay3 + "%"}}>
                <div class="bar w3-round w3-green" style={{width : lay2 + "%"}}>
                    <div class="bar w3-round w3-blue" style={{width : lay1 + "%"}}></div>
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;