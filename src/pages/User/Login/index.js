//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Form, Button, Col, Row } from "react-bootstrap";

//	Importing website utils
import Push from "../../../components/Push";

//	Importing api to communicate to backend
import api from "../../../services/api";

//	Exporting resource to routes.js
export default function Login({ setUserId, setUser, order }) {
	//	Session variables
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	//	Message settings
	const [title, setTitle] = useState("");
	const [toastShow, setToastShow] = useState(false);
	const [message, setMessage] = useState("");

	//	Defining history to jump through pages
	const history = useHistory();

	// Configuring recaptcha
	const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

	useEffect(() => {
		const loadScriptByURL = (id, url, callback) => {
			const isScriptExist = document.getElementById(id);

			if (!isScriptExist) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url;
				script.id = id;
				script.onload = function () {
					if (callback) callback();
				};
				document.body.appendChild(script);
			}

			if (isScriptExist && callback) {
				callback();
			}
		};
		
		// load the script by passing the URL
		loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`);
	}, []);

	const handleOnClick = e => {
		e.preventDefault();
		window.grecaptcha.ready(() => {
			window.grecaptcha.execute(SITE_KEY, { action: "submit" }).then(token => {
				submitData(token);
			});
		});
	};

	const submitData = token => {
		// call a backend API to verify reCAPTCHA response

		var data = {
			email: email.toLowerCase(),
			password,
			recaptchaToken: token
		};

		api.post("session", data).then((response) => {
			if(response.status === 201) {
				sessionStorage.setItem("userId", response.data.token);

				setUserId(sessionStorage.getItem("userId"));
				setUser(response.data.user);
				//document.getElementsByClassName("grecaptcha-badge")[0].style = "visibility: hidden";

				history.push(order && order.products && order.products.length ? "/finishOrder" : "/menu");
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	};

	return (
		<div className="user-container d-flex h-100">
			<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
			<Form className="col-sm-3 py-3 m-auto text-white" onSubmit={handleOnClick}>
				<Form.Group controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						value={email}
						onChange={e => setEmail(e.target.value)}
						type="email"
						placeholder="email@provedor.com"
						autoFocus
						required
					/>
				</Form.Group>
				<Form.Group controlId="password">
					<Form.Label>Senha</Form.Label>
					<Form.Control
						value={password}
						onChange={e => setPassword(e.target.value)}
						type="password"
						placeholder="Senha"
						required
					/>
				</Form.Group>
				<Row className="my-1">
					<Col className="text-center">
						<small>Não tem conta? </small>
						<Link className="text-light" to="/signup">
							<small>Clique aqui</small>
						</Link>
						<small> para se cadastrar</small>
					</Col>
				</Row>
				<Row className="my-3">
					<Col className="text-center">
						<Button variant="warning" type="submit">
							Acessar
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	);
}

Login.propTypes = {
	setUserId : PropTypes.func.isRequired,
	setUser : PropTypes.func.isRequired,
	order : PropTypes.object
};