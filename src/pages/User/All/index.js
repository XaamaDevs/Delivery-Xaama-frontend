//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

// Importing backend api
import api from "../../../services/api";


// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing React features
import { Button, Modal, Form, Row, Col, Spinner, Container, Alert } from "react-bootstrap";


//	Exporting resource to routes.js
export default function AllUsers({ userId }) {
	const [users, setUsers] = useState([]);
	const [userUpdateId, setUserUpdateId] = useState("");
	const [newType, setNewType] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");

	//	Modal settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [isLoading, setLoading] = useState(true);

	const history = useHistory();

	useEffect(() => {
		async function loadUser() {
			const response = await api.get("/user", {
				headers : { 
					authorization: userId
				}
			});
			setUsers(response.data);
			setLoading(false);
		}

		loadUser();
	}, []);

	async function handleTypeUser(event) {
		event.preventDefault();

		try {
			const response = await api.put("/company", {
				userUpdateId,
				type: newType,
				password: userPassword}, {
				headers : { 
					authorization: userId
				}
			});
			setTitle("Alterações usuário");
			setMessage("Alterações feitas com sucesso!");
			setColor("warning");
			setModalAlert(true);
			setModal1Show(false);
		} catch(error) {
			setTitle("Erro!");
			setColor("danger");
			
			if (error.response) {
				setMessage(error.response.data);
			} else {
				setMessage(error);
			}
			setModalAlert(true);
			setModal1Show(false);
		}

		setUserPassword("");
	}

	async function handleModal(event, modal, action, userId, newType) {
		event.preventDefault();

		if(action === "open") {
			setUserUpdateId(userId);
			setNewType(newType);
		}

		switch(modal){
		case 1:
			setModal1Show((action === "open") ? true : false);
			break;
		case 2:
			setModalAlert((action === "open") ? true : false);
			break;
		default:
			break;
		}
	}

	return (
		<div className="all-container w-100">
			{isLoading ?
				<Container className="d-flex h-100">
					<Spinner 
						className="my-5 mx-auto"
						style={{width: "5rem", height: "5rem"}} 
						animation="grow" 
						variant="warning"
					/>
				</Container>
				:
				<Row xs={1} sm={2} md={3} xl={4} className="d-flex justify-content-around m-auto w-100" >
					{users.map(user => (
						<Col key={user._id} className="user-item">
							<header>
								<img src={user.thumbnail ? user.thumbnail_url: camera } />
								<div className="user-info">
									<strong>{user.name}</strong>
									<span>{user.email}</span>
								</div>              
							</header>
							<p>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</p>
							<p>{user.address && user.address.length ? user.address.join(", ") : "Endereço não informado" }</p>
							<p>Mude o tipo do usuário. <strong>Cuidado ao promover um usuário a ADM!</strong></p>
							
							{ (userId == user._id) ?
								<Button
									onClick={() => history.push("/user")}
									variant="outline-warning ml-2">Perfil
								</Button>
								:
								<></>
							}

							{((userId != user._id) && (user.userType != 2)) ?
								<Button
									onClick={event => handleModal(event, 1, "open", user._id, 2)}
									variant="outline-danger ml-2">ADM
								</Button>
								:
								<></>
							}

							{((userId != user._id) && (user.userType != 1))?
								<Button
									onClick={event => handleModal(event, 1, "open", user._id, 1)}
									variant="outline-warning ml-2">Gerente
								</Button>
								:
								<></>
							}

							{((userId != user._id) && (user.userType != 0)) ?
								<button 
									onClick ={event => handleModal(event, 1, "open", user._id, 0)}
									className="btn ml-2" 
									id="btn-user" >Usuário
								</button>
								
								:
								<></>
							}
						</Col>
					))}
				</Row>
			}
			
			<Modal show={modal1Show} onHide={e => setModal1Show(false)} size="sm" centered>
				<Modal.Header closeButton>
					<Modal.Title>Modificar tipo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col>
								<Form.Group controlId="userPasswordO">
									<Form.Label>Senha</Form.Label>
									<Form.Control 
										value={userPassword}
										onChange={e => setUserPassword(e.target.value)} 
										type="password" 
										placeholder="Sua senha"
									/>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={e => setModal1Show(false)}>
						Fechar
					</Button>
					<Button variant="warning" type="submit" onClick={handleTypeUser}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modalAlert} onHide={e => history.go()}>
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
		</div>
	);
}