//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React features
import {
	Card,
	Button,
	Modal,
	Row,
	Col,
	Spinner,
	Container,
	Image,
	Form
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../Website/Alert";
import Push from "../../Website/Push";
import ProductDeck from "../../Website/ProductDeck";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

// Importing backend api
import api from "../../../services/api";

import {
	connect,
	disconnect,
	subscribeToNewOrders,
	subscribeToUpdateOrders,
	subscribeToDeleteOrders
} from "../../../services/websocket";

//	Exporting resource to routes.js
export default function AllOrders({ userId }) {
	const [orders, setOrders] = useState([]);
	const [orderA, setOrderA] = useState({});
	const [product, setProduct] = useState({});
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [feedback, setFeedback]= useState("");
	const [userPasswordOnDelete, setUserPasswordOnDelete] = useState("");

	//	Modal settings
	const [modalOrderListing, setModalOrderListing] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [modalFeedback, setModalFeedback] = useState(false);
	const [modalDeleteOrder, setModalDeleteOrder] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setLoading] = useState(true);

	function setupWebSocket() {
		disconnect();
		connect();
	}

	useEffect(() => {
		subscribeToNewOrders(o => setOrders([...orders, o]));
		subscribeToUpdateOrders(o => setOrders(o));
		subscribeToDeleteOrders(o => setOrders(o));
	}, [orders]);

	useEffect(() => {
		async function loadOrder() {
			await api.get("order", {
				headers : {
					authorization: userId
				}
			}).then((response) => {
				setOrders(response.data);
				setupWebSocket();
			}).catch((error) => {
				setTitle("Alerta!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
			setLoading(false);
		}

		loadOrder();
	}, [userId]);


	async function handleSetOrder(event, order) {
		event.preventDefault();
		setOrderA(order);
		setModalOrderListing(true);
	}

	async function handleDeliver(event, order) {
		event.preventDefault();

		await api.put("/order/" + order._id, { status:true })
			.then(() => {
				setTitle("Pedido enviado!");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	async function handleFeedback(event, order) {
		event.preventDefault();

		setFeedback(order.feedback);
		setModalFeedback(true);
	}

	async function deleteAllSockets() {
		await api.delete("sockets", {
			headers: { authorization: userId }
		})
			.then(() => {
				//
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	async function handleDeleteOrders(event) {
		event.preventDefault();
		setModalDeleteOrder(false);

		await api.delete("order", {
			headers : {
				authorization: userId,
				password: userPasswordOnDelete
			}})
			.then(() => {
				deleteAllSockets();
				setTitle("Todos pedidos apagados!");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
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
				orders && orders.length ?
					<>
						<h1 style={{color: "#FFFFFF"}} className="display-4 text-center m-auto p-3">Todos pedidos das últimas 24 horas!</h1>
						<Row xs={1} sm={2} md={3} xl={4} className="d-flex justify-content-around m-auto w-100" >
							{orders.map(order => (
								<Col key={order._id} className="order-item" >
									<header>
										<Image src={order.user.thumbnail ? order.user.thumbnail_url: camera } alt="thumbnail" />
										<div className="order-info">
											<strong>{order.user.name}</strong>
											<span>{order.user.email}</span>
										</div>
									</header>
									<p>{order.user.phone ? order.phone: "Telefone não informado"}</p>
									{order.deliver ?
										<p>{"Endereço de entrega: " + (order.address).join(", ")}</p>
										:
										<p>{"Vai retirar no balcão!"}</p>
									}
									<p>
										{"Total a pagar R$" + order.total}
									</p>
									<button
										onClick={e => handleSetOrder(e, order)}
										className="btn mt-1 mr-1"
										id="btn-password"
									>
									Ver pedido
									</button>
									{!(order.status) ?
										<Button
											className="mt-1"
											onClick={e => handleDeliver(e, order)}
											variant="outline-warning">Entregar pedido
										</Button>
										:
										<Button
											className="mt-1"
											onClick={e => handleFeedback(e, order)}
											variant="outline-warning">Avaliação
										</Button>
									}
								</Col>
							))}
						</Row>
						<Button
							className="d-flex mx-auto my-4"
							onClick={() => setModalDeleteOrder(true)}
							variant="danger">Apagar todos pedidos
						</Button>
					</>
					:
					<>
						<h1 style={{color: "#FFFFFF"}} className="display-4 text-center m-auto p-3">Não há pedidos das últimas 24 horas!</h1>
					</>
			}

			<Modal
				show={modalOrderListing}
				onHide={() => setModalOrderListing(false)}
				size="lg"
				className="p-0"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Pedido de {orderA.user ? orderA.user.name : null }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Card bg="light" >
						<Card.Header>
							<ProductDeck.Header products={orderA.products} setProduct={setProduct} />
						</Card.Header>
						{isLoading ?
							<Spinner
								className="my-5 mx-auto"
								style={{width: "5rem", height: "5rem"}}
								animation="grow"
								variant="warning"
							/>
							:
							product ? <ProductDeck.Card product={product} /> : null
						}
					</Card>

				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => setModalOrderListing(false)}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modalDeleteOrder} onHide={() => setModalDeleteOrder(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Todos os pedidos serão apagados</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Atenção! É importante apagar todos os pedidos do dia anterior para não
					sobrecarregar o banco de dados, mas certifique-se que todos os pedidos foram
					entregues antes de apagá-los.<br></br> <br></br>
					Dica: Apague todos os dias antes de começar a funcionar. <br></br> <br></br>

					<Form className="my-3" onSubmit={handleDeleteOrders}>
						<Form.Group controlId="passwordOnDelete">
							<Form.Label>Confirme sua senha para prosseguir</Form.Label>
							<Form.Control
								placeholder="Senha"
								type="password"
								value={userPasswordOnDelete}
								onChange={event => setUserPasswordOnDelete(event.target.value)}
								required
							/>
						</Form.Group>
						<Button className="mt-1" variant="warning" onClick={() => setModalDeleteOrder(false)}>
							Cancelar
						</Button>{" "}
						<Button className="mt-1" variant="danger" type="submit">
							Apagar
						</Button>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={modalFeedback} onHide={() => setModalFeedback(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Avalição do pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>{feedback ? feedback : "Ainda não avaliou"}</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => setModalFeedback(false)}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

			<Alert.Close
				modalAlert={modalAlert}
				setModalAlert={setModalAlert}
				title={title}
				message={message}
			/>
		</div>
	);
}

AllOrders.propTypes = {
	userId : PropTypes.string.isRequired
};