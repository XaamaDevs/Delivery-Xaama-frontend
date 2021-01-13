//	Importing React main module and its features
import React, { useState, useEffect  } from "react";
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
	Form,
	Row,
	Col,
	Image,
	FormGroup,
	FormLabel,
	OverlayTrigger,
	Tooltip,
	Spinner
} from "react-bootstrap";

//	Importing website utils
import Alert from "../Alert";
import Push from "../Push";
import ProductDeck from "../ProductDeck";

//	Importing React icons features
import { RiShoppingBasketLine } from "react-icons/ri";

// Importing backend api and cep api
import api from "../../services/api";
import apicep from "../../services/apicep";

//	Exporting resource to routes.js
export default function WebsiteNavbar({
	userId,
	setUserId,
	user,
	setUser,
	order,
	setOrder,
	companyInfo,
	companySystemOpenByHour,
	setCompanySystemOpenByHour,
	setData,
	data,
	noCards }) {
	//	Order state variables
	const [deliverAddress, setDeliverAdress] = useState("");
	const [deliverPhone, setDeliverPhone] = useState("");
	const [deliverAddressNumber, setDeliverAddressNumber] = useState("");
	const [deliverAddressCep, setDeliverAddressCep] = useState("");
	const [deliverAddressComplement, setDeliverAddressComplement] = useState("");
	const [deliverOrder, setDeliverOrder] = useState(false);
	const [deliverChange, setDeliverChange] = useState();
	const [deliverCash, setDeliverCash] = useState(false);
	const [deliverCard, setDeliverCard] = useState(false);

	//	Message settings
	const [shoppingBasketModal, setShoppingBasketModal] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [modalTimetable, setModalTimetable] = useState(false);

	// Aux variables
	const [orderType, setOrderType] = useState(new Map);
	const [discount, setDiscount] = useState(0);
	const [finish, setFinish] = useState(false);
	const [isLoading, setLoading] = useState(true);

	// Tabs settings
	const [eventKey, setEventKey] = useState("0");

	//  Current day of the week and time
	const [systemHour, setSystemHour] = useState(data && data.getHours() && data.getMinutes() ? data.getHours() + ":" + data.getMinutes() : "");

	//	Defining history to jump through pages
	const history = useHistory();

	//  Updating system time
	useEffect(() => {
		function systemOpen() {
			const openHour = data && companyInfo && companyInfo.timetable &&
											companyInfo.timetable[data.getDay()].beginHour ?
				companyInfo.timetable[data.getDay()].beginHour : "";

			const endHour = data && companyInfo && companyInfo.timetable &&
											companyInfo.timetable[data.getDay()].endHour ?
				companyInfo.timetable[data.getDay()].endHour : "";

			const current = new Date("2020-07-28 " + systemHour);
			const open = new Date("2020-07-28 " + openHour);
			const end = new Date("2020-07-28 " + endHour);

			if(end.getTime() < open.getTime()) {
				if ((current.getTime() >= open.getTime()) || (current.getTime() <= end.getTime())) {
					return true;
				} else {
					return false;
				}
			} else if ((current.getTime() >= open.getTime()) && (current.getTime() <= end.getTime())) {
				return true;
			} else {
				return false;
			}
		}

		setSystemHour(data ? data.getHours() + ":" + data.getMinutes() : "");
		setCompanySystemOpenByHour(systemOpen() ? true : false);
	}, [data, setSystemHour, setCompanySystemOpenByHour, companyInfo, systemHour]);

	useEffect(() => {
		setDeliverChange((order.total - discount + (deliverOrder ? companyInfo.freight : 0)));
	}, [order.total, deliverOrder, companyInfo.freight, discount]);

	//	Update order state variables
	useEffect(() => {
		setDeliverAdress(user.address && user.address.length ? user.address.join(", ") : "");
		setDeliverPhone(user.phone && user.phone.length ? user.phone : "");
	}, [shoppingBasketModal]);

	useEffect(() => {
		async function Products() {
			var myMapTypesProducts = new Map();

			//	Calculate order total price
			if(order && order.products){
				for(var x of order.products) {
					if(x.size >= 0 && x.size < x.product.prices.length) {
						myMapTypesProducts.set(x && x.product.type ? x.product.type : "",
							myMapTypesProducts.get(x.product.type) ? (myMapTypesProducts.get(x.product.type) + x.product.prices[x.size]) :
								x.product.prices[x.size]);
					}

					if(x.additions && x.additions.length) {
						for(var y of x.additions) {
							myMapTypesProducts.set(x && x.product.type ? x.product.type : "",
								myMapTypesProducts.get(x.product.type) ? (myMapTypesProducts.get(x.product.type) + y.price) :
									y.price);
						}
					}
				}
			}

			setOrderType(myMapTypesProducts);
		}

		Products();

	}, [order.products, shoppingBasketModal]);

	useEffect(() => {
		var d = 0;
		if(user && user.cards && companyInfo && companyInfo.cards){
			user.cards.map((card,index) => {
				card.completed && !card.status && orderType && orderType.get(card.cardFidelity) ?
					d = parseInt(d) + parseInt((companyInfo.cards[index].discount < orderType.get(card.cardFidelity) ?
						companyInfo.cards[index].discount : orderType.get(card.cardFidelity)))
					:
					null;
			});
		}
		setDiscount(d);
	}, [orderType, shoppingBasketModal]);

	//	Function to handle finish order
	async function handleFinishOrder(event) {
		event.preventDefault();
		history.push("/menu");

		setData(new Date());

		const type = (!deliverCard && !deliverCash) ? 0 : (deliverCash && !deliverCard) ? 0 : 1;

		var data = {
			user: order.user,
			products: order.products,
			deliver: deliverOrder,
			address: deliverAddress,
			phone: deliverPhone,
			typePayment: type,
			change: deliverChange,
			total: (order.total - discount + (deliverOrder ? companyInfo.freight : 0))
		};

		setFinish(true);
		setLoading(true);

		var orderOk = false;

		await api.post("order", data)
			.then(() => {
				orderOk = true;
			}).catch((error) => {
				setTitle("Alerta!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});

		var status = [];

		user.cards.map((card,index) => (
			card.completed && !card.status && orderType &&
				orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
				status.push(true) : status.push(card.status)
		));

		if(orderOk) {
			data = {
				name: user.name,
				email: user.email,
				phone: user.phone ? user.phone : deliverPhone,
				address: user.address ? user.address.join(", ") : (deliverAddress ? deliverAddress : "Rua, 1, Bairro, Casa"),
				status: status,
			};

			await api.put("user", data, {
				headers : {
					"x-access-token": userId
				}})
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

		setLoading(false);
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

	function Payment() {
		return (
			<Tabs
				fill
				defaultActiveKey="1"
				id="uncontrolled-tabs"
				activeKey={eventKey}
				onSelect={(k) => setEventKey(k)} >

				<Tab eventKey="1" title="Dinheiro">
					{eventKey === "1" ? setDeliverCash(true) : null}
					{eventKey === "1" ? setDeliverCard(false): null}
					<Card>
						<Card.Body>Total: R${(order.total - discount + (deliverOrder ? companyInfo.freight : 0))}
							<Form className="mx-auto my-2">
								<Form.Group controlId="userChange">
									<Row>
										<Col>
											<Form.Label className="mx-auto my-2"> Troco para R$: </Form.Label>
										</Col>
										<Col>
											<Form.Control
												value={deliverChange}
												onChange={e => setDeliverChange(e.target.value)}
												type="number"
												min={deliverChange}
												required={deliverCash}
												autoFocus
											/>
										</Col>
									</Row>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>
				</Tab>
				<Tab eventKey="0" title="Cartão" >
					<Card>
						{eventKey === "0" ? setDeliverCash(false) : null}
						{eventKey === "0" ? setDeliverCard(true): null}
						<Card.Body>Pagamento pela maquininha. Aceitamos cartão de débito e crédito!</Card.Body>
					</Card>
				</Tab>
			</Tabs>
		);
	}

	//	Function to get address info via cep api
	async function getAddressInfo(event) {
		event.preventDefault();

		if(!deliverAddressNumber.length) {
			setTitle("Erro!");
			setMessage("Número da residência inválido!");
			setToastShow(true);
		} else if(deliverAddressCep.length != 8) {
			setTitle("Erro!");
			setMessage("CEP inválido! Digite um CEP válido com 8 dígitos.");
			setToastShow(true);
		} else {
			apicep.get(deliverAddressCep + "/json")
				.then((response) => {
					if(response.data.erro) {
						setTitle("Erro!");
						setMessage("CEP inexistente! Tente outro valor.");
						setToastShow(true);
					} else if(!response.data.logradouro) {
						setTitle("Incompleto!");
						setMessage("O CEP não contém todas as informações! Digite o endereço manualmente.");
						setToastShow(true);
					}	else {
						const complement = deliverAddressComplement.length ? ", " + deliverAddressComplement : "";
						setDeliverAdress(`${response.data.logradouro}, ${deliverAddressNumber}, ${response.data.bairro}${complement}`);
					}
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
	}

	return (
		<>
			<Navbar className="py-5 px-3" bg="transparent" expand="lg">
				<NavLink to="/" className="navbar-brand text-warning mx-5 p-0">
					{companyInfo.logo ?
						<Image
							className={"border-0 m-auto"}
							width="100px"
							src={process.env.REACT_APP_API_URL + companyInfo.logo_url}
							alt="Logo"
							fluid
						/>
						:
						companyInfo.name
					}
				</NavLink>
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
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								className="nav-link mx-2"
								to="#"
								onClick={() => setModalTimetable(true)}
							>
								Horário de Funcionamento
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
												className="nav-link mx-2"
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
				onHide={() => { setToastShow(false); setShoppingBasketModal(false); }}
				size="lg"
				className="p-0"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title><RiShoppingBasketLine size="25" /> Cesta de compras</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{isLoading && finish ?
						<FormGroup className="d-flex justify-content-center">
							<Spinner
								animation="border"
								variant="warning"
							/>
						</FormGroup>
						:
						null
					}
					<Tabs fill defaultActiveKey="finishOrder" id="uncontrolled-tab-example">
						<Tab eventKey="finishOrder" title="Finalizar pedido">
							<Form onSubmit={handleFinishOrder} className="mx-auto my-2">
								<Row>
									<Form.Group as={Col} controlId="userPhone" setShoppingBasketModal>
										<Form.Label>Telefone para contato: </Form.Label>
										<Form.Control
											value={deliverPhone}
											onChange={e => setDeliverPhone(e.target.value)}
											type="text"
											pattern="^\(?[0-9]{2}\)?\s?[0-9]?\s?[0-9]{4}-?[0-9]{4}$"
											placeholder="(__) _ ____-____"
											required
											autoFocus
										/>
									</Form.Group>
									<Form.Group as={Col} controlId="deliverAddress" sm>
										<Form.Label>Entregar pedido?</Form.Label>
										<Form.Check
											type="switch"
											label={"+ R$" + companyInfo.freight + " de taxa de entrega"}
											checked={deliverOrder}
											onChange={e => setDeliverOrder(e.target.checked)}
										/>
									</Form.Group>
								</Row>
								{deliverOrder ?
									<>
										<Row>
											<Form.Group as={Col} controlId="deliverAddressNumber" sm>
												<Form.Label>Número da residência</Form.Label>
												<Form.Control
													value={deliverAddressNumber}
													onChange={e => setDeliverAddressNumber(e.target.value)}
													type="number"
													min="0"
													placeholder="Número"
												/>
											</Form.Group>
											<Form.Group as={Col} controlId="deliverAddressComplement" sm>
												<Form.Label>Complemento</Form.Label>
												<Form.Control
													value={deliverAddressComplement}
													onChange={e => setDeliverAddressComplement(e.target.value)}
													type="text"
													placeholder="Complemento (opcional)"
												/>
											</Form.Group>
										</Row>
										<Row>
											<Form.Group as={Col} controlId="deliverAddressCep" sm>
												<Form.Label>CEP</Form.Label>
												<Form.Control
													value={deliverAddressCep}
													onChange={e => setDeliverAddressCep(e.target.value)}
													type="number"
													min="0"
													max="99999999"
													placeholder="CEP"
												/>
												<Button
													variant="light"
													id="btn-custom"
													size="sm"
													className="my-2"
													onClick={getAddressInfo}
												>
													Verificar CEP
												</Button>
											</Form.Group>
											<Form.Group as={Col} controlId="deliverAddress" sm>
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
										</Row>
									</>
									:
									null
								}

								{ !noCards ?
									<OverlayTrigger
										placement="top"
										overlay={
											<Tooltip>
												OBS: Se o pedido de um produto for mais barato que o desconto desse produto, o desconto será o valor do pedido desse produto. O valor do frete não está incluso!
											</Tooltip>
										}
									>
										<FormGroup>
											<Form.Label>Descontos por cartão fidelidade:</Form.Label>
										</FormGroup>
									</OverlayTrigger>
									:
									null
								}

								{	user.cards && user.cards.length && orderType && !noCards ?
									<FormGroup>
										{user.cards.map((card,index) => (
											card.completed && !card.status && orderType && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
												<>
													<Row className="m-auto" key={index}>
														Completou o cartão {card.cardFidelity}
														<FormLabel style={{color: "#c83a34"}} >
															<span>&nbsp;</span>-R${companyInfo.cards[index].discount < orderType.get(card.cardFidelity) ? companyInfo.cards[index].discount : orderType.get(card.cardFidelity)}
														</FormLabel>
													</Row>
												</>
												:
												(!card.completed && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
													<>
														<Form.Label>Seu cartão {card.cardFidelity} não está completo</Form.Label>
														<br></br>
													</>
													:
													(card.status && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
														<>
															<Form.Label>Voce utilizou seu cartão {card.cardFidelity} no seu último pedido que ainda não foi enviado</Form.Label>
															<br></br>
														</>
														:
														null)
												)
										))}
									</FormGroup>
									:
									null
								}
								<Form.Group controlId="deliverPayment">
									<Form.Label>Forma de pagamento:</Form.Label>
									<Payment />
								</Form.Group>
							</Form>
						</Tab>
						<Tab eventKey="order" title="Ver pedido">
							<ProductDeck products={order.products} />
						</Tab>
					</Tabs>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={() => {
							setToastShow(false);
							setShoppingBasketModal(false);
						}}
					>
						Fechar
					</Button>
					{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
						|| (companyInfo && !companyInfo.manual && companySystemOpenByHour) ?
						<Button variant="warning" type="submit" onClick={handleFinishOrder}>
							{"Finalizar pedido +R$" + (order.total - discount + (deliverOrder ? companyInfo.freight : 0))}
						</Button>
						:
						<Button variant="danger">
							Estamos fechados
						</Button>
					}
				</Modal.Footer>
			</Modal>

			<Modal
				show={modalTimetable}
				onHide={() => {setModalTimetable(false); setToastShow(false);}}
				size="md"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Horário de Funcionamento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{
						(companyInfo && companyInfo.timetable && companyInfo.timetable.length ? companyInfo.timetable.map((t, index) => (
							<Row key={index} className="mt-2">
								<Col className="text-center my-2 ml-auto p-0 pl-2">
									{t.dayWeek}:
								</Col>
								{(t.beginHour && t.endHour ?
									<>
										<Col className="text-center my-2 p-0">
											De
										</Col>
										<Col className="text-center my-2 p-0">
											{t.beginHour}
										</Col >
										<Col className="text-center my-2 p-0">
											às
										</Col>
										<Col className="text-center my-2 mr-auto p-0 pr-2">
											{t.endHour}
										</Col>
									</>
									:
									<Col className="text-center my-2 mr-auto p-0 pr-2">
										Fechado
									</Col>
								)}
							</Row>
						))
							:
							<Row>
								<Col className="my-2" md="auto">
								Horário indisponível
								</Col>
							</Row>
						)}
				</Modal.Body>
				<Modal.Footer>
					{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
						|| (companyInfo && !companyInfo.manual && companySystemOpenByHour) ?
						<Button
							variant="light"
							size="md"
							id="btn-custom"
						>
							Aberto agora
						</Button>
						:
						<Button
							variant="danger"
						>
							Fechado
						</Button>
					}
					<Button variant="warning" onClick={() => { setModalTimetable(false); setToastShow(false); }}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
		</>
	);
}

WebsiteNavbar.propTypes = {
	userId : PropTypes.string,
	setUserId : PropTypes.any.isRequired,
	user : PropTypes.object.isRequired,
	setUser : PropTypes.any.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.any.isRequired,
	companyInfo : PropTypes.object.isRequired,
	companySystemOpenByHour : PropTypes.object.isRequired,
	setCompanySystemOpenByHour : PropTypes.any.isRequired,
	setData : PropTypes.any.isRequired,
	data : PropTypes.any.isRequired,
	noCards : PropTypes.any.isRequired
};