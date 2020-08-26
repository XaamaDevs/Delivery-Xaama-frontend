//	Importing React main module and its features
import React, { useState, useMemo } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import { Card, Image, Button, Form, Col, Row, Modal } from "react-bootstrap";

// Importing backend api
import api from "../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../assets/camera.svg";


//	Exporting resource to routes.js
export default function User({ userId, setUserId, user, setUser }) {
	//	User variables
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPhone, setUserPhone] = useState("");
	const [userAddress, setUserAddress] = useState([]);
	const [userPasswordO, setUserPasswordO] = useState("");
	const [userPasswordN, setUserPasswordN] = useState("");
	const [thumbnail, setThumbnail] = useState(null);
	
	//	Message settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modal2Show, setModal2Show] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [modal4Show, setModal4Show] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");
	
	//	Defining history to jump through pages
	const history = useHistory();

	//	User image preview
	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail): null;
	}, [thumbnail]);

	//	Function to handle input image profile
	async function inputImage(event) {
		event.preventDefault();
	
		document.getElementById("inputImage").click();
	}

	//	Function to handle update image profile
	async function handleThumbnailUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", user.name);
		data.append("email", user.email);
		data.append("address", userAddress);
		data.append("phone", userPhone);

		if(thumbnail){
			data.append("thumbnail", thumbnail);
		} else {
			if(user.thumbnail) {
				const blob = await fetch(user.thumbnail_url).then(r => r.blob());
				const token = user.thumbnail_url.split(".");
				const extension = token[token.length-1];
				setThumbnail(new File([blob], "thumbnail." + extension));
				data.append("thumbnail", new File([blob], "thumbnail." + extension));
			}
				
		}

		await api.put("user", data , {
			headers : { 
				authorization: userId
			}})
			.then((response) => {
				setTitle("Alterações usuário");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	//	Function to handle delete image profile
	async function handleThumbnailDelete(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", user.name);
		data.append("email", user.email);
		data.append("thumbnail", thumbnail);

		await api.put("user", data , {
			headers : { 
				authorization: userId
			}})
			.then(() => {
				setTitle("Alterações usuário");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	async function handleUserUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", userName);
		data.append("email", userEmail);
		data.append("address", userAddress);
		data.append("phone", userPhone);
		
		await api.put("user" , data,  {
			headers : { 
				authorization: userId
			}})
			.then(() => {
				setTitle("Alterações usuário");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalAlert(true);
				setModal1Show(false);
			}).catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
				setModal1Show(false);
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

			await api.put("user" , data,  {
				headers : { 
					authorization: userId
				}})
				.then(() => {
					setTitle("Alteração senha");
					setMessage("Alteração feita com sucesso!");
					setColor("warning");
					setModalAlert(true);
					setModal2Show(false);
				}).catch((error) => {
					setTitle("Erro!");
					setColor("danger");

					if(error.response) {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setModalAlert(true);
					setModal1Show(false);
				});
		} else {
			setTitle("Alteração senha");
			setMessage("Atençao! Sua senha atual ou senha nova está vazia!");
			setColor("warning");
			setModalAlert(true);
			setModal2Show(false);
		}
		
		setUserPasswordO("");
		setUserPasswordN("");
	}

	async function handleUserDelete(event) {
		event.preventDefault();

		await api.delete("user", {
			headers : { 
				authorization: userId
			}})
			.then((response) => {
				sessionStorage.removeItem("userId");

				setUserId(sessionStorage.getItem("userId"));
				setUser({});

				setModal4Show(false);
				setTitle("Alteração usuário");
				setMessage(response.data);
				setColor("warning");
				setModalAlert(true);
				history.push("/");
				
			}).catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
				setModal4Show(false);
			});
	}
	
	async function handleModal(event, modal, action, user = null) {
		event.preventDefault();

		if(action === "open") {
			setUserName(user.name);
			setUserEmail(user.email);
			setUserPhone(user.phone);
			setUserAddress(user.address ? user.address.join(", ") : null);
		}

		switch(modal){
		case 1:
			setModal1Show((action === "open") ? true : false);
			break;
		case 2:
			setModal2Show((action === "open") ? true : false);
			break;
		case 3:
			setModalAlert((action === "open") ? true : false);
			break;
		case 4:
			setModal4Show((action === "open") ? true : false);
			break;
		default:
			break;
		}
	}

	return (
		<div className="user-container h-100">
			<div className="d-flex flex-row flex-wrap h-100">
				<div className="col-sm-4 m-auto p-3">
					<Form className="d-flex flex-column" onSubmit={handleThumbnailUpdate}>
						<Form.Control
							id="inputImage"
							className="d-none"
							type="file"
							onChange={event => setThumbnail(event.target.files[0])}
							required
						/>
						<Image 
							id="thumbnail"
							className={user.thumbnail || preview ? "border-0 m-auto" : "w-100 m-auto"}
							src={preview ? preview : (user.thumbnail ? user.thumbnail_url : camera)} 
							alt="Selecione sua imagem"
							onClick={inputImage}
							rounded
							fluid
						/>
						{user.thumbnail ?
							<div className="d-flex justify-content-center flex-wrap my-auto">
								<Button 
									className="mt-2 mx-2"
									onClick={handleThumbnailUpdate} 
									type="submit" 
									variant="outline-warning" 
								>
									Trocar foto
								</Button>
								<Button 
									className="mt-2 mx-2"
									onClick={handleThumbnailDelete} 
									type="submit" 
									variant="outline-danger"
								>
									Apagar foto
								</Button>
							</div>
							:
							<div className="d-flex">
								<Button 
									className="my-3 mx-auto" 
									type="submit" 
									variant="outline-warning"
								>
									Adicionar foto
								</Button>
							</div>
						}
					</Form>
				</div>
				<div id="user-i" className="col-sm-4 p-3">
					<Card bg="dark" >
						<Card.Header >{user.name}</Card.Header>
						<Card.Body>
							<Card.Text>{user.email}</Card.Text>
							<Card.Text>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</Card.Text>
							<Card.Text>{user.address && user.address.length ? user.address.join(", ") : "Endereço:" }</Card.Text>
						</Card.Body>
					</Card>
					<Row className="d-flex justify-content-around flex-row flex-wrap my-2">
						<Button 
							variant="outline-warning"
							onClick={event => handleModal(event, 1, "open", user)}
						>
							Editar perfil
						</Button>
						<Button 
							onClick ={event => handleModal(event, 2, "open", user)}
							className="btn" 
							id="btn-password"
						>
							Trocar senha
						</Button>
						<Button
							onClick = {event => handleModal(event, 4, "open", user)}
							variant="outline-danger"
						>
							Apagar perfil
						</Button>
					</Row>
					{user.userType === 1 || user.userType === 2 ?
						<Row className="d-flex justify-content-around flex-row flex-wrap my-2">
							<Button
								onClick={() => history.push("/allorders")}
								className="btn" 
								id="btn-password"
							>
								Listar todos pedidos
							</Button>
							{user.userType === 2 ?
								<button 
									onClick={() => history.push("/allusers")}
									className="btn" 
									id="btn-password"
								>
									Listar todos usuários
								</button>
								:
								null
							}
						</Row>
						:
						null
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

			<Modal show={modalAlert} onClick={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant={color} onClick={e => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modal4Show} onHide={e => setModal4Show(false)} size="sm" centered>
				<Modal.Header closeButton>
					<Modal.Title>Apagar perfil</Modal.Title>
				</Modal.Header>
				<Modal.Body>Tem certeza que deseja excluir seu perfil? :/</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={e => setModal4Show(false)}>
						Cancelar
					</Button>
					<Button variant="danger" type="submit" onClick={handleUserDelete}>
						Apagar Perfil
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}