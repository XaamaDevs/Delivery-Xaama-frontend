//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React features
import {
	CardDeck,
	Card,
	Button,
	Modal,
	Row,
	Col,
	Image,
	Form,
	Container
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../../components/Alert";
import Push from "../../../components/Push";
import ProductDeck from "../../../components/ProductDeck";
import Loading from "../../../components/Loading";

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
export default function AllOrders({ userId, companyInfo }) {
	//	Order state variables
	const [orders, setOrders] = useState([]);
	const [order, setOrder] = useState({});
	const [userPasswordOnDelete, setUserPasswordOnDelete] = useState("");

	//	Modal settings
	const [modalOrderListing, setModalOrderListing] = useState(false);
	const [modalDeleteOrder, setModalDeleteOrder] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	function setupWebSocket() {
		disconnect();
		connect();
	}

	useEffect(() => {
		subscribeToNewOrders((o) => setOrders([o[0], ...orders]));
		subscribeToUpdateOrders((o) => setOrders(o));
		subscribeToDeleteOrders((o) => setOrders(o));
	}, [orders]);

	useEffect(() => {
		async function fetchData() {
			await api.get("orderAll", {
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

	async function handleDeliver(event, order) {
		event.preventDefault();

		let orderOK = false;

		await api.put(`/order/${order._id}`, { status: true }, {
			headers: {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 200) {
				orderOK = true;
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});

		if(orderOK) {
			const data = [];

			const myMapTypesProducts = new Map();

			if(order && order.products) {
				for(const p of order.products) {
					myMapTypesProducts.set(p.product && p.product.type ? p.product.type : "",
						myMapTypesProducts.get(p.product.type) ? myMapTypesProducts.get(p.product.type) + 1 : 1);
				}
			}

			for(const cards of companyInfo.cards) {
				const cardsNewQtd = {
					cardFidelity: cards.type,
					qtdCurrent: myMapTypesProducts.get(cards.type) ? myMapTypesProducts.get(cards.type) : 0
				};

				data.push(cardsNewQtd);
			}

			await api.put("/userUpdateCard", { cardsNewQtd: data }, {
				headers: {
					"x-access-token": userId,
					"order-user-id": order.user._id
				}
			}).then((response) => {
				if(response.status === 200) {
					setTitle("Pedido enviado!");
					setMessage(response.data);
					setModalAlert(true);
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && error.response.status === 400) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 404) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 500) {
					setMessage(error.message);
				} else {
					setMessage("Algo deu errado :(");
				}
				setToastShow(true);
			});
		}
	}

	async function deleteAllSockets() {
		await api.delete("sockets", {
			headers: {
				"x-access-token": userId
			}
		});
	}

	async function handleDeleteOrders(event) {
		event.preventDefault();

		await api.delete("order", {
			headers: {
				"x-access-token": userId,
				password: userPasswordOnDelete
			}
		}).then((response) => {
			if(response.status === 200) {
				setModalDeleteOrder(false);
				deleteAllSockets();
				setTitle("Remoção de pedidos");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setUserPasswordOnDelete("");
			setModalDeleteOrder(false);
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setModalAlert(true);
		});
	}

	return (
		<Container fluid>
			<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
			{isLoading ?
				<Loading animation="grow" />
				:
				<>
					<h1 className="display-4 text-center text-white m-auto py-3 w-100">
						{orders && orders.length ? "Pedidos das últimas 24 horas" : "Não há pedidos das últimas 24 horas!"}
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
															src={orderI.user.thumbnail ?
																process.env.REACT_APP_API_URL + orderI.user.thumbnail_url
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
													{`Total a pagar R$ ${orderI.total}`}
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
															`Pagará R$ ${orderI.change}, troco de R$ ${orderI.change - orderI.total}`
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
															setOrder(orderI); setModalOrderListing(true);
														}}
													>
													Ver pedido
													</Button>
													{!orderI.status ?
														<Button
															variant="outline-warning"
															className="m-1 mx-auto"
															onClick={(e) => handleDeliver(e, orderI)}
														>
														Entregar pedido
														</Button>
														:
														null
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
					{orders && orders.length ?
						<Button
							variant="danger"
							className="d-flex mx-auto my-4"
							onClick={() => setModalDeleteOrder(true)}
						>
							Apagar todos pedidos já entregues
						</Button>
						:
						null
					}
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
					<Modal.Title>Pedido de {order && order.user ? order.user.name : null }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{isLoading ?
						<Loading animation="grow" />
						:
						<ProductDeck products={order && order.products ? order.products : []} />
					}
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
					<p align="justify">
						Atenção! É importante apagar todos os pedidos do dia anterior para não
						sobrecarregar o banco de dados, mas certifique-se que todos os pedidos foram
						entregues antes de apagá-los.<br></br><br></br>
						Dica: Apague todos os dias antes de começar a funcionar.
					</p>
					<Form className="my-3" onSubmit={handleDeleteOrders}>
						<Form.Group controlId="passwordOnDelete">
							<Form.Label>Confirme sua senha para prosseguir</Form.Label>
							<Form.Control
								placeholder="Senha"
								type="password"
								value={userPasswordOnDelete}
								onChange={(event) => setUserPasswordOnDelete(event.target.value)}
								required
							/>
						</Form.Group>
						<Button className="m-1" variant="warning" onClick={() => setModalDeleteOrder(false)}>
							Cancelar
						</Button>
						<Button className="m-1" variant="danger" type="submit">
							Apagar
						</Button>
					</Form>
				</Modal.Body>
			</Modal>

			<Alert.Close
				modalAlert={modalAlert}
				setModalAlert={setModalAlert}
				title={title}
				message={message}
			/>
		</Container>
	);
}

AllOrders.propTypes = {
	userId: PropTypes.string.isRequired,
	companyInfo: PropTypes.object.isRequired
};
