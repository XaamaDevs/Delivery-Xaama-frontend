//	Importing React main module and its features
import React, { useState, useMemo} from "react";

// Importing backend api
import api from "../../../services/api";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Modal, Image, Form, Button, Col, Row, Toast } from "react-bootstrap";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Signup({ setUserId, setUser }) {
	//	User variables
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordC, setPasswordC] = useState("");
	const [thumbnail, setThumbnail] = useState(null);
	
	//	Modal settings
	const [modalAlert, setModalAlert] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");

	//	User image preview
	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail) : null;
	}, [thumbnail]);

	//	Defining history to jump through pages
	const history = useHistory();

	//	Function to handle user signup
	async function handleUserSignup(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", name);
		data.append("email", email);
		data.append("password", password);
		data.append("passwordC", passwordC);
		data.append("thumbnail", thumbnail);

		await api.post("/user", data)
			.then((response) => {
				sessionStorage.setItem("userId", response.data._id);

				setUserId(sessionStorage.getItem("userId"));
				setUser(response.data);
	
				history.push("/menu");
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	//	Function to handle input image profile
	async function inputImage(event) {
		event.preventDefault();

		document.getElementById("inputThumbnail").click();
	}
	
	const toast = (
		<div
			aria-live="polite"
			aria-atomic="true"
			style={{
				position: "fixed",
				top: "inherit",
				right: "3%",
				zIndex: 5
			}}
		>
			<Toast show={toastShow} onClose={() => setToastShow(false)} delay={3000} autohide>
				<Toast.Header>
					<strong className="mr-auto">{title}</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>
	);

	return (
		<div className="user-container h-100">
			{toast}
			<Form className="d-flex flex-row flex-wrap h-100" onSubmit={handleUserSignup}>
				<Col sm="4" className="d-flex flex-column m-auto p-3">
					<Form.Group controlId="inputThumbnail">
						<Form.Label style={{color: "#ffffff" }}>Foto de perfil</Form.Label>
						<Form.Control 
							className="d-none"
							onChange={event => setThumbnail(event.target.files[0])} 
							type="file" 
							placeholder="email@provedor.com"
						/>
						<Image 
							id="thumbnail"
							className={thumbnail ? "btn border-0 m-auto" : "btn w-100 m-auto"}
							src={preview ? preview : camera}
							alt="Selecione sua imagem"
							onClick={inputImage}
							fluid
						/>
					</Form.Group>
				</Col>
				<Col sm="4" className="text-white m-auto p-3">
					<Form.Group controlId="name">
						<Form.Label>Nome</Form.Label>
						<Form.Control 
							placeholder="Seu nome"
							type="text"
							value={name}
							onChange={event => setName(event.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group controlId="email">
						<Form.Label>Email</Form.Label>
						<Form.Control 
							placeholder="Seu email"
							type="email"
							value={email}
							onChange={event => setEmail(event.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group controlId="password">
						<Form.Label>Senha</Form.Label>
						<Form.Control 
							placeholder="Senha"
							type="password"
							value={password}
							onChange={event => setPassword(event.target.value)}
							pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
							required
						/>
						<small style={{color:"#f0d890"}}>Sua senha deve ter no mínimo oito caracteres, pelo menos uma letra e um número</small>
					</Form.Group>
					<Form.Group controlId="passwordC">
						<Form.Label>Confirmar Senha</Form.Label>
						<Form.Control 
							placeholder="Confirme sua senha"
							type="password"
							value={passwordC}
							onChange={event => setPasswordC(event.target.value)}
							pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
							required
						/>
					</Form.Group>
					<Row className="my-1">
						<Col className="text-center">
							<small>Já tem conta? </small>
							<Link className="text-light" to="/login">
								<small>Clique aqui</small>
							</Link>
							<small> para acessar</small>
						</Col>
					</Row>
					<Row className="my-3">
						<Col className="text-center">
							<Button variant="warning" type="submit">
								Cadastrar
							</Button>
						</Col>
					</Row>
				</Col>
			</Form>

			<Modal show={modalAlert} onClick={() => setModalAlert(false)}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant={color} onClick={() => setModalAlert(false)}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}