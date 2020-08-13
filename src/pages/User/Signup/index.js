//	Importing React main module and its features
import React, { useState, useMemo} from "react";

// Importing backend api
import api from "../../../services/api";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import { Modal } from "react-bootstrap";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordC, setPasswordC] = useState("");
	const [thumbnail, setThumbnail] = useState(null);

	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail) : null;
	}, [thumbnail]);

	const history = useHistory();

	//	Function to handle user signup
	async function handleSubmit(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", name);
		data.append("email", email);
		data.append("password", password);
		data.append("passwordC", passwordC);
		data.append("thumbnail", thumbnail);

		try {
			const response = await api.post("/user", data);
			
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

	//	Function to handle input image profile
	async function inputImage(event) {
		event.preventDefault();

		const input = document.getElementsByTagName("input")[0].click();
	}

	if(!sessionStorage.getItem("userId")) {
		return (
			<div className="user-container h-100">
				<form className="d-flex flex-row flex-wrap h-100" onSubmit={handleSubmit}>
					<div className="d-flex col-sm-4 flex-column m-auto p-3 h-50">
						<label>Foto de perfil</label>
						<input
							type="file"
							className="d-none"
							onChange={event => setThumbnail(event.target.files[0])}
						/>
						<img 
							id="thumbnail"
							className={thumbnail ? "has-thumbnail border-0 m-auto" : "h-100 w-100 m-auto"}
							src={preview ? preview : camera} alt="Selecione sua imagem"
							onClick={inputImage}
						/>
					</div>

					<div className="col-sm-4 text-white m-auto p-3">
						<div className="form-group">
							<label htmlFor="name">Nome</label>
							<input
								type="text"
								className="form-control"
								id="name"
								placeholder="Seu nome"
								value={name}
								onChange={event => setName(event.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input type="email" className="form-control" id="email" placeholder="Seu email"
								required value={email} onChange={event => setEmail(event.target.value)}/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Senha</label>
							<input type="password" className="form-control" id="password" placeholder="Senha"
								required value={password} onChange={event => setPassword(event.target.value)}/>
						</div>
						<div className="form-group">
							<label htmlFor="passwordC">Confirmar Senha</label>
							<input type="password" className="form-control" id="passwordC" placeholder="Confirme sua senha"
								required value={passwordC} onChange={event => setPasswordC(event.target.value)}/>
						</div>
						<div className="form-group">
							<div className="col text-center">
								<small>Já tem conta? </small>
								<Link className="text-light" to="/login">
									<small>Clique aqui</small>
								</Link>
								<small> para acessar</small>
							</div>
						</div>
						<button type="submit" className="btn btn-warning mt-2">Cadastrar</button>
					</div>
				</form>
			</div>
		);
	} else {
		return (
			<Modal show={true}>
				<Modal.Header>
					<Modal.Title>Aviso</Modal.Title>
				</Modal.Header>
				<Modal.Body>Saia de sua conta para fazer um novo cadastro!</Modal.Body>
				<Modal.Footer>
					<Link className="btn btn-primary" to="/">
						<small>Fechar</small>
					</Link>
				</Modal.Footer>
			</Modal>
		);
	}
}