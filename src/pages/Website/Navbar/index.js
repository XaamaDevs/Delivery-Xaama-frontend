//	Importing React main module and its features
import React, { useState } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { NavLink, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import {
	Navbar,
	Nav,
	Modal,
	Button,
	Tabs,
	Tab,
	Card,
	Form
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../Website/Alert";
import Push from "../../Website/Push";
import ProductDeck from "../../Website/ProductDeck";

//	Importing React icons features
import { RiShoppingBasketLine } from "react-icons/ri";

// Importing backend api
import api from "../../../services/api";

//	Exporting resource to routes.js
export default function WebsiteNavbar({ userId, setUserId, user, setUser, order, setOrder, companyInfo }) {
	//	Order state variables
	const [product, setProduct] = useState({});
	const [deliverAddress, setDeliverAdress] = useState(user.address ? user.address.join(", ") : "null");
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
				if(error.response && typeof(error.response.data) !== "object") {
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
												<RiShoppingBasketLine size="25" />
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
				className="p-0"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
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
										pattern="^([^\s,]+(\s[^\s,]+)*),\s?([0-9]+),\s?([^\s,]+(\s[^\s,]+)*)(,\s?[^\s,]+(\s[^\s,]+)*)?$"
										placeholder="Rua, Número, Bairro, Complemento (opcional)"
										disabled={!deliverOrder}
										required={deliverOrder}
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
									<ProductDeck.Header products={order.products} setProduct={setProduct} />
								</Card.Header>
								{product ? <ProductDeck.Card product={product} /> : null}
							</Card>
						</Tab>
					</Tabs>
				</Modal.Body>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
		</>
	);
}

WebsiteNavbar.propTypes = {
	userId : PropTypes.string.isRequired,
	setUserId : PropTypes.any.isRequired,
	user : PropTypes.object.isRequired,
	setUser : PropTypes.any.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.any.isRequired,
	companyInfo : PropTypes.object.isRequired
};