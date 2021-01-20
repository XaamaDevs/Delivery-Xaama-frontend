//	Importing React main module and its features
import React, { useState, useEffect  } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import {
	Button,
	Tabs,
	Tab,
	Card,
	Container,
	Form,
	Row,
	Col,
	FormGroup,
	FormLabel,
	OverlayTrigger,
	Tooltip,
	Spinner,
	Nav
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../../components/Alert";
import Push from "../../../components/Push";
import ProductDeck from "../../../components/ProductDeck";

//	Importing React icons features
import {
	RiShoppingBasketLine,
	RiMoneyDollarBoxLine,
	RiMotorbikeFill,
	RiCheckLine
} from "react-icons/ri";

// Importing backend api and cep api
import api from "../../../services/api";
import apicep from "../../../services/apicep";

//	Exporting resource to routes.js
export default function FinishOrder({
	userId,
	setUserId,
	user,
	setUser,
	order,
	setOrder,
	companyInfo,
	companySystemOpenByHour,
	noCards
}) {
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
	const [orderDeliverPaymentMethod, setOrderDeliverPaymentMethod] = useState(null);

	//	Message settings
	const [toastShow, setToastShow] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	// Aux variables
	const [orderType, setOrderType] = useState(new Map);
	const [couponDiscountText, setCouponDiscountText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [userCoupons, setUserCoupons] = useState([]);
	const [finishOrderStep, setFinishOrderStep] = useState(0);

	//	Defining history to jump through pages
	const history = useHistory();

	//	Fetch user coupons data
	useEffect(() => {
		async function fetchData() {
			await api.get("coupon", {
				headers : {
					"x-access-token": userId
				}})
				.then((response) => {
					setUserCoupons(response.data);
				}).catch((error) => {
					setTitle("Alerta!");
					if(error.response.status === 404) {
						setUserCoupons([]);
					} else if(error.response.status === 500) {
						setMessage(error.message);
						setToastShow(true);
					} else {
						setMessage(error.response.data);
						setToastShow(true);
					}
				});
		}

		fetchData();
	}, [userId]);

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
		setOrderDeliverPaymentMethod(0);
		setOrderDeliverTotal(order.total - cardsDiscount);
		setOrderDeliverChange(order.total - cardsDiscount);
		setCouponDiscountText("");
	}, [orderType]);

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
		async function mapProductsByType() {
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

		mapProductsByType();

	}, []);

	//	Function to handle finish order
	async function handleFinishOrder(event) {
		event.preventDefault();

		setIsLoading(true);

		var status = [];

		user.cards.map((card, index) => (
			card.completed && !card.status && orderType &&
				orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
				status.push(true) : status.push(card.status)
		));

		var data = {
			name: user.name,
			email: user.email,
			phone: user.phone ? user.phone : orderDeliverPhone,
			address: user.address ? user.address.join(", ") : (orderDeliverAddress ? orderDeliverAddress : ""),
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

		data = {
			products: order.products,
			deliver: orderDeliver,
			address: orderDeliverAddress,
			phone: orderDeliverPhone,
			typePayment: orderDeliverPaymentMethod,
			change: orderDeliverChange,
			total: orderDeliverTotal,
			couponId: orderDeliverCoupon ? orderDeliverCoupon._id : null
		};

		await api.post("order", data, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setIsLoading(false);
				setFinishOrderStep(finishOrderStep+1);
				setOrder({ products: [] });
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

		if(!orderDeliverAddressNumber || !orderDeliverAddressNumber.length) {
			setTitle("Erro!");
			setMessage("Número da residência inválido!");
			setToastShow(true);
		} else if(!orderDeliverAddressCep || orderDeliverAddressCep.length != 8) {
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

	function Payment() {
		return (
			<Tabs
				fill
				defaultActiveKey="1"
				activeKey={!orderDeliverPaymentMethod ? "0" : "1"}
				onSelect={(k) => setOrderDeliverPaymentMethod(k !== "0")}
			>
				<Tab eventKey="0" title="Dinheiro">
					<Card>
						<Card.Body>
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
											required={!orderDeliverPaymentMethod}
											autoFocus
										/>
									</Col>
								</Row>
							</Form.Group>
						</Card.Body>
					</Card>
				</Tab>
				<Tab eventKey="1" title="Cartão">
					<Card>
						<Card.Body>Pagamento pela maquininha. Aceitamos cartão de débito e crédito!</Card.Body>
					</Card>
				</Tab>
			</Tabs>
		);
	}

	return (
		<>
			<Container className="bg-light text-dark rounded my-auto">
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Tab.Container defaultActiveKey={0} activeKey={finishOrderStep}>
					<Row className="h-100">
						<Col sm>
							<Nav variant="pills" className="flex-column h-100">
								<Nav.Item>
									<Nav.Link eventKey={0} disabled>
										<RiShoppingBasketLine className="my-0 mx-2" size="25" />
										Confirme seu pedido
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey={1} disabled>
										<RiMotorbikeFill className="my-0 mx-2" size="25" />
										Informações de entrega
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey={2} disabled>
										<RiMoneyDollarBoxLine className="my-0 mx-2" size="25" />
										Finalizar pedido
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey={3} disabled>
										<RiCheckLine className="my-0 mx-2" size="25" />
										Sucesso
									</Nav.Link>
								</Nav.Item>
								<Button
									variant="light"
									id="btn-custom"
									className={finishOrderStep === 3 ? "d-none" : "m-3 mt-auto"}
									onClick={() => {
										setOrder({});
										history.push("/");
									}}
								>
									Cancelar pedido
								</Button>
							</Nav>
						</Col>
						<Col className="p-0" sm="9">
							<Container className="px-0 py-2 h-100">
								<Tab.Content as={Col}>
									<Tab.Pane eventKey={0}>
										<Row>
											<Col>
												<ProductDeck products={order.products} />
											</Col>
										</Row>
										<Row className="text-right">
											<Col sm>
												<Button
													className="m-2"
													variant="warning"
													onClick={() => setFinishOrderStep(finishOrderStep+1)}
												>
													Próximo
												</Button>
											</Col>
										</Row>
									</Tab.Pane>
									<Tab.Pane eventKey={1}>
										<Form
											onSubmit={(e) => {
												e.preventDefault();
												setFinishOrderStep(finishOrderStep+1);
											}}
										>
											<Row>
												<Form.Group as={Col} controlId="orderPhone" sm>
													<Form.Label>Telefone para contato:</Form.Label>
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
											<Row className="text-right">
												<Col>
													<Button
														className="m-2"
														variant="danger"
														onClick={() => setFinishOrderStep(finishOrderStep-1)}
													>
														Voltar
													</Button>
													<Button
														className="m-2"
														variant="warning"
														type="submit"
													>
														Próximo
													</Button>
												</Col>
											</Row>
										</Form>
									</Tab.Pane>
									<Tab.Pane eventKey={2}>
										{isLoading ?
											<FormGroup className="d-flex justify-content-center">
												<Spinner
													animation="border"
													variant="warning"
												/>
											</FormGroup>
											:
											null
										}
										<Form onSubmit={handleFinishOrder}>
											<Row>
												{!noCards ?
													user.cards && user.cards.length && orderType ?
														<OverlayTrigger
															placement="bottom"
															overlay={
																<Tooltip>
																	OBS: Se o pedido de um produto for mais barato
																	que o desconto desse produto,
																	o desconto será o valor do pedido desse produto.
																	O valor do frete não está incluso!
																</Tooltip>
															}
														>
															<FormGroup as={Col} controlId="deliverCard" sm>
																<Form.Label>Descontos por cartão fidelidade:</Form.Label>
																{user.cards.map((card,index) => (
																	card.completed && !card.status &&
																	orderType && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
																		<Row className="m-auto" key={index}>
																			{`Completou o cartão de ${card.cardFidelity}`}
																			<FormLabel className="ml-1" style={{color: "#c83a34"}} >
																				{"-R$ " +
																					(companyInfo.cards[index].discount < orderType.get(card.cardFidelity) ?
																						companyInfo.cards[index].discount
																						:
																						orderType.get(card.cardFidelity)
																					)
																				}
																			</FormLabel>
																		</Row>
																		:
																		(!card.completed && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
																			<Row>
																				<Form.Label as={Col}>
																					{`Seu cartão de ${card.cardFidelity} não está completo`}
																				</Form.Label>
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
														value={""}
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
											<Row>
												<Form.Group as={Col} controlId="deliverPayment">
													<Form.Label>Forma de pagamento:</Form.Label>
													<Payment />
												</Form.Group>
											</Row>
											<Row className="text-right">
												<Col>
													<Button
														className="m-2"
														variant="danger"
														onClick={() => setFinishOrderStep(finishOrderStep-1)}
													>
														Voltar
													</Button>
													{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm) ||
													(companyInfo && !companyInfo.manual && companySystemOpenByHour) ?
														<Button
															className="mx-1"
															variant="warning"
															type="submit"
														>
															{"Finalizar pedido +R$" + orderDeliverTotal}
														</Button>
														:
														<Button
															className="mx-1"
															variant="light"
															id="btn-custom-outline"
														>
															Estamos fechados
														</Button>
													}
												</Col>
											</Row>
										</Form>
									</Tab.Pane>
									<Tab.Pane eventKey={3}>
										<Card className="text-center">
											<Card.Body>
												<Card.Title>
													Pedido enviado
												</Card.Title>
												<Card.Text>
													Obrigado pela preferência! Acompanhe seu pedido na seção Meus Pedidos.
												</Card.Text>
												<Button
													variant="warning"
													className="m-1"
													onClick={() => { setOrder({}); history.push("/order"); }}
												>
													Meus Pedidos
												</Button>
											</Card.Body>
										</Card>
									</Tab.Pane>
								</Tab.Content>
							</Container>
						</Col>
					</Row>
				</Tab.Container>
			</Container>

			<Alert.Close modalAlert={modalAlert} setModalAlert={setModalAlert} title={title} message={message} />
		</>
	);
}

FinishOrder.propTypes = {
	userId : PropTypes.string,
	setUserId : PropTypes.func.isRequired,
	user : PropTypes.object.isRequired,
	setUser : PropTypes.func.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.func.isRequired,
	companyInfo : PropTypes.object.isRequired,
	companySystemOpenByHour : PropTypes.bool,
	noCards : PropTypes.bool.isRequired
};