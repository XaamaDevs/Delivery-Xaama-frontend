//	Importing React main module and its features
import React, { useState, useEffect } from "react";
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
	Image,
	FormGroup,
	FormLabel,
	OverlayTrigger,
	Tooltip,
	Spinner,
	Modal,
	Nav
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../../components/Alert";
import Push from "../../../components/Push";
import Loading from "../../../components/Loading";

//	Importing React icons features
import {
	RiShoppingBasketLine,
	RiMoneyDollarBoxLine,
	RiMotorbikeFill,
	RiCheckLine
} from "react-icons/ri";

import {
	BsFillTrashFill
} from "react-icons/bs";

// Importing image from camera
import camera from "../../../assets/camera.svg";

// Importing backend api and cep api
import api from "../../../services/api";
import apicep from "../../../services/apicep";

//	Exporting resource to routes.js
export default function FinishOrder({
	userId,
	user,
	setUser,
	order,
	setOrder,
	companyInfo,
	companySystemOpenByHour,
	noCards
}) {
	//	Order state variables
	const [orderDeliverProducts, setOrderDeliverProducts] = useState([]);
	const [orderDeliverPhone, setOrderDeliverPhone] = useState("");
	const [orderDeliverAddress, setOrderDeliverAddress] = useState("");
	const [orderDeliverAddressNumber, setOrderDeliverAddressNumber] = useState("");
	const [orderDeliverAddressNeighborhood, setOrderDeliverAddressNeighborhood] = useState("");
	const [orderDeliverAddressCep, setOrderDeliverAddressCep] = useState("");
	const [orderDeliverAddressComplement, setOrderDeliverAddressComplement] = useState("");
	const [orderDeliver, setOrderDeliver] = useState(false);
	const [orderDeliverCoupon, setOrderDeliverCoupon] = useState(null);
	const [orderCouponValidated, setOrderCouponValidated] = useState(false);
	const [orderDeliverChange, setOrderDeliverChange] = useState(null);
	const [orderDeliverCardsDiscount, setOrderDeliverCardsDiscount] = useState(null);
	const [orderDeliverTotal, setOrderDeliverTotal] = useState(null);
	const [orderDeliverPaymentMethod, setOrderDeliverPaymentMethod] = useState(null);

	//	Message settings
	const [toastShow, setToastShow] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [modalDeleteProduct, setModalDeleteProduct] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	// Aux variables
	const [orderType, setOrderType] = useState(new Map());
	const [couponDiscountText, setCouponDiscountText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [userCoupons, setUserCoupons] = useState([]);
	const [finishOrderStep, setFinishOrderStep] = useState(0);
	const [productType, setProductType] = useState("");
	const [productName, setProductName] = useState("");
	const [productIndex, setProductIndex] = useState(-1);

	//	Defining history to jump through pages
	const history = useHistory();

	//	Fetch user coupons data
	useEffect(() => {
		async function fetchData() {
			await api.get("user", {
				headers: {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
					setUser(response.data);
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && error.response.status === 400) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 404) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 500) {
					setMessage(error.message);
				} else {
					setMessage("Algo deu errado :(");
				}
				setToastShow(true);
			});

			await api.get("coupon", {
				headers: {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
					setUserCoupons(response.data);
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && error.response.status === 400) {
					setMessage(error.response.data);
					setToastShow(true);
				} else if(error.response && error.response.status === 404) {
					setUserCoupons([]);
				} else if(error.response && error.response.status === 500) {
					setMessage(error.message);
					setToastShow(true);
				} else {
					setMessage("Algo deu errado :(");
					setToastShow(true);
				}
			});

			const prods = [];
			for(const prod of order.products) {
				const p = { size: prod.size, note: prod.note };

				await api.get(`product/${prod.product}`)
					.then((resProd) => {
						if(resProd.status === 200) {
							p.product = resProd.data;
						}
					}).catch((error) => {
						setTitle("Erro!");
						if(error.response && error.response.status === 400) {
							setMessage(error.response.data);
							setToastShow(true);
						} else if(error.response && error.response.status === 404) {
							setUserCoupons([]);
						} else if(error.response && error.response.status === 500) {
							setMessage(error.message);
							setToastShow(true);
						} else {
							setMessage("Algo deu errado :(");
							setToastShow(true);
						}
					});

				const adds = [];
				for(const add of prod.additions) {
					await api.get(`addition/${add}`)
						.then((response) => {
							if(response.status === 200) {
								adds.push(response.data);
							}
						}).catch((error) => {
							setTitle("Erro!");
							if(error.response && error.response.status === 400) {
								setMessage(error.response.data);
								setToastShow(true);
							} else if(error.response && error.response.status === 404) {
								setUserCoupons([]);
							} else if(error.response && error.response.status === 500) {
								setMessage(error.message);
								setToastShow(true);
							} else {
								setMessage("Algo deu errado :(");
								setToastShow(true);
							}
						});
				}

				p.additions = adds;
				prods.push(p);
			}

			setOrderDeliverProducts(prods);
			setIsLoading(false);
		}

		fetchData();
	}, [userId]);

	//	Update order delivery state variables
	useEffect(() => {
		let cardsDiscount = 0.0;

		if(user && user.cards && companyInfo && companyInfo.cards) {
			user.cards.map((card, index) => {
				card.completed && !card.status && orderType && orderType.get(card.cardFidelity) ?
					cardsDiscount = parseInt(cardsDiscount) + parseInt((companyInfo.cards[index].discount < orderType.get(card.cardFidelity) ?
						companyInfo.cards[index].discount : orderType.get(card.cardFidelity)))
					:
					null;
			});
		}

		setOrderDeliverAddress(user.address && user.address[0] ? user.address[0] : "");
		setOrderDeliverAddressNumber(user.address && user.address[1] ? user.address[1] : null);
		setOrderDeliverAddressNeighborhood(user.address && user.address[2] ? user.address[2] : "");
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
		setOrderCouponValidated(false);
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
			const myMapTypesProducts = new Map();

			//	Calculate order total price
			if(orderDeliverProducts) {
				for(const x of orderDeliverProducts) {
					if(x.size >= 0 && x.size < x.product.prices.length) {
						myMapTypesProducts.set(x && x.product.type ? x.product.type : "",
							myMapTypesProducts.get(x.product.type) ? (myMapTypesProducts.get(x.product.type) + x.product.prices[x.size]) :
								x.product.prices[x.size]);
					}

					if(x.additions && x.additions.length) {
						for(const y of x.additions) {
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

	}, [orderDeliverProducts]);

	//	Function to handle finish order
	async function handleFinishOrder(event) {
		event.preventDefault();

		setIsLoading(true);

		let orderOk = false;

		const address = [];
		if(orderDeliver && orderDeliverAddress && orderDeliverAddress.length) {
			address.push(orderDeliverAddress);
			address.push(orderDeliverAddressNumber);
			address.push(orderDeliverAddressNeighborhood);
			if(orderDeliverAddressComplement && orderDeliverAddressComplement.length) {
				address.push(orderDeliverAddressComplement);
			}
		}

		let data = {
			products: order.products,
			deliver: orderDeliver,
			address: orderDeliver && address.length ? address.join(", ") : "",
			phone: orderDeliverPhone,
			typePayment: orderDeliverPaymentMethod,
			change: orderDeliverChange,
			total: orderDeliverTotal,
			couponId: orderDeliverCoupon ? orderDeliverCoupon._id : null
		};

		await api.post("order", data, {
			headers: {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 201) {
				orderOk = true;
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});

		if(orderOk) {
			const status = [];

			user.cards.map((card, index) => (
				card.completed && !card.status && orderType &&
					orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
					status.push(true) : status.push(card.status)
			));

			data = {
				name: user.name,
				email: user.email,
				phone: user.phone ? user.phone : orderDeliverPhone,
				address: user.address ? user.address.join(", ") : (address.length ? address.join(", ") : ""),
				status
			};

			await api.put("user", data, {
				headers: {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
					setOrder({ products: [] });
					sessionStorage.removeItem("order");
					setFinishOrderStep(finishOrderStep+1);
					setUser(response.data);
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && error.response.status === 400) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 404) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 500) {
					setMessage(error.message);
				} else {
					setMessage("Algo deu errado :(");
				}
				setToastShow(true);
			});
		}

		setIsLoading(false);
	}

	//	Function to get address info via cep api
	async function validateCoupon(event) {
		event.preventDefault();

		if(!orderDeliverCoupon) {
			setTitle("Erro!");
			setMessage("Nenhum cupom selecionado!");
			setToastShow(true);
		} else {
			await api.put(`couponUser/${orderDeliverCoupon._id}`, null, {
				headers: {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
					setOrderCouponValidated(true);
					setTitle("Sucesso!");
					setMessage("Cupom validado.");
					setToastShow(true);
				}
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && error.response.status === 400) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 404) {
					setMessage(error.response.data);
				} else if(error.response && error.response.status === 500) {
					setMessage(error.message);
				} else {
					setMessage("Algo deu errado :(");
				}
				setToastShow(true);
			});
		}
	}

	//	Function to get address info via cep api
	async function getAddressInfo(event) {
		event.preventDefault();

		if(!orderDeliverAddressCep || orderDeliverAddressCep.length != 8) {
			setTitle("Erro!");
			setMessage("CEP inválido! Digite um CEP válido com 8 dígitos.");
			setToastShow(true);
		} else {
			apicep.get(`${orderDeliverAddressCep}/json`)
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
						setOrderDeliverAddress(response.data.logradouro);
						setOrderDeliverAddressNeighborhood(response.data.bairro);
						setOrderDeliverAddressComplement(response.data.complemento);
					}
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && error.response.status === 400 || error.response && error.response.status === 404) {
						setMessage(error.message);
					} else if(error.response && error.response.status === 500) {
						setMessage(error.message);
					} else {
						setMessage("Algo deu errado :(");
					}
					setToastShow(true);
				});
		}
	}

	// Delete an product of order
	async function handleProductDelete() {
		const newOrder = order;
		let price = 0.0;

		if(productIndex > -1) {
			newOrder.products.splice(productIndex, 1);

			//	Calculate product total price
			if(orderDeliverProducts[productIndex] && orderDeliverProducts[productIndex].size >= 0 &&
				orderDeliverProducts[productIndex].size < orderDeliverProducts[productIndex].product.prices.length) {
				price += orderDeliverProducts[productIndex].product.prices[orderDeliverProducts[productIndex].size];
			}

			if(orderDeliverProducts[productIndex] && orderDeliverProducts[productIndex].additions && orderDeliverProducts[productIndex].additions.length) {
				for(const y of orderDeliverProducts[productIndex].additions) {
					price += y.price;
				}
			}

			newOrder.total -= price;
		}

		setOrder(newOrder);

		if(newOrder && newOrder.products && newOrder.products.length == 0) {
			setOrder({});
			sessionStorage.removeItem("order");
		} else {
			sessionStorage.setItem("order", JSON.stringify(newOrder));
		}

		setModalDeleteProduct(false);
		history.go();
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
							<Form.Group as={Row} controlId="userChange">
								<Form.Label
									as={Col}
									className="text-center align-self-center p-0"
									md="6"
								>
									Troco para R$:
								</Form.Label>
								<Col md="6">
									<Form.Control
										value={orderDeliverChange}
										className="text-center"
										onChange={(e) => setOrderDeliverChange(e.target.value)}
										type="tel"
										min={orderDeliverChange}
										required={!orderDeliverPaymentMethod}
										autoFocus
									/>
								</Col>
							</Form.Group>
						</Card.Body>
					</Card>
				</Tab>
				<Tab eventKey="1" title="Cartão">
					<Card>
						<Card.Body className="text-center">
							Pagamento pela maquininha. Aceitamos cartão de débito e crédito!
						</Card.Body>
					</Card>
				</Tab>
			</Tabs>
		);
	}

	const productDeck = (
		<Tabs fill defaultActiveKey={0}>
			{orderDeliverProducts.map((product, index) => (
				<Tab key={index} eventKey={index} title={product.product.name}>
					<Card className="h-100 p-1" text="dark" bg="light" key={product._id}>
						<Row>
							<Col className="d-flex text-center" lg="6" md="auto" sm="6">
								<Image
									className={product.product.thumbnail ? "w-100 m-auto" : "w-75 m-auto"}
									src={
										product.product.thumbnail ?
											`${process.env.REACT_APP_API_URL}files/${product.product.thumbnail}`
											:
											camera
									}
									alt="thumbnail"
									fluid
									rounded
								/>
							</Col>
							<Col sm>
								<Row>
									<Card.Body>
										<Row>
											<Col>
												<Card.Title>{product.product ? product.product.name : null }</Card.Title>
											</Col>
											<Col align="right">
												<BsFillTrashFill
													className="my-0 mx-2 text-danger" size="20"
													style={{cursor: "pointer"}}
													onClick={() => {
														setProductType(product.product.type);
														setProductName(product.product.name);
														setProductIndex(index);
														setModalDeleteProduct(true);
													}} />
											</Col>
										</Row>

										<Card.Text>
											{product.product && product.product.ingredients ?
												((product.product.ingredients.length === 1) ?
													"Ingrediente: "
													:
													"Ingredientes: "
												)
												:
												null
											}
											{product.product && product.product.ingredients ?
												product.product.ingredients.map((ingredient, index) => (
													index === product.product.ingredients.length-1 ?
														ingredient
														:
														`${ingredient}, `
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
												{(product.additions).map((addition, index) => (
													<Col key={index} sm>
														{`${addition.name}\nPreço: R$${addition.price}`}
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
									`Preço: R$${product.product.prices[product.size]}`
									:
									null
								}
							</small>
						</Card.Footer>
					</Card>
				</Tab>
			))}
		</Tabs>
	);

	return (
		<>
			<Container className="bg-light text-dark rounded my-auto">
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Tab.Container defaultActiveKey={0} activeKey={finishOrderStep}>
					<Row className="h-100">
						<Col lg="3" md="5" sm>
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
										sessionStorage.removeItem("order");
										history.push("/");
									}}
								>
									Cancelar pedido
								</Button>
							</Nav>
						</Col>
						<Col className="p-0" lg="9" md="7" sm="9">
							<Container className="px-0 py-2 h-100">
								<Tab.Content as={Col}>
									<Tab.Pane eventKey={0}>
										<Row>
											<Col>
												{isLoading ?
													<Loading animation="grow" />
													:
													productDeck
												}
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
														onChange={(e) => setOrderDeliverPhone(e.target.value)}
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
														label={`+ R$${companyInfo.freight} de taxa de entrega`}
														checked={orderDeliver}
														onChange={(e) => setOrderDeliver(e.target.checked)}
													/>
												</Form.Group>
											</Row>
											{orderDeliver ?
												<>
													<Row>
														<Form.Group as={Col} controlId="userCep" lg="6" md="12">
															<Form.Label>CEP</Form.Label>
															<Form.Control
																value={orderDeliverAddressCep}
																onChange={(e) => setOrderDeliverAddressCep(e.target.value)}
																type="tel"
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
															<Button
																variant="warning"
																size="sm"
																className="mx-2 my-2"
																onClick={() => window.open("https://buscacepinter.correios.com.br/app/endereco/index.php")}
															>
																Não sei meu CEP
															</Button>
														</Form.Group>
														<Form.Group as={Col} controlId="orderDeliverAddress" lg="6" md="12">
															<Form.Label>Endereço</Form.Label>
															<Form.Control
																value={orderDeliverAddress}
																onChange={(e) => setOrderDeliverAddress(e.target.value)}
																type="text"
																placeholder="Ex. Avenida Prudente de Moraes"
																disabled={!orderDeliver}
																required={orderDeliver}
															/>
														</Form.Group>
														<Form.Group as={Col} controlId="orderDeliverAddressNumber" lg="6" md="6">
															<Form.Label>Número da residência</Form.Label>
															<Form.Control
																value={orderDeliverAddressNumber}
																onChange={(e) => setOrderDeliverAddressNumber(e.target.value)}
																type="tel"
																min="0"
																placeholder="Ex. 45"
																disabled={!orderDeliver}
																required={orderDeliver}
															/>
														</Form.Group>
														<Form.Group as={Col} controlId="orderDeliverAddressNeighborhood" lg="6" md="6">
															<Form.Label>Bairro</Form.Label>
															<Form.Control
																value={orderDeliverAddressNeighborhood}
																onChange={(e) => setOrderDeliverAddressNeighborhood(e.target.value)}
																type="text"
																placeholder="Ex. Belvedere"
																disabled={!orderDeliver}
																required={orderDeliver}
															/>
														</Form.Group>
														<Form.Group as={Col} controlId="orderDeliverAddressComplement" lg="12" md="12">
															<Form.Label>Complemento</Form.Label>
															<Form.Control
																value={orderDeliverAddressComplement}
																onChange={(e) => setOrderDeliverAddressComplement(e.target.value)}
																type="text"
																placeholder="Complemento (opcional)"
															/>
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
															<FormGroup as={Col} controlId="deliverCard" lg="6" md="12">
																<Form.Label>Descontos por cartão fidelidade:</Form.Label>
																{user.cards.map((card, index) => (
																	card.completed && !card.status &&
																	orderType && orderType.get(card.cardFidelity) && companyInfo.cards[index].available ?
																		<Row className="m-auto" key={index}>
																			{`Completou o cartão de ${card.cardFidelity}`}
																			<FormLabel className="ml-1" style={{color: "#c83a34"}} >
																				{`-R$ ${
																					companyInfo.cards[index].discount < orderType.get(card.cardFidelity) ?
																						companyInfo.cards[index].discount
																						:
																						orderType.get(card.cardFidelity)}`
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
												<Form.Group as={Col} controlId="orderDeliverCoupon" lg="6" md="12">
													<Form.Label>Cupons:</Form.Label>
													<Form.Control
														value={null}
														onChange={(e) => {
															const cpn = userCoupons.find((c) => c.name === e.target.value);
															setOrderDeliverCoupon(cpn ? cpn : null);
															setCouponDiscountText(cpn && cpn.method === "dinheiro" ?
																`R$ ${cpn.discount}`
																:
																cpn && cpn.method === "porcentagem" ?
																	`${cpn.discount}%`
																	:
																	null
															);
															setOrderDeliver(cpn && cpn.type === "frete" ? true : orderDeliver);
														}}
														as="select"
														placeholder="Cupons"
														required={!orderCouponValidated}
														disabled={orderCouponValidated}
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
														disabled={orderCouponValidated}
													>
														Validar cupom
													</Button>
												</Form.Group>
												<Form.Group as={Col} controlId="deliverPayment" lg="12">
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
															{`Finalizar pedido +R$${orderDeliverTotal}`}
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
													onClick={() => history.push("/order")}
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

			<Modal show={modalDeleteProduct} onHide={() => {
				setModalDeleteProduct(false); setToastShow(false);
			}}>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>
						Remover { productName && productType ?
							`${productType[0].toUpperCase() + productType.slice(1)} ${productName}`
							:
							null
						}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Você tem certeza que deseja remover este produto?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => {
						setModalDeleteProduct(false); setToastShow(false);
					}}>
						Voltar
					</Button>
					<Button variant="danger" onClick={handleProductDelete}>
						Remover
					</Button>
				</Modal.Footer>
			</Modal>

			<Alert.Close modalAlert={modalAlert} setModalAlert={setModalAlert} title={title} message={message} />
		</>
	);
}

FinishOrder.propTypes = {
	userId: PropTypes.string,
	user: PropTypes.object.isRequired,
	setUser: PropTypes.func.isRequired,
	order: PropTypes.object.isRequired,
	setOrder: PropTypes.func.isRequired,
	companyInfo: PropTypes.object.isRequired,
	companySystemOpenByHour: PropTypes.bool,
	noCards: PropTypes.bool.isRequired
};
