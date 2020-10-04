//	Importing React main module and its features
import React, { useState  } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { NavLink, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import {
  Accordion,
	Navbar,
	Nav,
	Modal,
	Button,
	Tabs,
	Tab,
	Card,
  Form,
  Row,
  Col
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../Website/Alert";
import Push from "../../Website/Push";
import ProductDeck from "../../Website/ProductDeck";

//	Importing React icons features
import { RiShoppingBasketLine } from "react-icons/ri";

// Importing backend api
import api from "../../../services/api";
import { useEffect } from "react";

//	Exporting resource to routes.js
export default function WebsiteNavbar({ userId, setUserId, user, setUser, order, setOrder, companyInfo }) {
	//	Order state variables
	const [product, setProduct] = useState({});
	const [deliverAddress, setDeliverAdress] = useState(user.address && user.address.length ? user.address.join(", ") : "");
  const [deliverOrder, setDeliverOrder] = useState(false);
  const [deliverPhone, setDeliverPhone] = useState(user.phone && user.phone.length ? user.phone : "");
  const [deliverTroco, setDeliverTroco] = useState();
  const [deliverCash, setDeliverCash] = useState(false);
  const [deliverCard, setDeliverCard] = useState(false);

	//	Message settings
	const [shoppingBasketModal, setShoppingBasketModal] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	//	Defining history to jump through pages
  const history = useHistory();
  
  useEffect(() => {
    setDeliverTroco((order.total + (deliverOrder ? companyInfo.freight : 0)));
  }, [order.total, deliverOrder]);

	//	Function to handle finish order
	async function handleFinishOrder(event) {
    event.preventDefault();
    history.push("/menu");

    const type = (!deliverCard && !deliverCash) ? 0 : (deliverCash && !deliverCard) ? 0 : 1;

		const data = {
			user: order.user,
			products: order.products,
			deliver: deliverOrder,
      address: deliverAddress,
      typePayament: type,
      troco: deliverTroco,
      total: (order.total + (deliverOrder ? companyInfo.freight : 0))
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
  
  function Payament() {
    return (
      <Accordion defaultActiveKey="0">
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Accordion.Toggle 
                  as={Button} 
                  eventKey="0" 
                  onClick = {() => {setDeliverCash(true);setDeliverCard(false);}}>Dinheiro
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Total: R${(order.total + (deliverOrder ? companyInfo.freight : 0))}
                  <Form className="mx-auto my-2">
                    <Form.Group controlId="userChange">
                      <Row>
                        <Col>
                          <Form.Label className="my-2"> Troco para R$: </Form.Label>
                        </Col>
                        <Col>
                          <Form.Control
                            value={deliverTroco}
                            onChange={e => setDeliverTroco(e.target.value)}
                            type="number"
                            min={deliverTroco}
                            autoFocus
                            required={deliverCash}
                          />
                        </Col>
                      </Row>
                   </Form.Group>
                  </Form>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>
                <Accordion.Toggle 
                  as={Button} 
                  eventKey="1"
                  onClick = {() => {setDeliverCash(false);setDeliverCard(true);}}>Cartão</Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>Pagamento pela maquininha. Aceitamos cartão de débito e crédito!</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Col>
        </Row>
      </Accordion>
    );
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
							<Form onSubmit={handleFinishOrder} className="mx-auto my-2">
              <Form.Group controlId="userPhone">
                <Row>
                  <Col md="auto">
                    <Form.Label className="mx-auto my-2">Telefone para contato: </Form.Label>
                  </Col>
                  <Col md="auto">
                    <Form.Control
                      value={deliverPhone}
                      onChange={e => setDeliverPhone(e.target.value)}
                      type="text"
                      pattern="^\(?[0-9]{2}\)?\s?[0-9]?\s?[0-9]{4}-?[0-9]{4}$"
                      placeholder="(__) _ ____-____"
                      required
                    />
                  </Col>
                </Row>
								</Form.Group>
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
                {deliverOrder ?
                  <Form.Group controlId="deliverAddress">
                    <Form.Label>Endereço de entrega:</Form.Label>
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
                : 
                  null
                }
                <Form.Group controlId="deliverPayament">
                  <Form.Label>Forma de pagamento:</Form.Label>
                  <Payament />
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