//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Modal, Form, Button, Col, Row } from "react-bootstrap";

//	Importing api to communicate to backend
import api from "../../../services/api";

//	Exporting resource to routes.js
export default function Login({ userId, setUserId }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");

	//	Modal settings
	const [modalAlert, setModalAlert] = useState(false);
	
	//	Defining history to jump through pages
	const history = useHistory();

	//	Function to handle user login
	async function handleUserLogin(event) {
		event.preventDefault();

		await api.post("session", { email, password })
			.then((response) => {
				sessionStorage.setItem("userId", response.data._id);

				setUserId(sessionStorage.getItem("userId"));
				
				history.push("/menu");
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
			
				setModalAlert(true);
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error);
				}
				setModalAlert(true);
			});
	}

	if(!userId) {
		return (
			<div className="user-container d-flex h-100">
				<Form className="col-sm-3 py-3 m-auto text-white" onSubmit={handleUserLogin}>
					<Form.Group controlId="email">
						<Form.Label>Email</Form.Label>
						<Form.Control 
							value={email}
							onChange={event => setEmail(event.target.value)} 
							type="email" 
							placeholder="email@provedor.com"
							required
						/>
					</Form.Group>
					<Form.Group controlId="password">
						<Form.Label>Senha</Form.Label>
						<Form.Control 
							value={password}
							onChange={event => setPassword(event.target.value)} 
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
				<Modal show={modalAlert} onClick={e => setModalAlert(false)}>
					<Modal.Header closeButton>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{message}</Modal.Body>
					<Modal.Footer>
						<Button variant={color} onClick={e => setModalAlert(false)}>
							Fechar
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	} else {
		return (
			<Modal show={true}>
				<Modal.Header>
					<Modal.Title>Aviso</Modal.Title>
				</Modal.Header>
				<Modal.Body>Você já está logado!</Modal.Body>
				<Modal.Footer>
					<Link className="btn btn-warning" to="/">
						<small>Fechar</small>
					</Link>
				</Modal.Footer>
			</Modal>
		);
	}
}