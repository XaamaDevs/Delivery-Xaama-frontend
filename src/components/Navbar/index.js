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
	const [orderDeliverAddress, setOrderDeliverAddress] = useState("");
	const [orderDeliverPhone, setOrderDeliverPhone] = useState("");
	const [orderDeliverAddressNumber, setOrderDeliverAddressNumber] = useState("");
	const [orderDeliverAddressCep, setOrderDeliverAddressCep] = useState("");
	const [orderDeliverAddressComplement, setOrderDeliverAddressComplement] = useState("");
	const [orderDeliver, setOrderDeliver] = useState(false);
	const [orderDeliverCoupon, setOrderDeliverCoupon] = useState(null);
	const [orderDeliverChange, setOrderDeliverChange] = useState(null);
	const [orderDeliverCardsDiscount, setOrderDeliverCardsDiscount] = useState(null);
	const [orderDeliverTotal, setOrderDeliverTotal] = useState(null);
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
	const [couponDiscountText, setCouponDiscountText] = useState("");
	const [finish, setFinish] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [userCoupons, setUserCoupons] = useState([]);

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

	//	Fetch user coupons data
	useEffect(() => {
		async function fetchData() {
			if(userId) {
				await api.get("coupon", {
					headers : {
						"x-access-token": userId
					}})
					.then((response) => {
						setUserCoupons(response.data);
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
		}

		fetchData();
	}, [shoppingBasketModal]);

	//	Update order delivery state variables
	useEffect(() => {
		var cardsDiscount = 0.0;

		if(user && user.cards && companyInfo && companyInfo.cards){
			user.cards.map((card,index) => {
				card.completed && !card.status && orderType && orderType.get(card.cardFidelity) ?
					cardsDiscount = parseInt(cardsDiscount) + parseInt((companyInfo.cards[index].discount < orderType.get(card.cardFidelity) ?
						companyInfo.cards[index].discount : orderType.get(card.cardFidelity)))
					:
					null;
			});
		}

		setOrderDeliverAddress(user.address && user.address.length ? user.address.join(", ") : "");
		setOrderDeliverAddressNumber(user.address && user.address.length ? user.address[1] : null);
		setOrderDeliverAddressComplement(user.address && user.address[3] ? user.address[3] : "");
		setOrderDeliverAddressCep(null);
		setOrderDeliverPhone(user.phone && user.phone.length ? user.phone : "");
		setOrderDeliver(false);
		setOrderDeliverCoupon(null);
		setOrderDeliverChange(null);
		setOrderDeliverCardsDiscount(cardsDiscount);
		setOrderDeliverTotal(order.total - cardsDiscount);
		setOrderDeliverChange(order.total - cardsDiscount);
		setCouponDiscountText("");
	}, [orderType, shoppingBasketModal]);

	//	Update order total and change when coupon is added or updated
	useEffect(() => {
		const freight = orderDeliver ? companyInfo.freight : 0;

		if(orderDeliverCoupon) {
			if(orderDeliverCoupon.type === "frete") {
				setOrderDeliverTotal(order.total - orderDeliverCardsDiscount);
				setOrderDeliverChange(order.total - orderDeliverCardsDiscount);
			} else if(orderDeliverCoupon.type === "valor" || orderDeliverCoupon.type === "quantidade") {
				const total = orderDeliverCoupon.method === "dinheiro" ?
					order.total - orderDeliverCardsDiscount - orderDeliverCoupon.discount + freight
					:
					order.total - orderDeliverCardsDiscount - (order.total*(orderDeliverCoupon.discount/100)) + freight;
				setOrderDeliverTotal(total < 0 ? 0 : total);
				setOrderDeliverChange(total < 0 ? 0 : total);
			}
		} else {
			setOrderDeliverTotal(order.total - orderDeliverCardsDiscount + freight);
			setOrderDeliverChange(order.total - orderDeliverCardsDiscount + freight);
		}
	}, [orderDeliverCoupon, orderDeliver]);

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

	}, [shoppingBasketModal]);

	//	Function to handle finish order
	async function handleFinishOrder(event) {
		event.preventDefault();
		history.push("/menu");

		setFinish(true);
		setLoading(true);

		var status = [];

		user.cards.map((card,index) => (
			card.completed && !card.status && orderType &&
				orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
				status.push(true) : status.push(card.status)
		));

		var data = {
			name: user.name,
			email: user.email,
			phone: user.phone ? user.phone : orderDeliverPhone,
			address: user.address ? user.address.join(", ") : (orderDeliverAddress ? orderDeliverAddress : "Rua, 1, Bairro, Casa"),
			status: status,
		};

		await api.put("user", data, {
			headers : {
				"x-access-token": userId
			}})
			.then((response) => {
				sessionStorage.setItem("userId", response.data.token);
				setUserId(response.data.token);
				setUser(response.data.user);
			}).catch((error) => {
				setTitle("Alerta!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});

		setData(new Date());

		const type = (!deliverCard && !deliverCash) ? 0 : (deliverCash && !deliverCard) ? 0 : 1;

		data = {
			products: order.products,
			deliver: orderDeliver,
			address: orderDeliverAddress,
			phone: orderDeliverPhone,
			typePayment: type,
			change: orderDeliverChange,
			total: orderDeliverTotal,
			couponId: orderDeliverCoupon ? orderDeliverCoupon._id : null
		};

		await api.post("order", data, {
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
						<Card.Body>
							<Form className="mx-auto my-2">
								<Form.Group controlId="userChange">
									<Row>
										<Col>
											<Form.Label className="mx-auto my-2"> Troco para R$: </Form.Label>
										</Col>
										<Col>
											<Form.Control
												value={orderDeliverChange}
												onChange={e => setOrderDeliverChange(e.target.value)}
												type="number"
												min={orderDeliverChange}
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
	async function validateCoupon(event) {
		event.preventDefault();

		if(!orderDeliverCoupon) {
			setTitle("Erro!");
			setMessage("Nenhum cupom selecionado!");
			setToastShow(true);
		} else {
			await api.put("couponUser/" + orderDeliverCoupon._id, null, {
				headers : {
					"x-access-token": userId
				}})
				.then((response) => {
					if(response.status === 200) {
						setTitle("Sucesso!");
						setMessage("Cupom validado.");
						setToastShow(true);
					} else {
						setTitle("Erro!");
						setMessage("Não foi possível validar o cupom.");
						setToastShow(true);
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

	//	Function to get address info via cep api
	async function getAddressInfo(event) {
		event.preventDefault();

		if(!orderDeliverAddressNumber.length) {
			setTitle("Erro!");
			setMessage("Número da residência inválido!");
			setToastShow(true);
		} else if(orderDeliverAddressCep.length != 8) {
			setTitle("Erro!");
			setMessage("CEP inválido! Digite um CEP válido com 8 dígitos.");
			setToastShow(true);
		} else {
			apicep.get(orderDeliverAddressCep + "/json")
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
						const complement = orderDeliverAddressComplement.length ? ", " + orderDeliverAddressComplement : "";
						setOrderDeliverAddress(`${response.data.logradouro}, ${orderDeliverAddressNumber}, ${response.data.bairro}${complement}`);
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
			<Navbar className="py-4 px-3" bg="transparent" expand="lg">
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
									<Form.Group as={Col} controlId="orderPhone" setShoppingBasketModal sm>
										<Form.Label>Telefone para contato: </Form.Label>
										<Form.Control
											value={orderDeliverPhone}
											onChange={e => setOrderDeliverPhone(e.target.value)}
											type="text"
											pattern="^\(?[0-9]{2}\)?\s?[0-9]?\s?[0-9]{4}-?[0-9]{4}$"
											placeholder="(__) _ ____-____"
											required
											autoFocus
										/>
									</Form.Group>
									<Form.Group as={Col} controlId="orderDeliverAddress" sm>
										<Form.Label>Entregar pedido?</Form.Label>
										<Form.Check
											type="switch"
											label={"+ R$" + companyInfo.freight + " de taxa de entrega"}
											checked={orderDeliver}
											onChange={e => setOrderDeliver(e.target.checked)}
										/>
									</Form.Group>
								</Row>
								{orderDeliver ?
									<>
										<Row>
											<Form.Group as={Col} controlId="orderDeliverAddressNumber" sm>
												<Form.Label>Número da residência</Form.Label>
												<Form.Control
													value={orderDeliverAddressNumber}
													onChange={e => setOrderDeliverAddressNumber(e.target.value)}
													type="number"
													min="0"
													placeholder="Número"
												/>
											</Form.Group>
											<Form.Group as={Col} controlId="orderDeliverAddressComplement" sm>
												<Form.Label>Complemento</Form.Label>
												<Form.Control
													value={orderDeliverAddressComplement}
													onChange={e => setOrderDeliverAddressComplement(e.target.value)}
													type="text"
													placeholder="Complemento (opcional)"
												/>
											</Form.Group>
										</Row>
										<Row>
											<Form.Group as={Col} controlId="orderDeliverAddressCep" sm>
												<Form.Label>CEP</Form.Label>
												<Form.Control
													value={orderDeliverAddressCep}
													onChange={e => setOrderDeliverAddressCep(e.target.value)}
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
											<Form.Group as={Col} controlId="orderDeliverAddress" sm>
												<Form.Label>Endereço de entrega:</Form.Label>
												<Form.Control
													value={orderDeliverAddress}
													onChange={e => setOrderDeliverAddress(e.target.value)}
													type="text"
													pattern="^([^\s,]+(\s[^\s,]+)*),\s?([0-9]+),\s?([^\s,]+(\s[^\s,]+)*)(,\s?[^\s,]+(\s[^\s,]+)*)?$"
													placeholder="Rua, Número, Bairro, Complemento (opcional)"
													disabled={!orderDeliver}
													required={orderDeliver}
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
								<Row>
									{!noCards ?
										user.cards && user.cards.length && orderType ?
											<OverlayTrigger
												placement="top"
												overlay={
													<Tooltip>
													OBS: Se o pedido de um produto for mais barato que o desconto desse produto,
													o desconto será o valor do pedido desse produto. O valor do frete não está incluso!
													</Tooltip>
												}
											>
												<FormGroup as={Col} controlId="deliverCard" sm>
													<Form.Label>Descontos por cartão fidelidade:</Form.Label>
													{user.cards.map((card,index) => (
														card.completed && !card.status && orderType && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
															<Row className="m-auto" key={index}>
															Completou o cartão {card.cardFidelity}
																<FormLabel style={{color: "#c83a34"}} >
																	<span>&nbsp;</span>-R${companyInfo.cards[index].discount < orderType.get(card.cardFidelity) ? companyInfo.cards[index].discount : orderType.get(card.cardFidelity)}
																</FormLabel>
															</Row>
															:
															(!card.completed && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
																<Row>
																	<Form.Label as={Col}>Seu cartão {card.cardFidelity} não está completo</Form.Label>
																</Row>
																:
																(card.status && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
																	<Row>
																		<Form.Label as={Col}>
																			Voce utilizou seu cartão {card.cardFidelity} no seu último pedido que ainda não foi enviado
																		</Form.Label>
																	</Row>
																	:
																	null
																)
															)
													))}
												</FormGroup>
											</OverlayTrigger>
											:
											null
										:
										null
									}
									<Form.Group as={Col} controlId="orderDeliverCoupon" sm>
										<Form.Label>Cupons:</Form.Label>
										<Form.Control
											value={null}
											onChange={e => {
												const cpn = userCoupons.find(c => c.name === e.target.value);
												setOrderDeliverCoupon(cpn ? cpn : null);
												setCouponDiscountText(cpn && cpn.method === "dinheiro" ?
													"R$ " + cpn.discount
													:
													cpn && cpn.method === "porcentagem" ?
														cpn.discount + "%"
														:
														null
												);
												setOrderDeliver(cpn && cpn.type === "frete" ? true : orderDeliver);
											}}
											as="select"
											placeholder="Cupons"
											required
										>
											<option disabled>Selecione o cupom desejado</option>
											<option>Sem cupom</option>
											{userCoupons.map((coupon, index) => (
												coupon.available && (
													(coupon.type === "frete" && orderDeliver) ||
													(coupon.type === "valor" && order.total >= coupon.minValue) ||
													(coupon.type === "quantidade")
												) ?
													<option key={index}>{coupon.name}</option>
													:
													<option key={index} disabled>{coupon.name}</option>
											))}
										</Form.Control>
										<Form.Text muted>
											{orderDeliverCoupon ?
												orderDeliverCoupon.type === "frete" ?
													"Cupom de frete - Seu pedido chegará em sua casa com frete grátis"
													:
													orderDeliverCoupon.type === "valor" ?
														`Cupom de valor - Como seu pedido atingiu o valor mínimo (R$ ${orderDeliverCoupon.minValue}), você tem ${couponDiscountText} de desconto`
														:
														orderDeliverCoupon.type === "quantidade" ?
															`Cupom de quantidade - Seu pedido tem ${couponDiscountText} de desconto`
															:
															null
												:
												"Nenhum cupom selecionado"
											}
										</Form.Text>
										<Button
											variant="light"
											id="btn-custom"
											size="sm"
											className="my-2"
											onClick={validateCoupon}
										>
											Validar cupom
										</Button>
									</Form.Group>
								</Row>
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
							{"Finalizar pedido +R$" + orderDeliverTotal}
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
	setUserId : PropTypes.func.isRequired,
	user : PropTypes.object.isRequired,
	setUser : PropTypes.func.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.func.isRequired,
	companyInfo : PropTypes.object.isRequired,
	companySystemOpenByHour : PropTypes.bool,
	setCompanySystemOpenByHour : PropTypes.func.isRequired,
	setData : PropTypes.func.isRequired,
	data : PropTypes.object.isRequired,
	noCards : PropTypes.bool.isRequired
};