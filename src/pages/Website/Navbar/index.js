//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { NavLink, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import {
	Navbar,
	Nav,
	Modal,
	Toast,
	Button,
	Tabs,
	Tab,
	Card,
	CardDeck,
	Row,
	Col,
	Form,
	Image
} from "react-bootstrap";

//	Importing React icons features
import { RiShoppingBasketLine } from "react-icons/ri";

// Importing backend api
import api from "../../../services/api";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Exporting resource to routes.js
export default function WebsiteNavbar({ userId, setUserId, user, setUser, order, setOrder, companyInfo }) {
	//	Order state variables
	const [product, setProduct] = useState({});
	const [deliverAddress, setDeliverAdress] = useState(user.address.join(", "));
	const [deliverOrder, setDeliverOrder] = useState(false);

	//	Message settings
	const [shoppingBasketModal, setShoppingBasketModal] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	//	Defining history to jump through pages
	const history = useHistory();

	//	Function to handle finish order
	async function handleFinishOrder(event) {
		event.preventDefault();

		const data = {
			user: order.user,
			products: order.products,
			deliver: deliverOrder,
			address: deliverAddress
		};

		await api.post("order", data)
			.then(() => {
				setTitle("Pedido enviado!");
				setMessage("Obrigado pela preferência! Acompanhe seu pedido na seção Meus pedidos.");
				setShoppingBasketModal(false);
				setModalAlert(true);
			}).catch((error) => {
				setTitle("Alerta!");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	//	Function to handle user logout
	async function handleLogout(event) {
		event.preventDefault();

		try {
			sessionStorage.removeItem("userId");

			setUserId(sessionStorage.getItem("userId"));
			setUser({});
			setOrder({});

			history.push("/");
		} catch (error) {
			alert(error);
		}
	}

	const header = (
		<Nav fill variant="tabs">
			{order.products ?
				order.products.map((productO, index) => (
					<Nav.Item key={index}>
						<Nav.Link
							className="btn-outline-dark rounded"
							href={"#" + index}
							onClick={() => setProduct(productO)}
						>
							{productO.product.name}
						</Nav.Link>
					</Nav.Item>
				))
				:
				null
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
								<Card bg="secondary">
									<Card.Body>
										<Card.Title>{product.additions.length ? "Adições:" : "Sem Adições"}</Card.Title>
										{product.additions.length ?
											<Card.Text>
												<Row>
													{(product.additions).map(addition => (
														<Col key={(addition) ? addition._id : null } sm>
															{addition.name}
															<small>{"Preço: R$" + addition.price}</small>
														</Col>
													))}
												</Row>
											</Card.Text>
											:
											null
										}
									</Card.Body>
								</Card>
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
				position: "fixed",
				top: "inherit",
				right: "3%",
				zIndex: 5
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
		<>
			<Navbar className="text-warning py-5 px-3" bg="transparent" expand="lg">
				<NavLink to="/" className="navbar-brand text-warning mx-5">{companyInfo.name}</NavLink>
				<Navbar.Toggle className="bg-warning" aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								exact activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/"
								className="nav-link mx-2"
							>
								Início
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/menu"
								className="nav-link mx-2"
							>
								Cardápio
							</NavLink>
						</Nav.Item>
						{user && (user.userType === 1 || user.userType === 2) ?
							<Nav.Item>
								<NavLink
									style={{color: "#ffbf00"}}
									activeClassName="activeRoute"
									activeStyle={{ color: "white" }}
									to="/additions"
									className="nav-link mx-2"
								>
									Adições
								</NavLink>
							</Nav.Item>
							:
							null
						}
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/about"
								className="nav-link mx-2"
							>
								Sobre
							</NavLink>
						</Nav.Item>
					</Nav>
					{!userId ?
						<Nav className="ml-auto">
							<Nav.Item>
								<NavLink
									style={{color: "#ffbf00"}}
									activeClassName="activeRoute"
									activeStyle={{ color: "white" }}
									to="/login"
									className="nav-link mx-2"
								>
									Entrar
								</NavLink>
							</Nav.Item>
							<Nav.Item>
								<NavLink
									style={{color: "#ffbf00"}}
									activeClassName="activeRoute"
									activeStyle={{ color: "white" }}
									to="/signup"
									className="nav-link mx-2"
								>
									Cadastrar
								</NavLink>
							</Nav.Item>
						</Nav>
						:
						<Nav className="ml-auto">
							{user.userType === 0 ?
								<>
									{order.products && order.products.length ?
										<Nav.Item>
											<NavLink
												style={{color: "#ffbf00"}}
												to="#"
												className="nav-link"
												onClick={() => setShoppingBasketModal(true)}
											>
												<RiShoppingBasketLine size="20" />
											</NavLink>
										</Nav.Item>
										:
										null
									}
									<Nav.Item>
										<NavLink
											style={{color: "#ffbf00"}}
											activeClassName="activeRoute"
											activeStyle={{ color: "white" }}
											to="/order"
											className="nav-link mx-2"
										>
											Meus Pedidos
										</NavLink>
									</Nav.Item>
								</>
								:
								null
							}
							<Nav.Item>
								<NavLink
									style={{color: "#ffbf00"}}
									activeClassName="activeRoute"
									activeStyle={{ color: "white" }}
									to="/user"
									className="nav-link mx-2"
								>
									Perfil
								</NavLink>
							</Nav.Item>
							<Nav.Item>
								<NavLink
									style={{color: "#ffbf00"}}
									to="#"
									onClick={handleLogout}
									className="nav-link mx-2"
								>
									Sair
								</NavLink>
							</Nav.Item>
						</Nav>
					}
				</Navbar.Collapse>
			</Navbar>

			<Modal
				show={shoppingBasketModal}
				onHide={() => { setProduct({}); setToastShow(false); setShoppingBasketModal(false); }}
				size="lg"
				centered
			>
				{toast}
				<Modal.Header closeButton>
					<Modal.Title>Cesta de compras</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Tabs fill defaultActiveKey="finishOrder" id="uncontrolled-tab-example">
						<Tab eventKey="finishOrder" title="Finalizar pedido">
							<Form onSubmit={handleFinishOrder}>
								<Form.Group controlId="deliverAddress">
									<Form.Label>
										{"Deseja que o seu pedido seja entregue? +R$" + companyInfo.freight + " de taxa de entrega"}
									</Form.Label>
									<Form.Check
										type="switch"
										id="custom-switch"
										label="Marque aqui"
										checked={deliverOrder}
										onChange={e => setDeliverOrder(e.target.checked)}
									/>
								</Form.Group>
								<Form.Group controlId="deliverAddress">
									<Form.Label>Endereço</Form.Label>
									<Form.Control
										value={deliverAddress}
										onChange={e => setDeliverAdress(e.target.value)}
										type="text"
										pattern="^[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+,\s?[0-9]+,\s?[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+(,\s?[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+)?$"
										placeholder="Rua, Número, Bairro, Complemento (opcional)"
										disabled={!deliverOrder}
									/>
									<Form.Text className="text-muted">
										Separe rua, número, bairro e complemento por vírgula
									</Form.Text>
								</Form.Group>
								<Modal.Footer>
									<Button
										variant="danger"
										onClick={() => {
											setProduct({});
											setToastShow(false);
											setShoppingBasketModal(false);
										}}
									>
										Fechar
									</Button>
									<Button variant="warning" type="submit">
										{"Finalizar pedido +R$" + (order.total + (deliverOrder ? companyInfo.freight : 0))}
									</Button>
								</Modal.Footer>
							</Form>
						</Tab>
						<Tab eventKey="order" title="Ver pedido">
							<Card bg="light" >
								<Card.Header>
									{header}
								</Card.Header>
								{product ? productCard(product) : null}
							</Card>
						</Tab>
					</Tabs>
				</Modal.Body>
			</Modal>

			<Modal show={modalAlert} onHide={() => setModalAlert(false)}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => { setModalAlert(false); history.go(); }}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}