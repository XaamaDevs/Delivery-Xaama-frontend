//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React features
import {
	Card,
	Button,
	Modal,
	Form,
	Row,
	Col,
	Spinner,
	Container,
	Image
} from "react-bootstrap";

//	Importing website utils
import Alert from "../Website/Alert";
import Push from "../Website/Push";
import ProductDeck from "../Website/ProductDeck";

// Importing image from camera
import camera from "../../assets/camera.svg";

// Importing backend api
import api from "../../services/api";

//	Importing socket utils
import {
	connect,
	disconnect,
	subscribeToNewOrders,
	subscribeToDeleteOrders,
	subscribeToUpdateOrders
} from "../../services/websocket";

//	Exporting resource to routes.js
export default function AllOrders({ userId }) {
	//	Order state variables
	const [orders, setOrders] = useState([]);
	const [orderId, setOrderId] = useState("");
	const [orderA, setOrderA] = useState({});
	const [product, setProduct] = useState({});
	const [feedback, setFeedback] = useState("");

	//	Modal settings
	const [orderListingModal, setOrderListingModal] = useState(false);
	const [feedbackModal, setFeedbackModal] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
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
			await api.get("order/" + userId)
				.then((response) => {
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
		setOrderListingModal(true);
	}

	async function handleFeedback(event) {
		event.preventDefault();

		await api.put("order/" + orderId, {
			status: true,
			feedback: feedback
		}).then(() => {
			setFeedbackModal(false);
			setTitle("Avaliação enviada!");
			setMessage("Obrigado pelo seu feedback!");
			setModalAlert(true);
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && typeof(error.response.data) !== "object") {
				setMessage(error.response.data);
			} else {
				setMessage(error.message);
			}
			setFeedbackModal(false);
		});

		setFeedback("");
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
				<div className="p-0 w-100">
					<h1 className="display-4 text-center text-white m-auto p-3 w-100">
						{orders && orders.length ? "Seus últimos pedidos!" : "Não há pedidos!"}
					</h1>
					<Row xs={1} sm={2} md={3} xl={4} className="d-flex justify-content-around m-auto w-100" >
						{orders.map(order => (
							<Col key={order._id} className="order-item">
								<header>
									<Image src={order.user.thumbnail_url ? order.user.thumbnail_url: camera } alt="Thumbnail"/>
									<div className="order-info">
										<strong>{order.user.name}</strong>
										<span>{order.user.email}</span>
									</div>
								</header>
								<p>
									{order.user.phone ? order.user.phone : "Telefone não informado"}
								</p>
								<p>
									{order.deliver ?
										"Endereço de entrega: " + order.address.join(", ")
										:
										"Vai retirar no balcão!"
									}
								</p>
								<p>
									{"Total a pagar R$" + order.total}
								</p>
								<Row className="d-flex justify-content-center">
									<Button
										id="btn-password"
										onClick={e => handleSetOrder(e, order)}
										className="m-1"
									>
										Ver pedido
									</Button>
									{!(order.status) ?
										<Button
											variant="danger"
											className="m-1"
										>
											Pedido sendo preparado
										</Button>
										:
										<>
											{!order.feedback ?
												<>
													<Button
														variant="warning"
														className="m-1"
													>
														Pedido a caminho
													</Button>
													<Button
														onClick={() => { setOrderId(order._id); setFeedbackModal(true); }}
														variant="outline-warning"
														className="m-1"
													>
														Recebeu seu pedido? Avalie!
													</Button>
												</>
												:
												<Button
													variant="warning"
													className="m-1"
												>
													Pedido entregue
												</Button>
											}
										</>
									}
								</Row>
							</Col>
						))}
					</Row>
				</div>
			}

			<Modal
				show={orderListingModal}
				onHide={() => setOrderListingModal(false)}
				size="lg"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Pedido de {orderA.user ? orderA.user.name : null }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Card bg="light">
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
			</Modal>

			<Modal show={feedbackModal} onHide={() => setFeedbackModal(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Avaliar pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleFeedback}>
						<Row>
							<Col>
								<Form.Group controlId="feedback">
									<Form.Label>Sua avaliação</Form.Label>
									<Form.Control
										value={feedback}
										onChange={e => setFeedback(e.target.value)}
										as="textarea"
										rows="12"
										placeholder="Avaliação sobre o pedido e atendimento"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setFeedbackModal(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Enviar avaliação
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
		</div>
	);
}

AllOrders.propTypes = {
	userId : PropTypes.string.isRequired
};