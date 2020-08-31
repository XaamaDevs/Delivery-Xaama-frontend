//	Importing React main module and its features
import React, { useState, useEffect } from "react";

// Importing backend api
import api from "../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Importing React features
import { Card, CardDeck, Nav, Button, Modal, Form, Row, Col, Spinner, Container, Image, Toast } from "react-bootstrap";

//	Exporting resource to routes.js
export default function AllOrders({ userId, user, order, setOrder }) {
	const [orders, setOrders] = useState([]);
	const [orderA, setOrderA] = useState({});
	const [product, setProduct] = useState({});
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [feedback, setFeedback]= useState("");
	const [orderId, setOrderId]= useState("");

	//	Modal settings
	const [modalOrderListing, setModalOrderListing] = useState(false);
	const [modalFeedback, setModalFeedback] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		async function loadOrder() {
			await api.get("/order/" + userId)
				.then((response) => {
					if(response.data && response.data.length) {
						setOrders(response.data);
					} else {
						setTitle("Alerta!");
						setMessage("Não há pedidos!");
						setToastShow(true);
					}
				}).catch((error) => {
					setTitle("Alerta!");
					if(error.response) {
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
		setOrderId(order._id)
		setModalOrderListing(true);
	}
	
	async function handleProductList(event, productA) {
		event.preventDefault();
		setProduct(productA);
	}

	async function handleFeedback(event, order) {
		event.preventDefault();

		const data = new FormData();

		data.append("status", order.status);
		data.append("feedback", feedback);

		await api.put("/order/" + order._id, data , {
			headers : { 
				authorization: userId
			}})
			.then(() => {
				setTitle("Pedido enviado!");
				setMessage("Alterações feitas com sucesso!");
				//setColor("warning");
				//setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				//setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				//setModalAlert(true);
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
								<Col md={7}>
									<Image src={product.product ? product.product.thumbnail_url : camera} fluid rounded />
									<Card.Body key={product._id}>
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
										<Card.Text>
											{product && product.note ? "Observações: " + product.note : "Sem Observações"}
										</Card.Text>
										
									</Card.Body>
								</Col>
								<Col className="ml-3 mt-2" >
									<Card.Title>{product.additions.length ? "Adições:" : "Sem Adições"}</Card.Title>
									{product.additions.length ? (product.additions).map(addition => (
										<>
											<Card.Text key={(addition) ? addition._id : null }>{addition.name}
												<br></br>
												<small className="ml-1">
													{"Preço: R$" + addition.price}
												</small>
											</Card.Text>
										</>
									))
										:
										null
									}
								</Col>
							</Row>
							<Card.Footer w-100>
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
					<h1 style={{color: "#000000"}} className="display-5 text-center m-auto p-5">Selecione o produto desejado acima</h1>
				}
			</>
		);
	}

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
				<>
					{orders && orders.length ? 
						<h1 style={{color: "#FFFFFF"}} className="display-4 text-center m-auto p-3">Seus últimos pedidos!</h1>
						:
						<>
							{toast}
							<h1 style={{color: "#FFFFFF"}} className="display-4 text-center m-auto p-3">Não há pedidos!</h1>
						</>
					}
					<Row xs={1} sm={2} md={3} xl={4} className="d-flex justify-content-around m-auto w-100" >
						{orders.map(order => (
							<Col key={order._id} className="order-item" >
								<header>
									<Image src={order.user.thumbnail ? order.user.thumbnail_url: camera } alt="Thumbnail"/>
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
										variant="outline-danger">Pedido sendo preparado
									</Button>
									:
									<>
										<Button
											className="mt-1"
											variant="outline-warning">Pedido a caminho
										</Button>
										<Button
											onClick={() => setModalFeedback(true)}
											className="d-flex justify-content-center mx-auto mt-1"
											variant="outline-warning">Recebeu seu pedido? Avalie!
										</Button>
									</>
								}
							</Col>
						))}
					</Row>
				</>
			}

			<Modal show={modalOrderListing} onHide={() => setModalOrderListing(false)} size="lg" centered>
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

			<Modal show={modalFeedback} onHide={() => {setModalFeedback(false);}} size="lg" centered>
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
										type="text" 
										placeholder="Avaliação sobre o pedido e atendimento"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setModalFeedback(false)}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Enviar avaliação
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	);
}