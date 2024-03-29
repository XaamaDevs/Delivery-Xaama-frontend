//	Importing React main module and its features
import React, { useState, useMemo} from "react";
import PropTypes from "prop-types";

// Importing backend api
import api from "../../../services/api";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Image, Form, Button, Col, Row, Container } from "react-bootstrap";

//	Importing website utils
import Push from "../../../components/Push";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Signup({ setUserId, setUser, order }) {
	//	User variables
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordC, setPasswordC] = useState("");
	const [thumbnail, setThumbnail] = useState(null);

	//	Message settings
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	//	User image preview
	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail) : null;
	}, [thumbnail]);

	//	Defining history to jump through pages
	const history = useHistory();

	//  Deleting recaptcha
	document.getElementById("recaptcha-key") ? 	document.getElementById("recaptcha-key").remove() : null;
	const element = document.getElementsByClassName("grecaptcha-badge")[0];
	element && element.parentNode ? element.parentNode.removeChild(element) : null;

	//	Function to handle user signup
	async function handleUserSignup(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", name);
		data.append("email", email.toLowerCase());
		data.append("password", password);
		data.append("passwordC", passwordC);
		data.append("thumbnail", thumbnail);

		await api.post("user", data)
			.then((response) => {
				if(response.status === 201) {
					sessionStorage.setItem("userId", response.data.token);

					setUserId(sessionStorage.getItem("userId"));
					setUser(response.data.user);

					history.push(order && order.products && order.products.length ? "/finishOrder" : "/menu");
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && error.response.status === 400) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 500) {
					setMessage(error.message);
				} else {
					setMessage("Algo deu errado :(");
				}
				setToastShow(true);
			});
	}

	return (
		<Container className="m-auto" fluid>
			<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
			<Form className="d-flex flex-row flex-wrap" onSubmit={handleUserSignup}>
				<Col className="text-white d-flex flex-column m-auto p-3" lg="4" md="7" sm="12">
					<Form.Group controlId="inputImage">
						<Form.Label>Foto de perfil</Form.Label>
						<Form.Control
							className="d-none"
							type="file"
							accept="image/*"
							onChange={(e) => setThumbnail(e.target.files[0])}
						/>
						<Image
							id={preview ? "thumbnail" : "camera"}
							className={preview ? "btn border-0 m-auto" : "btn w-100 m-auto"}
							src={preview ? preview : camera}
							alt="Selecione sua imagem"
							onClick={() => document.getElementById("inputImage").click()}
							rounded
							fluid
						/>
					</Form.Group>
				</Col>
				<Col className="text-white m-auto p-3" lg="4" md="5" sm="12">
					<Form.Group controlId="name">
						<Form.Label>Nome</Form.Label>
						<Form.Control
							placeholder="Seu nome"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoFocus
							required
						/>
					</Form.Group>
					<Form.Group controlId="email">
						<Form.Label>Email</Form.Label>
						<Form.Control
							placeholder="Seu email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group controlId="password">
						<Form.Label>Senha</Form.Label>
						<Form.Control
							placeholder="Senha"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
							required
						/>
						<small>Sua senha deve ter no mínimo oito caracteres, pelo menos uma letra e um número</small>
					</Form.Group>
					<Form.Group controlId="passwordC">
						<Form.Label>Confirmar Senha</Form.Label>
						<Form.Control
							placeholder="Confirme sua senha"
							type="password"
							value={passwordC}
							onChange={(e) => setPasswordC(e.target.value)}
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
		</Container>
	);
}

Signup.propTypes = {
	setUserId: PropTypes.func.isRequired,
	setUser: PropTypes.func.isRequired,
	order: PropTypes.object
};
