import { useState, useEffect } from "react";
import axios from 'axios';
import { API_BASE } from '../config/config.js';


export async function fetch(url, sendData){
	var path = API_BASE + url;

	const data = new Promise(function (resolve) {
		//console.log("Use fetch..."+sendData);
		axios({
			mode: "no-cors",
			method: 'post',
			url: path,
			headers: { 'content-type': 'application/json' },
			data: sendData
		})
			.then(result => {
				if (result.data.status) {
					resolve(result.data);
				}
				else {
					resolve({
						msg: result.data.msg,
						err: true
					});
				}
			})
			.catch(error => {
				resolve({
					msg: "Errore connessione con il server",
					err: true
				});

				if (error.message) {
					console.log(error.message);
				}
				if (error.response) {
					console.log(error.response.headers, error.response.status, error.response.data);
				}
			});
	});

	return data;
}

export const useFetch = (url, sendData) => {
	const [data, setData] = useState({status:true});

	var path = API_BASE + url;

	useEffect(() => {
		axios({
			mode: "no-cors",
			method: 'post',
			url: path,
			headers: { 'content-type': 'application/json' },
			data: sendData
		})
			.then(result => {
				//console.log("Use fetch...", path);
				if (result.data.status) {
					setData(result.data);
				}
				else {
					//console.log("Errore:", result.data);
					setData({
						msg: result.data.msg,
						err: true
					});
				}
			})
			.catch(error => {
				setData({
					msg: "Errore connessione con il server",
					err: true
				});

				if (error.message) {
					console.log(error.message);
				}
				if (error.response) {
					console.log(error.response.headers, error.response.status, error.response.data);
				}
			});
    }, []);

    return [data];
};

export async function fetchPost(url, token, sendData, file){
	var path = API_BASE + url;

	const formData = new FormData();
	for (let name in sendData) {
		formData.append(name, sendData[name]);
	}
	formData.append("token", token);

    formData.forEach((x, index) =>{console.log(index, x)});

	const data = new Promise(function (resolve) {
		axios.post(path, formData).then(result => {
				if (result.data.status) {
					resolve(result.data);
				}
				else {
					resolve({
						msg: result.data.msg,
						err: true
					});
				}
			})
			.catch(error => {
				resolve({
					msg: "Errore connessione con il server",
					err: true
				});

				if (error.message) {
					console.log(error.message);
				}
				if (error.response) {
					console.log(error.response.headers, error.response.status, error.response.data);
				}
			});
	});

	return data;
}

export default useFetch;