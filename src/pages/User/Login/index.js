//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import { Modal } from "react-bootstrap";

//	Importing api to communicate to backend
import api from "../../../services/api";

//	Exporting resource to routes.js
export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	//	Defining history to jump through pages
	const history = useHistory();

	//	Function to handle user login
	async function handleSubmit(event) {
		event.preventDefault();

		try {
			const response = await api.post("session", { email, password });

			sessionStorage.setItem("userId", response.data._id);
			
			history.push("/menu");
			history.go();
		} catch(error) {
			if (error.response) {
				alert(error.response.data);
			} else {
				alert(error);
			}
		}
	}

	if(!sessionStorage.getItem("userId")) {
		return (
			<div className="user-container d-flex h-100">
				<div className="col-sm-3 py-3 m-auto text-white">
					<form onSubmit={handleSubmit}>
						<div className="row my-1">
							<div className="col my-1">
								<label>Email: </label>
								<input 
									type="email" 
									className="form-control" 
									name="email" 
									placeholder="email@provedor.com" 
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</div>
						<div className="row my-1">
							<div className="col my-1">
								<label>Senha: </label>
								<input 
									type="password" 
									className="form-control" 
									name="password" 
									placeholder="Senha" 
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
						</div>
						<div className="row my-1">
							<div className="col text-center">
								<small>Não tem conta? </small>
								<Link className="text-light" to="/signup">
									<small>Clique aqui</small>
								</Link>
								<small> para se cadastrar</small>
							</div>
						</div>
						<div className="row my-3">
							<div className="col text-center">
								<input 
									type="submit" 
									className="btn btn-warning btn-md" 
									value="Acessar"
								/>
							</div>
						</div>
					</form>
				</div>
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
					<Link className="btn btn-primary" to="/">
						<small>Fechar</small>
					</Link>
				</Modal.Footer>
			</Modal>
		);
	}
}