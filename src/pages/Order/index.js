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

//	Importing Material-ui features
import Rating from "@material-ui/lab/Rating";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";

//	Importing website utils
import Alert from "../../components/Alert";
import Push from "../../components/Push";
import ProductDeck from "../../components/ProductDeck";

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
export default function AllOrders({ userId, companyInfo }) {
	//	Order state variables
	const [orders, setOrders] = useState([]);
	const [orderId, setOrderId] = useState("");
	const [orderA, setOrderA] = useState({});
	const [feedback, setFeedback] = useState(null);

	//	Modal settings
	const [orderListingModal, setOrderListingModal] = useState(false);
	const [feedbackModal, setFeedbackModal] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const [value, setValue] = useState(3);
	
	const customIcons = {
		1: {
			icon: <SentimentVeryDissatisfiedIcon />,
			label: "Very Dissatisfied",
		},
		2: {
			icon: <SentimentDissatisfiedIcon />,
			label: "Dissatisfied",
		},
		3: {
			icon: <SentimentSatisfiedIcon />,
			label: "Neutral",
		},
		4: {
			icon: <SentimentSatisfiedAltIcon />,
			label: "Satisfied",
		},
		5: {
			icon: <SentimentVerySatisfiedIcon />,
			label: "Very Satisfied",
		},
	};

	function IconContainer(props) {
		const { value, ...other } = props;
		return <span {...other}>{customIcons[value].icon}</span>;
	}

	IconContainer.propTypes = {
		value: PropTypes.number.isRequired,
	};
	

	function setupWebSocket() {
		disconnect();
		connect();
	}

	useEffect(() => {
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

		subscribeToNewOrders(o => newOrders(o));
		subscribeToUpdateOrders(o => setOrders(filterOrders(o)));
		subscribeToDeleteOrders(o => setOrders(o));
	}, [orders, userId]);

	useEffect(() => {
		async function loadOrder() {
			await api.get("order", {
				headers : {
					"x-access-token": userId
				}})
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
			setIsLoading(false);
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
	
		var data = {
			orderId: orderId,
			feedback: feedback,
			stars: value
		};

		await api.post("assessments", data, {
			headers: {
				"x-access-token" : userId
			}})
			.then(() => {
				setFeedbackModal(false);
				setFeedback(null);
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
				setToastShow(true);
			});
	}

	return (
		<div className="all-container p-0 w-100">
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
													<Col className="d-flex flex-wrap align-items-center" sm="3">
														<Image
															className="w-100"
															style={{ borderRadius: "50%" }}
															src={order.user && order.user.thumbnail ? process.env.REACT_APP_API_URL + order.user.thumbnail_url: camera}
															alt="thumbnail"
															fluid
														/>
													</Col>
													<Col className="ml-3">
														<Row>
															<strong>{order.user.name ? order.user.name : null}</strong>
														</Row>
														<Row>
															<span>{order.user.email ? order.user.email : null}</span>
														</Row>
														<Row>
															<span>{order.creationDate ? order.creationDate : null}</span>
														</Row>
													</Col>
												</Row>
											</Card.Header>
											<Card.Body>
												<Card.Text>
													{order.phone ? "Telefone para contato: " + order.phone : "Telefone não informado"}
												</Card.Text>
												<Card.Text>
													{order.deliver ?
														"Endereço de entrega: " + order.address.join(", ")
														:
														"Irá retirar no balcão!"
													}
												</Card.Text>
												<Card.Text>
													{order.deliver ?
														"Tempo para entrega: De " + companyInfo.timeDeliveryI + " a " + companyInfo.timeDeliveryF + " minutos"
														:
														"Tempo para retirada: " + companyInfo.timeWithdrawal + " minutos"
													}
												</Card.Text>
												<Card.Text>
													Total a pagar R$ {order.total}
												</Card.Text>
												<Card.Text>
													Método de pagamento:
													{order.typePayment === 1 ?
														" Cartão"
														:
														" Dinheiro"
													}
												</Card.Text>
												<Card.Text>
													{(order.change === order.total) ?
														"Não precisa de troco"
														:
														((order.typePayment === 0) ?
															"Pagará R$" + order.change + ", troco de R$" + (order.change - order.total)
															:
															"Pagará na maquininha"
														)
													}
												</Card.Text>

												<Row className="d-flex justify-content-between">
													<Button
														variant="light"
														id="btn-custom-outline"
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
				size="md"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
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
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
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
										rows="5"
										placeholder="Avaliação sobre o pedido e atendimento"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Rating
									name="customized-icons"
									value={value}
									onChange={(event, newValue) => {
										setValue(newValue);
									}}
									getLabelText={(value) => customIcons[value].label}
									IconContainerComponent={IconContainer}
								/>
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

			<Alert.Refresh modalAlert={modalAlert} setModalAlert={setModalAlert} title={title} message={message} />
		</div>
	);
}

AllOrders.propTypes = {
	userId : PropTypes.string.isRequired,
	companyInfo : PropTypes.object.isRequired,
};