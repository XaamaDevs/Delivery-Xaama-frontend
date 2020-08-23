//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

// Importing backend api
import api from "../../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing React features
import { Button, Modal, Form, Row, Col } from "react-bootstrap";


//	Exporting resource to routes.js
export default function AllUsers() {
	const [users, setUsers] = useState([]);
	const [userUpdateId, setUserUpdateId] = useState("");
	const [newType, setNewType] = useState("");
	const [userPassword, setUserPassword] = useState("");

	//	Modal settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modal2Show, setModal2Show] = useState(false);

	const userId = sessionStorage.getItem("userId");
	const history = useHistory();

	useEffect(() => {
		async function loadUser() {
			const response = await api.get("/user", {
				headers : { 
					authorization: userId
				}
			});
			setUsers(response.data);
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
			alert(response.data);
			setModal2Show(true);
			setModal1Show(false);
		} catch(error) {
			if (error.response) {
				alert(error.response.data);
			} else {
				alert(error);
			}
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
			setModal2Show((action === "open") ? true : false);
			break;
		default:
			break;
		}
	}

	return (
		<div id="all-container">
			<main>
				<ul>
					{users.map(user => (
						<li key={user._id} className="user-item">
							<header>
								<img src={user.thumbnail ? user.thumbnail_url: camera } />
								<div className="user-info">
									<strong>{user.name}</strong>
									<span>{user.email}</span>
								</div>              
							</header>
							<p>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</p>
							<p>{user.address && user.address.length ? user.address.join(", ") : "Endereço não informado" }</p>
							<p>Mude o tipo de cada usuário. <strong>Cuidado ao promover um usuário a ADM!</strong></p>
							{(user.userType != 2) ?
								<Button
									onClick={event => handleModal(event, 1, "open", user._id, 2)}
									variant="outline-danger ml-2">ADM
								</Button>
								:
								<></>
							}

							{(user.userType != 1)?
								<Button
									onClick={event => handleModal(event, 1, "open", user._id, 1)}
									variant="outline-warning ml-2">Gerente
								</Button>
								:
								<></>
							}

							{(user.userType != 0) ?
								<Button
									onClick={event => handleModal(event, 1, "open", user._id, 0)}
									variant="outline-warning ml-2">Usuário
								</Button>
								:
								<></>
							}
						</li>
					))}
				</ul>
			</main>
		
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

			<Modal show={modal2Show} onHide={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>Alterações usuário</Modal.Title>
				</Modal.Header>
				<Modal.Body>Alterações salvas com sucesso!</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={e => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}