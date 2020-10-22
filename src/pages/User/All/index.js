//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React features
import { Button, Modal, Form, Row, Col, Spinner, Container, Image, Card, CardDeck } from "react-bootstrap";

//	Importing website utils
import Alert from "../../Website/Alert";
import Push from "../../Website/Push";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

// Importing backend api
import api from "../../../services/api";

import {
	connect,
	disconnect,
	subscribeToNewUsers,
	subscribeToDeleteUsers,
	subscribeToUpdateUsers
} from "../../../services/websocket";

//	Exporting resource to routes.js
export default function AllUsers({ userId }) {
	const [users, setUsers] = useState([]);
	const [userUpdateId, setUserUpdateId] = useState("");
	const [newType, setNewType] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	//	Modal settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setLoading] = useState(true);

	async function setupWebSocket() {
		disconnect();
		connect();
	}

	useEffect(() => {
		subscribeToNewUsers(u => setUsers([...users, u]));
		subscribeToUpdateUsers(u => setUsers(u));
		subscribeToDeleteUsers(u => setUsers(u));
	}, [users]);

	useEffect(() => {
		async function loadUser() {
			await api.get("user", {
				headers : {
					authorization: userId
				}
			}).then((response) => {
				setUsers(response.data);
				setupWebSocket();
				setLoading(false);
			}).catch((error) => {
				setTitle("Alerta!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
		}

		loadUser();
	}, [userId]);

	async function handleTypeUser(event) {
		event.preventDefault();

		await api.put("/company", {
			userUpdateId,
			type: newType,
			password: userPassword
		}, {
			headers : {
				authorization: userId
			}
		}).then(() => {
			setModal1Show(false);
			setTitle("Alterações usuário");
			setMessage("Alterações feitas com sucesso!");
			setModalAlert(true);
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && typeof(error.response.data) !== "object") {
				setMessage(error.response.data);
			} else {
				setMessage(error.message);
			}
			setModalAlert(true);
			setModal1Show(false);
		});

		setUserPassword("");
	}

	return (
		<div className="all-container w-100">
			<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
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
				<CardDeck className="mx-3">
					<Row xs={1} sm={2} md={3} className="d-flex justify-content-around m-auto w-100" >
						{users.map(user => (
							<Col key={user._id} className="my-2">
								<Card text="white" bg="dark">
									<Card.Header>
										<Row>
											<Col className="d-flex flex-wrap align-items-center" sm="3">
												<Image
													className="w-100"
													style={{ borderRadius: "50%" }}
													src={user.thumbnail ? user.thumbnail_url: camera }
													alt="thumbnail"
													fluid
												/>
											</Col>
											<Col className="ml-3">
												<Row>
													<strong>{user.name}</strong>
												</Row>
												<Row>
													<span>{user.email}</span>
												</Row>
											</Col>
										</Row>
									</Card.Header>
									<Card.Body>
										<Card.Text>
											<p>
												{user.phone ? "Telefone: " + user.phone : "Telefone não informado"}
											</p>
											<p>
												{user.address && user.address.length ?
													"Endereço: " + user.address.join(", ")
													:
													"Endereço não informado"
												}
											</p>
											<div className="d-flex justify-content-between">
												{((userId !== user._id) && (user.userType !== 2)) ?
													<Button
														onClick={() => {
															setUserUpdateId(user._id);
															setNewType(2);
															setModal1Show(true);
														}}
														variant="outline-danger"
													>
														ADM
													</Button>
													:
													null
												}

												{((userId !== user._id) && (user.userType !== 1))?
													<Button
														onClick={() => {
															setUserUpdateId(user._id);
															setNewType(1);
															setModal1Show(true);
														}}
														variant="outline-warning"
													>
														Gerente
													</Button>
													:
													null
												}
											</div>
										</Card.Text>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</CardDeck>
			}

			<Modal show={modal1Show} onHide={() => setModal1Show(false)} size="sm" centered>
				<Modal.Header closeButton>
					<Modal.Title>Modificar tipo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Cuidado ao promover um usuário!
					<Form className="my-4" onSubmit={handleTypeUser}>
						<Form.Group controlId="userPassword">
							<Form.Label>Senha</Form.Label>
							<Form.Control
								value={userPassword}
								onChange={e => setUserPassword(e.target.value)}
								type="password"
								placeholder="Sua senha"
								required
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => setModal1Show(false)}>
						Fechar
					</Button>
					<Button variant="warning" type="submit" onClick={handleTypeUser}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

			<Alert.Close setModalAlert={setModalAlert} modalAlert={modalAlert} title={title} message={message} />
		</div>
	);
}

AllUsers.propTypes = {
	userId : PropTypes.string.isRequired
};