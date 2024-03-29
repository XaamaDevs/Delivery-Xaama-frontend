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
	Image,
	Container
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
import Loading from "../../components/Loading";

// Importing image from camera
import camera from "../../assets/camera.svg";

// Importing backend api
import api from "../../services/api";

//	Importing socket utils
import {
	connect,
	disconnect,
	subscribeToUpdateOrders,
	subscribeToDeleteOrders
} from "../../services/websocket";

//	Exporting resource to routes.js
export default function Orders({ userId, user, companyInfo }) {
	//	Order state variables
	const [orders, setOrders] = useState([]);
	const [orderId, setOrderId] = useState("");
	const [order, setOrder] = useState({});
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
			label: "Very Dissatisfied"
		},
		2: {
			icon: <SentimentDissatisfiedIcon />,
			label: "Dissatisfied"
		},
		3: {
			icon: <SentimentSatisfiedIcon />,
			label: "Neutral"
		},
		4: {
			icon: <SentimentSatisfiedAltIcon />,
			label: "Satisfied"
		},
		5: {
			icon: <SentimentVerySatisfiedIcon />,
			label: "Very Satisfied"
		}
	};

	function IconContainer(props) {
		const { value, ...other } = props;

		return <span {...other}>{customIcons[value].icon}</span>;
	}

	IconContainer.propTypes = {
		value: PropTypes.number.isRequired
	};

	function setupWebSocket() {
		disconnect();
		connect();
	}

	useEffect(() => {
		function filterOrders(o) {
			const resp = o.filter((f) => (f.user._id === user._id));

			return resp && resp.length ? resp : null;
		}

		subscribeToUpdateOrders((o) => setOrders(filterOrders(o)));
		subscribeToDeleteOrders((o) => setOrders(filterOrders(o)));
	}, [orders, userId]);

	useEffect(() => {
		async function fetchData() {
			await api.get("order", {
				headers: {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
					setOrders(response.data);
					setupWebSocket();
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && error.response.status === 400) {
					setMessage(error.response.data);
					setToastShow(true);
				} else if(error.response && error.response.status === 404) {
					setOrders([]);
				} else if(error.response && error.response.status === 500) {
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

	async function handleFeedback(event) {
		event.preventDefault();

		const data = {
			orderId,
			feedback,
			stars: value
		};

		await api.post("rating", data, {
			headers: {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 201) {
				setFeedbackModal(false);
				setFeedback(null);
				setValue(3);
				setTitle("Avaliação enviada!");
				setMessage("Obrigado pelo seu feedback!");
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	return (
		<Container fluid>
			{isLoading ?
				<Loading animation="grow" />
				:
				<>
					<h1 className="display-4 text-center text-white m-auto p-3 w-100">
						{orders && orders.length ? "Seus últimos pedidos!" : "Não há pedidos!"}
					</h1>
					<CardDeck className="mx-0">
						{orders && orders.length ?
							<Row className="m-auto w-100">
								{orders.map((orderI) => (
									<Col key={orderI._id} className="px-0 my-2 mx-auto" xl="3" lg="4" md="6" sm="12">
										<Card className="mx-2 h-100" text="white" bg="dark">
											<Card.Header>
												<Row>
													<Col className="d-flex flex-wrap align-items-center" sm="3">
														<Image
															className="w-100"
															style={{ borderRadius: "50%" }}
															src={
																orderI.user && orderI.user.thumbnail ?
																	`${process.env.REACT_APP_API_URL}files/${orderI.user.thumbnail}`
																	:
																	camera
															}
															alt="thumbnail"
															fluid
														/>
													</Col>
													<Col className="ml-3">
														<Row>
															<strong>{orderI.user.name ? orderI.user.name : null}</strong>
														</Row>
														<Row>
															<span>{orderI.user.email ? orderI.user.email : null}</span>
														</Row>
														<Row>
															<span>{orderI.creationDate ? orderI.creationDate : null}</span>
														</Row>
													</Col>
												</Row>
											</Card.Header>
											<Card.Body>
												<Card.Text>
													{orderI.phone ? `Telefone para contato: ${orderI.phone}` : "Telefone não informado"}
												</Card.Text>
												<Card.Text>
													{orderI.deliver ?
														`Endereço de entrega: ${orderI.address.join(", ")}`
														:
														"Irá retirar no balcão!"
													}
												</Card.Text>
												<Card.Text>
													{orderI.deliver ?
														`Tempo para entrega: De ${companyInfo.timeDeliveryI} a ${companyInfo.timeDeliveryF} minutos`
														:
														`Tempo para retirada: ${companyInfo.timeWithdrawal} minutos`
													}
												</Card.Text>
												<Card.Text>
													Total a pagar R$ {orderI.total}
												</Card.Text>
												<Card.Text>
													Método de pagamento:
													{orderI.typePayment === 1 ?
														" Cartão"
														:
														" Dinheiro"
													}
												</Card.Text>
												<Card.Text>
													{(orderI.change === orderI.total) ?
														"Não precisa de troco"
														:
														((orderI.typePayment === 0) ?
															`Pagará R$${orderI.change}, troco de R$${orderI.change - orderI.total}`
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
														onClick={() => {
															setOrder(orderI); setOrderListingModal(true);
														}}
													>
														Ver pedido
													</Button>
													{!orderI.status ?
														<Button
															variant="danger"
															className="m-1 mx-auto"
															disabled
														>
															Pedido sendo preparado
														</Button>
														:
														<>
															{!orderI.feedback ?
																<>
																	<Button
																		variant="warning"
																		className="m-1 mx-auto"
																		disabled
																	>
																		Pedido a caminho
																	</Button>
																	<Button
																		variant="outline-warning"
																		className="m-1 mx-auto"
																		onClick={() => {
																			setOrderId(orderI._id); setFeedbackModal(true);
																		}}
																	>
																		Recebeu seu pedido? Avalie!
																	</Button>
																</>
																:
																<Button
																	variant="warning"
																	className="m-1 mx-auto"
																	disabled
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
							:
							null
						}
					</CardDeck>
				</>
			}

			<Modal
				show={orderListingModal}
				onHide={() => {
					setOrder({}); setOrderListingModal(false);
				}}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Pedido de {order && order.user ? order.user.name : null }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{isLoading ?
						<Loading animation="grow" />
						:
						<ProductDeck products={order && order.products ? order.products : []} />
					}
				</Modal.Body>
			</Modal>

			<Modal show={feedbackModal} onHide={() => {
				setFeedbackModal(false); setFeedback(""); setValue(3);
			}} size="lg" centered>
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
										onChange={(e) => setFeedback(e.target.value)}
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
							<Button
								variant="danger"
								onClick={() => {
									setFeedbackModal(false); setFeedback(""); setValue(3);
								}}>
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
		</Container>
	);
}

Orders.propTypes = {
	userId: PropTypes.string.isRequired,
	user: PropTypes.object.isRequired,
	companyInfo: PropTypes.object.isRequired
};
