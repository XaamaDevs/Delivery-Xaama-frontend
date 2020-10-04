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
	Spinner,
	Container,
	Image,
	Form
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../Website/Alert";
import Push from "../../Website/Push";
import ProductDeck from "../../Website/ProductDeck";

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
	//	Order state variables
	const [orders, setOrders] = useState([]);
	const [orderA, setOrderA] = useState({});
	const [product, setProduct] = useState({});
	const [feedback, setFeedback]= useState("");
	const [userPasswordOnDelete, setUserPasswordOnDelete] = useState("");

	//	Modal settings
	const [modalOrderListing, setModalOrderListing] = useState(false);
	const [modalFeedback, setModalFeedback] = useState(false);
	const [modalDeleteOrder, setModalDeleteOrder] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setLoading] = useState(true);

	function setupWebSocket() {
		disconnect();
		connect();
  }

	useEffect(() => {
    subscribeToNewOrders(o => setOrders([...orders, o[0]]));
    console.log("orders: ", orders);
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
						{orders && orders.length ? "Pedidos das últimas 24 horas" : "Não há pedidos das últimas 24 horas!"}
					</h1>
					<CardDeck className="mx-3">
						<Row xs={1} sm={2} md={3} className="d-flex justify-content-around m-auto w-100">
							{orders.map(order => (
								<Col key={order._id} className="my-2">
									<Card text="white" bg="dark">
										<Card.Header>
											<Row>
												<Col sm="3">
													<Image
														className="h-100"
														style={{ borderRadius: "50%" }}
														src={order.user.thumbnail ? order.user.thumbnail_url: camera}
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
													{order.user.phone ? "Telefone para contato: " + order.user.phone : "Telefone não informado"}
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
                            {(order.troco === order.total) ? 
                              "Não precisa de troco"
                              :
                              ((order.typePayament === 0) ?
                                  "Pagará R$" + order.troco + ", troco de R$" + (order.troco - order.total)
                                :
                                "Pagará na maquininha"
                              )
                            }
                          </p>
											</Card.Text>
											<Row className="d-flex justify-content-between">
												<Button
													id="btn-password"
													className="m-1"
													onClick={e => handleSetOrder(e, order)}
												>
													Ver pedido
												</Button>
												{!order.status ?
													<Button
														variant="outline-warning"
														className="m-1"
														onClick={e => handleDeliver(e, order)}
													>
														Entregar pedido
													</Button>
													:
													<Button
														variant="outline-warning"
														className="m-1"
														onClick={e => handleFeedback(e, order)}
													>
														Avaliação
													</Button>
												}
											</Row>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</CardDeck>
          {orders && orders.length ? 
            <Button
              variant="danger"
              className="d-flex mx-auto my-4"
              onClick={() => setModalDeleteOrder(true)}
            >
              Apagar todos pedidos
            </Button>
          : 
            null
          }
				</div>
			}

			<Modal
				show={modalOrderListing}
				onHide={() => {setProduct({}); setModalOrderListing(false) }}
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
					<Button variant="warning" onClick={() => { setProduct({}); setModalOrderListing(false)}}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modalDeleteOrder} onHide={() => setModalDeleteOrder(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Todos os pedidos serão apagados</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
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
								onChange={event => setUserPasswordOnDelete(event.target.value)}
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