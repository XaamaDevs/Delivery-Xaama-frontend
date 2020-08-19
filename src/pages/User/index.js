//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import Image from "react-bootstrap/Image";
import { Card, ListGroup, Button, Form, Col, Row, Modal } from "react-bootstrap";

// Importing backend api
import api from "../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../assets/camera.svg";


//	Exporting resource to routes.js
export default function User() {
	const [user, setUser] = useState([]);
	const [thumbnail, setThumbnail] = useState(null);
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPhone, setUserPhone] = useState("");
	const [userAddress, setUserAddress] = useState([]);
	const [userPassword, setUserPassword] = useState("");
	const [userPasswordO, setUserPasswordO] = useState("");
	const [userPasswordN, setUserPasswordN] = useState("");
	
	//	Modal settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modal2Show, setModal2Show] = useState(false);
	const [modal3Show, setModal3Show] = useState(false);
	const [modal4Show, setModal4Show] = useState(false);

	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		async function loadUser() {
			const response = await api.get("/user/" + userId);
			setUser(response.data);
		}

		loadUser();
	}, []);

	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail) : null;
	}, [thumbnail]);

	//	Function to handle input image profile
	async function inputImage(event) {
		event.preventDefault();
	
		const input = document.getElementsByTagName("input")[0].click();
	}
	
	const history = useHistory();

	//	Function to handle add image profile
	async function handleSubmit(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", user.name);
		data.append("email", user.email);
		data.append("thumbnail", thumbnail);

		try {
			const response = await api.put("/user", data , {
				headers : { 
					authorization: user._id
				}
			});
			alert(response.data);
			history.go();
		} catch(error) {
			if (error.response) {
				alert(error.response.data);
			} else {
				alert(error);
			}
		}
	}

	async function handleUserUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", userName);
		data.append("email", userEmail);
		data.append("address", userAddress);
		data.append("phone", userPhone);

		
		const response = await api.put("/user/" , data,  {
			headers : { 
				authorization: userId
			}})
			.then((response) => {
				setModal3Show(true);
				setModal1Show(false);
			}).catch((error) => {
				if(error.response) {
					alert(error.response.data);
				} else {
					alert(error);
				}
			});
	}

	async function handlePasswordUpdate(event) {
		event.preventDefault();

		if(userPasswordO && userPasswordO.length && userPasswordN && userPasswordN.length) {

			const data = new FormData();

			data.append("name", userName);
			data.append("email", userEmail);
			data.append("address", userAddress);
			data.append("phone", userPhone);
			data.append("passwordN", userPasswordN);
			data.append("passwordO", userPasswordO);

			const response = await api.put("/user/" , data,  {
				headers : { 
					authorization: userId
				}})
				.then((response) => {
					setModal3Show(true);
					setModal2Show(false);
				}).catch((error) => {
					if(error.response) {
						alert(error.response.data);
					} else {
						alert(error);
					}
				});
		} else {
		
			alert("Atençao! Sua senha atual ou senha nova está vazia!");
		}
		
	}

	async function handleUserDelete(event) {
		event.preventDefault();

		console.log(userPassword);
		console.log(userId);

		if(userPassword && userPassword.length) {

			const data = new FormData();

			data.append("password", userPassword);

			const response = await api.delete("/user", data, {
				headers : { 
					authorization: userId
				}})
				.then((response) => {
					setModal4Show(false);
					history.push("/");
					history.go();
					alert(response.data);
				}).catch((error) => {
					if(error.response) {
						alert(error.response.data);
					} else {
						alert(error);
					}
				});
		} else {
		
			alert("Atençao! Sua senha está vazia!");
		}
		
	}
	
	async function handleModal(event, modal, action, user = null) {
		event.preventDefault();

		if(action === "open") {
			setUserName(user.name);
			setUserEmail(user.email);
			setUserPhone(user.phone);
			setUserAddress(user.address.join(", "));
		}

		switch(modal){
			case 1:
				setModal1Show((action === "open") ? true : false);
				break;
			case 2:
				setModal2Show((action === "open") ? true : false);
				break;
			case 3:
				setModal3Show((action === "open") ? true : false);
				break;
			case 4:
				setModal4Show((action === "open") ? true : false);
				break;
		}
	}


	return (
		<div className="user-container h-100">
			<div className="d-flex flex-row flex-wrap h-100">
				<div className="col-sm-4 m-auto p-3">
					{user.thumbnail ?
						<>
							<form onSubmit={handleSubmit}>
								<Image src={user.thumbnail_url} rounded fluid/>
								<br/> <br/>
								<Button type="submit" variant="outline-warning">Trocar foto</Button>{" "}
								<Button type="submit" variant="outline-danger">Apagar foto</Button>
							</form>
						</>
						:
						<form className="d-flex flex-row flex-wrap h-100" onSubmit={handleSubmit}>
							<input
								type="file"
								className="d-none"
								onChange={event => setThumbnail(event.target.files[0])}
							/>
							<img 
								id="thumbnail"
								className={thumbnail ? "has-thumbnail img-fluid border-0 m-auto" : "h-100 w-100 m-auto"}
								src={preview ? preview : camera} alt="Selecione sua imagem"
								onClick={inputImage}
							/>
							<Button 
								style={{position:"absolute", top:"95%", left:"30%"}} 
								className="mt-4" 
								type="submit" 
								variant="outline-warning" >Adicionar foto
							</Button>
						</form>
					}
				</div>
				<div className="col-sm-4 m-auto p-3">
					<Card style={{ width: "23rem" }}>
						<Card.Header>{user.name}</Card.Header>
						<ListGroup variant="flush">
							<ListGroup.Item>{user.email}</ListGroup.Item>
							<ListGroup.Item>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</ListGroup.Item>
							<ListGroup.Item>{user.address && user.address.length ? user.address.join(", ") : "Endereço:" }</ListGroup.Item>
						</ListGroup>
					</Card>
					<br/>
					{user.userType != 2 ?
						<>
							<Button 
								variant="outline-warning"
								onClick ={event => handleModal(event, 1, "open", user)}>Editar perfil
							</Button> {" "}
							<button 
								onClick ={event => handleModal(event, 2, "open", user)}
								className="btn" 
								id="btn-password" >Trocar senha
							</button> {" "}
							<Button
								onClick = {event => handleModal(event, 4, "open", user)}
								variant="outline-danger">Apagar perfil
							</Button>
						</>
						:
						<>
							<Button 
								variant="outline-warning" 
								onClick ={event => handleModal(event, 1, "open", user)} >Editar perfil
							</Button> {" "}
							<Button 
								variant="outline-danger"
								onClick ={event => handleModal(event, 2, "open", user)}>Trocar senha
							</Button> {" "}
						</>
					}
				</div>
			</div>
			<Modal show={modal1Show} onHide={e => setModal1Show(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Modificar usuário</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col>
								<Form.Group controlId="userName">
									<Form.Label>Nome</Form.Label>
									<Form.Control 
										value={userName}
										onChange={e => setUserName(e.target.value)} 
										type="text" 
										placeholder="Nome de usuário"
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId="userEmail">
									<Form.Label>Email</Form.Label>
									<Form.Control 
										value={userEmail}
										onChange={e => setUserEmail(e.target.value)} 
										type="text" 
										placeholder="Seu email"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group controlId="userPhone">
									<Form.Label>Telefone</Form.Label>
									<Form.Control 
										value={userPhone}
										onChange={e => setUserPhone(e.target.value)} 
										type="text" 
										placeholder="(__) _ ____-____"
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId="userAddress">
									<Form.Label>Endereço</Form.Label>
									<Form.Control 
										value={userAddress}
										onChange={e => setUserAddress(e.target.value)} 
										type="text" 
										placeholder="Bairro, Rua, Número"
									/>
								</Form.Group>
								<Form.Text className="text-muted">Separe o bairro, rua e o número por vírgula
								</Form.Text>
							</Col>
						</Row>
						
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={e => setModal1Show(false)}>
						Fechar
					</Button>
					<Button variant="warning" type="submit" onClick={handleUserUpdate}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modal2Show} onHide={e => setModal2Show(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Modificar senha</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col>
								<Form.Group controlId="userPasswordO">
									<Form.Label>Senha atual</Form.Label>
									<Form.Control 
										value={userPasswordO}
										onChange={e => setUserPasswordO(e.target.value)} 
										type="password" 
										placeholder="Senha atual"
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId="userPasswordN">
									<Form.Label>Senha nova</Form.Label>
									<Form.Control 
										value={userPasswordN}
										onChange={e => setUserPasswordN(e.target.value)} 
										type="password" 
										placeholder="Senha nova"
									/>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={e => setModal2Show(false)}>
						Fechar
					</Button>
					<Button variant="warning" type="submit" onClick={handlePasswordUpdate}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modal3Show} onHide={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>Alterações usuário</Modal.Title>
				</Modal.Header>
				<Modal.Body>Alterações salvas com sucesso!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modal4Show} onHide={e => setModal4Show(false)} size="sm" centered>
				<Modal.Header closeButton>
					<Modal.Title>Apagar perfil</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col>
								<Form.Group controlId="userPassword">
									<Form.Label>Senha atual</Form.Label>
									<Form.Control 
										value={userPassword}
										onChange={e => setUserPassword(e.target.value)} 
										type="password" 
										placeholder="Senha atual"
									/>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={e => setModal4Show(false)}>
						Fechar
					</Button>
					<Button variant="warning" type="submit" onClick={handleUserDelete}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}