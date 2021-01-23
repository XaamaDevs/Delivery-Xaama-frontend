//	Importing React main module and its features
import React, { useState } from "react";
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
export default function Login({ setUserId, setUser }) {
	//	Session variables
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	//	Message settings
	const [title, setTitle] = useState("");
	const [toastShow, setToastShow] = useState(false);
	const [message, setMessage] = useState("");

	//	Defining history to jump through pages
	const history = useHistory();

	//	Function to handle user login
	async function handleUserLogin(event) {
		event.preventDefault();

		await api.post("session", {
			email: email.toLowerCase(),
			password
		}).then((response) => {
			if(response.status === 201) {
				sessionStorage.setItem("userId", response.data.token);

				setUserId(sessionStorage.getItem("userId"));
				setUser(response.data.user);

				history.push("/menu");
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	return (
		<div className="user-container d-flex h-100">
			<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
			<Form className="col-sm-3 py-3 m-auto text-white" onSubmit={handleUserLogin}>
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
	setUser : PropTypes.func.isRequired
};