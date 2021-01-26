//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import { Button, Modal, Form, Row, Col, Spinner, Container, Image, Card, CardDeck } from "react-bootstrap";

//	Importing website utils
import Alert from "../../../components/Alert";
import Push from "../../../components/Push";

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

	//	Defining history to jump through pages
	const history = useHistory();

	//	Modal settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

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
		async function fetchData() {
			await api.get("userAll", {
				headers : {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
					setUsers(response.data);
					setupWebSocket();
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response.status === 400) {
					setMessage(error.response.data);
					setToastShow(true);
				} else if(error.response.status === 404) {
					setUsers([]);
				} else if(error.response.status === 500) {
					setMessage(error.message);
					setToastShow(true);
				} else {
					setMessage("Algo deu errado :(");
					setToastShow(true);
				}
			});

			setIsLoading(false);
		}

		fetchData();
	}, [userId]);

	async function handleTypeUser(event) {
		event.preventDefault();

		const data = {
			userUpdateId,
			type : newType,
			password : userPassword
		};

		await api.put("/companyUpdateUser", data, {
			headers : {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 200) {
				setModal1Show(false);
				setTitle("Alterações de usuário");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setModalAlert(true);
		});

		setUserPassword("");
	}

	return (
		<>
			<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
			{isLoading ?
				<Container className="d-flex h-100">
					<Spinner
						className="m-auto"
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
													src={user.thumbnail ? process.env.REACT_APP_API_URL + user.thumbnail_url: camera }
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
												{((user.userType !== 2)) ?
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

												{((user.userType !== 1) && (user.userType !== 2))?
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

												{(user.userType === 2) ?
													<Button
														onClick={() => {
															history.push("/user");
														}}
														variant="outline-warning"
													>
														Perfil
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

			<Alert.Close modalAlert={modalAlert} setModalAlert={setModalAlert} title={title} message={message} />
		</>
	);
}

AllUsers.propTypes = {
	userId : PropTypes.string.isRequired
};