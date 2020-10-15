//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React features
import {
	CardDeck,
	Card,
	Button,
	Modal,
	Form,
	Row,
	Col,
	Spinner,
	Container,
	Image,
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
	subscribeToUpdateOrders,
	subscribeToDeleteOrders
} from "../../services/websocket";

//	Exporting resource to routes.js
export default function AllOrders({ userId }) {
	//	Order state variables
	const [orders, setOrders] = useState([]);
	const [orderId, setOrderId] = useState("");
	const [orderA, setOrderA] = useState({});
	const [feedback, setFeedback] = useState("");

	//	Modal settings
	const [orderListingModal, setOrderListingModal] = useState(false);
	const [feedbackModal, setFeedbackModal] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [modalClose, setModalClose] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setLoading] = useState(true);

	function setupWebSocket() {
		disconnect();
		connect();
	}

	function filterOrders(o) {
		let resp = o.filter(f => ( f.user._id === userId ));
		return resp && resp.length ? resp : null;
	}

	async function newOrders(o) {
		const resp = await filterOrders(o);
		if(resp && resp.length) {
			setOrders([...orders, resp]);
		}
	}

	useEffect(() => {
		subscribeToNewOrders(o => newOrders(o));
		subscribeToUpdateOrders(o => setOrders(filterOrders(o)));
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
			setModalClose(true);
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
		<div className="all-container p-0 w-100">
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
					{orders && orders.length ?
						<CardDeck className="mx-3">
							<Row xs={1} sm={2} md={3} className="d-flex justify-content-around m-auto w-100">
								{orders.map(order => (
									<Col key={order._id} className="my-2">
										<Card text="white" bg="dark">
											<Card.Header>
												<Row>
													<Col sm="3">
														<Image
															className="w-100"
															style={{ borderRadius: "50%" }}
															src={order.user && order.user.thumbnail ? order.user.thumbnail_url: camera}
															alt="thumbnail"
															fluid
														/>
													</Col>
													<Col>
														<Row>
															<strong>{order.user.name}</strong>
														</Row>
														<Row>
															<span>{order.user.email}</span>
														</Row>
													</Col>
												</Row>
											</Card.Header>
											<Card.Body>
												<Card.Text>
													<p>
														{order.phone ? "Telefone para contato: " + order.phone : "Telefone não informado"}
													</p>
													<p>
														{order.deliver ?
															"Endereço de entrega: " + order.address.join(", ")
															:
															"Irá retirar no balcão!"
														}
													</p>
													<p>
														{"Total a pagar R$" + order.total}
													</p>
													<p>
                            Método de pagamento:
														{order.typePayament === 1 ?
															" Cartão"
															:
															" Dinheiro"
														}
													</p>
													<p>
														{(order.change === order.total) ?
															"Não precisa de troco"
															:
															((order.typePayament === 0) ?
																"Pagará R$" + order.change + ", troco de R$" + (order.change - order.total)
																:
																"Pagará na maquininha"
															)
														}
													</p>
												</Card.Text>
												<Row className="d-flex justify-content-between">
													<Button
														id="btn-password"
														className="m-1 mx-auto"
														onClick={e => handleSetOrder(e, order)}
													>
                            Ver pedido
													</Button>
													{!order.status ?
														<Button
															variant="danger"
															className="m-1 mx-auto"
														>
                              Pedido sendo preparado
														</Button>
														:
														<>
															{!order.feedback ?
																<>
																	<Button
																		variant="warning"
																		className="m-1 mx-auto"
																	>
                                    Pedido a caminho
																	</Button>
																	<Button
																		variant="outline-warning"
																		className="m-1 mx-auto"
																		onClick={() => { setOrderId(order._id); setFeedbackModal(true); }}
																	>
                                    Recebeu seu pedido? Avalie!
																	</Button>
																</>
																:
																<Button
																	variant="warning"
																	className="m-1 mx-auto"
																>
                                  Pedido entregue
																</Button>
															}
														</>
													}
												</Row>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						</CardDeck>
						:
						null
					}
				</div>
			}

			<Modal
				show={orderListingModal}
				onHide={() => setOrderListingModal(false) }
				size="lg"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Pedido de {orderA.user ? orderA.user.name : null }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{isLoading ?
						<Spinner
							className="my-5 mx-auto"
							style={{width: "5rem", height: "5rem"}}
							animation="grow"
							variant="warning"
						/>
						:
						<ProductDeck products={orderA.products} />
					}
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

			<Alert.Close modalClose={modalClose} title={title} message={message} setModalClose={setModalClose} />
		</div>
	);
}

AllOrders.propTypes = {
	userId : PropTypes.string.isRequired
};