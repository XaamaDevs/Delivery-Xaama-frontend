//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

// Importing backend api
import api from "../../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing React features
import { Card, CardDeck, Nav, Button, Modal, Row, Col, Spinner, Container } from "react-bootstrap";

//	Exporting resource to routes.js
export default function AllOrders({ userId }) {
	const [orders, setOrders] = useState([]);
	const [orderA, setOrderA] = useState({});
	const [product, setProduct] = useState({});
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");

	//	Modal settings
	const [modalOrderListing, setModalOrderListing] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [isLoading, setLoading] = useState(true);

	const history = useHistory();

	useEffect(() => {
		async function loadOrder() {
			const response = await api.get("/order", {
				headers : {
					authorization: userId
				}
			});
			setOrders(response.data);
			setLoading(false);
		}

		loadOrder();
	}, []);

	async function handleSetOrder(event, order) {
		event.preventDefault();
		setOrderA(order);
		setModalOrderListing(true);
	}

	const header = (
		<Nav fill variant="tabs" defaultActiveKey={"#0"}>
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

	

	async function handleProductList(event, productA) {
		event.preventDefault();
		setProduct(productA);
	}
	
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
				<Row xs={1} sm={2} md={3} xl={4} className="d-flex justify-content-around m-auto w-100" >
					{orders.map(order => (
						<Col key={order._id} className="order-item" >
							<header>
								<img src={order.user.thumbnail ? order.user.thumbnail_url: camera } />
								<div className="order-info">
									<strong>{order.user.name}</strong>
									<span>{order.user.email}</span>
								</div>             
							</header>
							<p>{order.user.phone ? order.phone: "Telefone: (__) _ ____-____"}</p>
							<p>{order.user.address && order.user.address.length ? order.user.address.join(", ") : "Endereço não informado" }</p>
							<Button
								onClick={e => handleSetOrder(e, order)}
								variant="outline-warning">Ver pedido
							</Button>
						</Col>
					))}
				</Row>
			}

			<Modal show={modalOrderListing} onHide={e => setModalOrderListing(false)} size="lg" centered>
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
							product ?
								<CardDeck className="p-2">
									<Card className="col-sm-4 my-1 p-0" bg="secondary" key={product._id}>
										<Card.Img variant="top" src={product.product ? product.product.thumbnail_url : camera} fluid />
										<Card.Body className="d-flex align-content-between flex-column" key={product._id}>
											<Card.Title>{product.product ? product.product.name : null }</Card.Title>
											<Card.Text>
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
								null
						}
					</Card>
					
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={e => setModalOrderListing(false)}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
			
			<Modal show={modalAlert} onHide={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant={color} onClick={e => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}