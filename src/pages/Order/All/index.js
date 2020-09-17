//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

// Importing backend api
import api from "../../../services/api";

import { connect, disconnect, subscribeToNewOrders, subscribeToUpdateOrders } from "../../../services/websocket";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing React features
import { Card, CardDeck, Nav, Button, Modal, Row, Col, Spinner, Container, Image, Toast } from "react-bootstrap";

//	Exporting resource to routes.js
export default function AllOrders({ userId, userType }) {
	const [orders, setOrders] = useState([]);
	const [orderA, setOrderA] = useState({});
	const [product, setProduct] = useState({});
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");
	const [feedback, setFeedback]= useState("");

	//	Modal settings
	const [modalOrderListing, setModalOrderListing] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
	const [modalFeedback, setModalFeedback] = useState(false);
	const [modalDeleteOrder, setModalDeleteOrder] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setLoading] = useState(true);

  const history = useHistory();

	function setupWebSocket() {
		disconnect();
    connect();
  }

  async function loadOrder() {
    await api.get("order", {
      headers : {
        authorization: userId
      }
    }).then((response) => {
      if(response.data) {
        setOrders(response.data);
        setupWebSocket();
      } else {
        setTitle("Alerta!");
        setColor("danger");
        setMessage("Não há pedidos!");
        setToastShow(true);
      }

    }).catch((error) => {
      setTitle("Alerta!");
      setColor("danger");
      if(error.response) {
        setMessage(error.response.data);
      } else {
        setMessage(error.message);
      }
      setToastShow(true);
    });
    setLoading(false);
  }

  useEffect(() => {
    subscribeToNewOrders(o => setOrders([...orders, o]));
    subscribeToUpdateOrders(loadOrder());
	}, [orders]);

	useEffect(() => {
		loadOrder();
  }, [userId]);


	async function handleSetOrder(event, order) {
		event.preventDefault();
		setOrderA(order);
		setModalOrderListing(true);
	}

	async function handleProductList(event, productA) {
		event.preventDefault();
		setProduct(productA);
	}

	async function handleDeliver(event, order) {
		event.preventDefault();

		await api.put("/order/" + order._id, { status:true })
			.then(() => {
				setTitle("Pedido enviado!");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
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

	async function handleDeleteOrders(event) {
		event.preventDefault();
		setModalDeleteOrder(false);

		await api.delete("order", {
			headers : {
				authorization: userId,
			}})
			.then(() => {
				setTitle("Todos pedidos apagados!");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	const header = (
		<Nav fill variant="tabs">
			{(orderA.products) ? (orderA.products).map((productA, index) => (
				<Nav.Item key={index}>
					<Nav.Link
						className="btn-outline-dark rounded"
						href={"#" + index}
						onClick={e => handleProductList(e, productA)} >{productA.product.name}
					</Nav.Link>
				</Nav.Item>
			))
				:
				<></>
			}
		</Nav>
	);

	const productCard = (product) => {
		return (
			<>
				{product.product ?
					<CardDeck className="p-2">
						<Card className="h-100 p-1" bg="secondary" key={product._id}>
							<Row>
								<Col sm>
									<Image
										src={product.product.thumbnail_url ? product.product.thumbnail_url : camera}
										alt="thumbnail"
										fluid
										rounded
									/>
								</Col>
								<Col sm>
									<Row>
										<Card.Body>
											<Card.Title>{product.product ? product.product.name : null }</Card.Title>
											<Card.Text>
												{product.product ? ((product.product.ingredients.length === 1) ?
													"Ingrediente: "
													:
													"Ingredientes: "
												)
													:
													null
												}
												{product.product ? product.product.ingredients.map((ingredient, index) => (
													index === product.product.ingredients.length-1 ?
														ingredient
														:
														ingredient + ", "
												))
													:
													null
												}
											</Card.Text>
										</Card.Body>
									</Row>
									<Row>
										<Card.Body>
											<Card.Title>Observações:</Card.Title>
											<Card.Text>
												{product.note ? product.note : "Sem Observações"}
											</Card.Text>
										</Card.Body>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col>
									<Card.Body>
										<Card.Title>{product.additions.length ? "Adições:" : "Sem Adições"}</Card.Title>
										{product.additions.length ?
											<Card.Text>
												<Row>
													{(product.additions).map(addition => (
														<Col key={(addition) ? addition._id : null } sm>
															{addition.name + "\nPreço: R$" + addition.price}
														</Col>
													))}
												</Row>
											</Card.Text>
											:
											null
										}
									</Card.Body>
								</Col>
							</Row>
							<Card.Footer>
								<small>
									{product.product ?
										"Preço: R$" + product.product.prices[product.size]
										:
										null
									}
								</small>
							</Card.Footer>
						</Card>
					</CardDeck>
					:
					<h1 style={{color: "#000000"}} className="display-5 text-center m-auto p-5">
						Selecione o produto desejado acima
					</h1>
				}
			</>
		);
	};

	const toast = (
		<div
			aria-live="polite"
			aria-atomic="true"
			style={{
				position: "absolute",
				top: "50%",
				right: "50%",
			}}
		>
			<Toast show={toastShow} onClose={() => setToastShow(false)} delay={3000} autohide>
				<Toast.Header>
					<strong className="mr-auto">{title}</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>
	);

	return (
		<div className="all-container w-100">
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
							variant="outline-danger">Apagar todos pedidos
						</Button>
					</>
					:
					<>
						{toast}
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
							{header}
						</Card.Header>
						{isLoading ?
							<Spinner
								className="my-5 mx-auto"
								style={{width: "5rem", height: "5rem"}}
								animation="grow"
								variant="warning"
							/>
							:
							product ? productCard(product) : null
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

					<Button className="mt-1" variant="warning" onClick={() => setModalDeleteOrder(false)}>
						Cancelar
					</Button>{" "}
					<Button className="mt-1" variant="danger" onClick={handleDeleteOrders}>
						Apagar
					</Button>
				</Modal.Body>
			</Modal>

			<Modal show={modalAlert} onHide={() => setModalAlert(false)}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant={color} onClick={() => setModalAlert(false)}>
						Fechar
					</Button>
				</Modal.Footer>
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
		</div>
	);
}