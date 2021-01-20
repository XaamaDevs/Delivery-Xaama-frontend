//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import {
	Container,
	Carousel,
	Modal,
	Spinner,
	OverlayTrigger,
	Tooltip,
	Nav,
	Card,
	Button,
	CardDeck,
	Form,
	Col,
	Row,
	Image
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../components/Alert";
import Push from "../../components/Push";

//	Importing api to communicate to backend
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Menu({ userId, user, order, setOrder, companyInfo, companySystemOpenByHour }) {
	//	Product variables
	const [productsByType, setProductsByType] = useState({});
	const [productTypes, setProductTypes] = useState([]);
	const [products, setProducts] = useState([]);
	const [product, setProduct] = useState(null);
	const [productId, setProductId] = useState("");
	const [productName, setProductName] = useState("");
	const [productIngredients, setProductIngredients] = useState("");
	const [productPrices, setProductPrices] = useState("");
	const [productSizes, setProductSizes] = useState("");
	const [productType, setProductType] = useState("");
	const [productThumbnail_url, setProductThumbnail_url] = useState(null);
	const [productThumbnail, setProductThumbnail] = useState(null);
	const [productAvailable, setProductAvailable] = useState();

	//	Addition variables
	const [additionsByType, setAdditionsByType] = useState({});
	const [additions, setAdditions] = useState([]);

	//	Order variables
	const [productOrder, setProductOrder] = useState({});
	const [productSize, setProductSize] = useState(0);
	const [productNote, setProductNote] = useState("");
	const [additionsOrder, setAdditionsOrder] = useState([]);
	const [productTotal, setProductTotal] = useState(0);

	//	Modal state variables
	const [modalAlert, setModalAlert] = useState(false);
	const [productAddModal, setProductAddModal] = useState(false);
	const [productUpdateModal, setProductUpdateModal] = useState(false);
	const [productDeleteModal, setProductDeleteModal] = useState(false);
	const [productOrderModal, setProductOrderModal] = useState(false);

	//	Message settings
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	//	Update product state variables
	useEffect(() => {
		setProductId(product ? product._id : "");
		setProductName(product ? product.name : "");
		setProductIngredients(product ? product.ingredients.join(", ") : "");
		setProductPrices(product ? product.prices.join(", ") : "");
		setProductSizes(product ? product.sizes.join(", ") : "");
		setProductType(product ? product.type : productTypes[0]);
		setProductThumbnail(null);
		setProductThumbnail_url(product ? product.thumbnail_url : null);
		setProductAvailable(product ? product.available : true);
	}, [productAddModal, productUpdateModal, productDeleteModal]);

	//	Product image preview
	const preview = useMemo(() => {
		return productThumbnail ? URL.createObjectURL(productThumbnail) : null;
	}, [productThumbnail]);

	//	Loading current user info and products list by type
	useEffect(() => {
		async function fetchData() {
			await api.get("productTypes")
				.then((response) => {
					setProductTypes(response.data);
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && typeof(error.response.data) !== "object") {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});

			await api.get("product")
				.then((response) => {
					var prodsByType = {};

					for(var type of productTypes) {
						var prods = [];

						for(var product of response.data) {
							if(product.type === type) {
								prods.push(product);
							}
						}

						prodsByType[type] = prods;
					}

					setProductsByType(prodsByType);
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && typeof(error.response.data) !== "object") {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});

			await api.get("addition")
				.then((response) => {
					var AddsByType = {};

					for(var type of productTypes) {
						var adds = [];

						for(var addition of response.data) {
							if(addition.type.indexOf(type) >= 0) {
								if(addition.available){
									adds.push(addition);
								}
							}
						}

						AddsByType[type] = adds;
					}

					setAdditionsByType(AddsByType);
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && typeof(error.response.data) !== "object") {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});

			setIsLoading(false);
		}

		fetchData();
	}, [productTypes]);

	async function handleProductAdd(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", productName);
		data.append("ingredients", productIngredients);
		data.append("type", productType);
		data.append("prices", productPrices);
		data.append("sizes", productSizes);
		data.append("thumbnail", productThumbnail);

		await api.post("product", data, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setProductAddModal(false);
				setTitle("Alterações produto!");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	async function handleProductUpdate(event) {
		event.preventDefault();

		const data = {
			name: productName,
			ingredients: productIngredients,
			prices: productPrices,
			type: productType,
			sizes: productSizes,
			available: productAvailable
		};

		await api.put("product/" + productId, data, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setProductUpdateModal(false);
				setTitle("Alterações produto!");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	async function handleProductThumbnailUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("thumbnail", productThumbnail);

		await api.put("productThumbnail/" + productId, data, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setProductUpdateModal(false);
				setTitle("Alterações produto!");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	async function handleProductDelete(event) {
		event.preventDefault();

		await api.delete("product/" + productId, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setProductDeleteModal(false);
				setTitle("Alterações produto!");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	async function handleProductOrder(event) {
		event.preventDefault();

		if(productOrder.available) {
			const product = {
				product: productOrder,
				additions: additionsOrder,
				size: productSize,
				note: productNote
			};

			if(order.products) {
				var newOrder = order;
				newOrder["products"].push(product);
				newOrder["total"] += productTotal;

				setOrder(newOrder);
			} else {
				setOrder({ products: [product], deliver: false, total: productTotal, address: user.address });
			}

			setProductOrderModal(false);
		} else {
			setProductOrderModal(false);
			setTitle("Atenção");
			setMessage("Produto indisponível no momento!");
			setModalAlert(true);
		}
	}

	async function handleAdditionOrder(event, add) {
		event.preventDefault();

		if(additionsOrder.length < 4) {
			var newAdditionsOrder = additionsOrder;

			newAdditionsOrder.push(add);

			setAdditionsOrder(newAdditionsOrder);
		}
	}

	async function handleProductTotal(event) {
		event.preventDefault();

		if(productOrder.prices) {
			var total = productOrder.prices[productSize];

			for(var add of additionsOrder) {
				total += add.price;
			}

			setProductTotal(total);
		}
	}

	const header = (
		<Card.Header className="pb-3">
			<Nav fill variant="tabs">
				{Object.keys(productsByType).map((type, index) => (
					productsByType[type].length ?
						<Nav.Item key={index}>
							<Nav.Link
								className="btn-outline-warning rounded"
								href={"#" + index}
								onClick={() => {
									setProducts(productsByType[type]);
									setAdditions(additionsByType[type]);
								}}
							>
								{type[0].toUpperCase() + type.slice(1)}
							</Nav.Link>
						</Nav.Item>
						:
						null
				))}
				{user.userType === 1 || user.userType === 2 ?
					<Nav.Item>
						<Nav.Link
							className="btn-outline-warning rounded"
							onClick={() => setProductAddModal(true)}>
								Adicionar novo produto
						</Nav.Link>
					</Nav.Item>
					:
					null
				}
			</Nav>
		</Card.Header>
	);

	const productCard = (productI) => {
		return (
			<Card key={productI._id} as={Col} className="my-1 p-0" bg="secondary" sm="4">
				<Card.Img
					variant="top"
					src={productI.thumbnail ? process.env.REACT_APP_API_URL + productI.thumbnail_url : camera}
					fluid="true"
				/>
				<Card.Body key={productI._id} className="d-flex align-content-between flex-column">
					<Card.Title>{productI.name}</Card.Title>
					<Card.Text>
						{productI.ingredients.map((ingredient, index) => (
							index === productI.ingredients.length-1 ?
								ingredient
								:
								ingredient + ", "
						))}
					</Card.Text>
					{userId && user ?
						user.userType === 1 || user.userType === 2 ?
							<div className="d-flex justify-content-around flex-wrap my-auto">
								<Button
									className="my-1"
									variant="warning"
									size="sm"
									onClick ={() => { setProduct(productI); setProductUpdateModal(true); }}
								>
									Modificar
								</Button>

								{productI.available ?
									<Button
										className="my-1"
										variant="light"
										size="sm"
										id="btn-custom"
									>
										Disponível
									</Button>
									:
									<Button
										className="my-1"
										variant="light"
										size="sm"
										id="btn-custom-outline"
									>
										Indisponível
									</Button>
								}

								<Button
									className="my-1"
									variant="danger"
									size="sm"
									onClick={() => { setProduct(productI); setProductDeleteModal(true); }}
								>
									Remover
								</Button>
							</div>
							:
							<>
								{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
									|| (companyInfo && !companyInfo.manual && companySystemOpenByHour) ?

									productI.available ?
										<Button
											className="my-auto"
											variant="warning"
											size="sm"
											onClick ={() => {
												setProductNote("");
												setAdditionsOrder([]);
												setProductSize(0);
												setProductTotal(0);
												setProductOrder(productI);
												setProductTotal(productI.prices[0]);
												setProductOrderModal(true);
											}}
										>
											Adicionar aos pedidos
										</Button>
										:
										<Button
											variant="danger"
											size="sm"
										>
											Indisponível no momento
										</Button>
									:
									<Button
										variant="danger"
										size="sm"
									>
										Estamos fechados
									</Button>
								}
							</>
						:
						null
					}
				</Card.Body>
				<Card.Footer>
					<small>
						{productI.prices.length === 1 ?
							"Preço: "
							:
							"Preços por tamanho: "
						}
						{productI.prices.map((price, index) => (
							index === productI.prices.length-1 ?
								"R$" + price
								:
								"R$" + price + ", "
						))}
					</small>
				</Card.Footer>
			</Card>
		);
	};

	const productFormBody = (
		<>
			<Row>
				<Form.Group as={Col} controlId="productName" sm>
					<Form.Label>Nome</Form.Label>
					<Form.Control
						value={productName}
						onChange={e => setProductName(e.target.value)}
						type="text"
						placeholder="Nome do produto"
						required
					/>
				</Form.Group>
				<Form.Group as={Col} controlId="productType" sm>
					<Form.Label>Tipo</Form.Label>
					<Form.Control
						value={productType}
						onChange={e => setProductType(e.target.value)}
						as="select"
						placeholder="Tipo do produto"
						required
					>
						<option disabled>Selecione o tipo</option>
						{productTypes.map((type, index) => (
							<option key={index}>{type}</option>
						))}
					</Form.Control>
				</Form.Group>
			</Row>
			<Row>
				<Form.Group as={Col} controlId="productPrices" sm>
					<Form.Label>Preço</Form.Label>
					<OverlayTrigger
						placement="top"
						overlay={
							<Tooltip>
										Para múltiplos tamanhos, separe-os entre vírgulas.
							</Tooltip>
						}
					>
						<Form.Control
							value={productPrices}
							onChange={(e) => setProductPrices(e.target.value)}
							pattern="^[0-9]+(\.[0-9]+)*(,\s?[0-9]+(\.?[0-9]+)*)*$"
							type="text"
							placeholder="Preço do produto"
							required
						/>
					</OverlayTrigger>
				</Form.Group>
				<Form.Group as={Col} controlId="productSizes" sm>
					<Form.Label>
								Tamanho
					</Form.Label>
					<OverlayTrigger
						placement="top"
						overlay={
							<Tooltip>
										Para tamanho único, digite único,
										para múltiplos tamanhos, separe-os entre vírgulas.
							</Tooltip>
						}
					>
						<Form.Control
							value={productSizes}
							onChange={(e) => setProductSizes(e.target.value)}
							pattern="^[^\s,]+(\s[^\s,]+)*(,\s?[^\s,]+(\s[^\s,]+)*)*$"
							type="text"
							placeholder="Tamanho do produto"
							required
						/>
					</OverlayTrigger>
				</Form.Group>
			</Row>
			<Form.Group controlId="productIngredients">
				<Form.Label>Ingredientes</Form.Label>
				<OverlayTrigger
					placement="top"
					overlay={
						<Tooltip>
								Para múltiplos ingredientes, separe-os entre vírgulas.
						</Tooltip>
					}
				>
					<Form.Control
						value={productIngredients}
						onChange={(e) => setProductIngredients(e.target.value)}
						as="textarea"
						rows="3"
						style={{resize :"none"}}
						placeholder="Ingredientes do produto"
						required
					/>
				</OverlayTrigger>
			</Form.Group>
			<Form.Group className={productAddModal ? "d-none" : null}  controlId="productAvailable">
				<Form.Check
					type="switch"
					id="custom-switch"
					label={productAvailable ? "Disponível" : "Indisponível"}
					checked={productAvailable}
					onChange={e => setProductAvailable(e.target.checked)}
				/>
			</Form.Group>
		</>
	);

	return (
		<Container className="product-container w-100">
			<Card className="px-3" text="light" bg="dark">
				{header}
				{isLoading ?
					<Spinner
						className="my-5 mx-auto"
						style={{width: "5rem", height: "5rem"}}
						animation="grow"
						variant="warning"
					/>
					:
					products && products.length ?
						<CardDeck className="p-2">
							{Array(products.length).fill(null).map((value, i) => (
								i%3 === 0 ?
									<Row className="d-flex justify-content-around m-auto w-100" key={i/3}>
										{Array(3).fill(null).map((value, j) => (
											i+j < products.length ? productCard(products[i+j]) : null
										))}
									</Row>
									:
									null
							))}
						</CardDeck>
						:
						<h1 className="display-5 text-center m-auto p-5">Selecione o tipo de produto desejado acima</h1>
				}
			</Card>

			<Modal
				show={productAddModal}
				onHide={() => { setProduct(null); setProductAddModal(false); setToastShow(false); }}
				dialogClassName="modal-custom"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Adicionar produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleProductAdd}>
						<Row>
							<Col className="d-flex m-auto" sm="5">
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setProductThumbnail(event.target.files[0])}
								/>
								<Image
									id={preview || productThumbnail_url ? "thumbnail" : "camera"}
									className={preview || productThumbnail_url ? "btn border-0 m-auto" : "btn w-75 m-auto"}
									src={preview ?
										preview
										:
										(productThumbnail_url ? process.env.REACT_APP_API_URL + productThumbnail_url : camera)
									}
									alt="Selecione sua imagem"
									onClick={() => document.getElementById("inputImage").click()}
									rounded
									fluid
								/>
							</Col>
							<Col sm>
								{productFormBody}
							</Col>
						</Row>
						<Modal.Footer>
							<Button
								variant="danger"
								onClick={() => {
									setProduct(null);
									setProductAddModal(false);
									setToastShow(false);
								}}
							>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Adicionar
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal
				show={productUpdateModal}
				onHide={() => { setProduct(null); setProductUpdateModal(false); setToastShow(false); }}
				dialogClassName="modal-custom"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col className="d-flex justify-content-center m-auto" sm="6">
							<Form onSubmit={handleProductThumbnailUpdate}>
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setProductThumbnail(event.target.files[0])}
									required
								/>
								<Image
									id={preview || productThumbnail_url ? "thumbnail" : "camera"}
									className={preview || productThumbnail_url ? "btn border-0 m-auto" : "btn w-100 m-auto"}
									src={preview ? preview : (productThumbnail_url ? process.env.REACT_APP_API_URL + productThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={() => document.getElementById("inputImage").click()}
									rounded
									fluid
								/>
								{productThumbnail_url ?
									<Button variant="warning" type="submit" className="d-flex mx-auto my-2">
										Alterar imagem
									</Button>
									:
									<Button variant="warning" type="submit" className="d-flex mx-auto my-2">
										Adicionar imagem
									</Button>
								}
							</Form>
						</Col>
						<Col sm>
							<Form onSubmit={handleProductUpdate}>
								{productFormBody}
								<Modal.Footer>
									<Button
										variant="danger"
										onClick={() => {
											setProduct(null);
											setProductUpdateModal(false);
											setToastShow(false);
										}}
									>
										Fechar
									</Button>
									<Button variant="warning" type="submit">
										Salvar alterações
									</Button>
								</Modal.Footer>
							</Form>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>

			<Modal show={productDeleteModal} onHide={() => {setProductDeleteModal(false); setToastShow(false);}}>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Remover {productName && productType ?
						productType[0].toUpperCase() + productType.slice(1) + " " + productName
						:
						null
					}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Você tem certeza que deseja remover este produto?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => {setProductDeleteModal(false); setToastShow(false);}}>
						Voltar
					</Button>
					<Button variant="danger" onClick={handleProductDelete}>
						Remover
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={productOrderModal}
				onHide={() => {setProductOrderModal(false); setToastShow(false);}}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Adicionar ao pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col className="d-flex my-2" sm>
							<Image
								id="thumbnail"
								className={preview || productOrder.thumbnail_url ? "border-0 m-auto" : "w-75 m-auto"}
								src={preview ? preview : (productOrder.thumbnail_url ? process.env.REACT_APP_API_URL + productOrder.thumbnail_url : camera)}
								alt="Imagem do produto"
								rounded
								fluid
							/>
						</Col>
						<Col className="my-2" sm>
							<Card className="h-100" text="light" bg="dark">
								<Card.Header>
									<Row className="d-flex align-items-center">
										<Col>
											{productOrder.type ?
												productOrder.type[0].toUpperCase() + productOrder.type.slice(1) + " " + productOrder.name
												:
												null
											}
										</Col>
										{productOrder.prices && productOrder.prices.length !== 1 ?
											<Col>
												<Form.Group className="m-auto" controlId="productType">
													<Form.Control
														value={productOrder.sizes[productSize]}
														onChange={e => {
															const size = productOrder.sizes.indexOf(e.target.value);
															setProductSize(size);
															var total = productOrder.prices[size];
															for(var add of additionsOrder) {
																total += add.price;
															}
															setProductTotal(total);
														}}
														as="select"
														required
													>
														<option disabled>Selecione o tamanho</option>
														{productOrder.sizes.map((size, index) => (
															<option key={index}>{size}</option>
														))}
													</Form.Control>
												</Form.Group>
											</Col>
											:
											null
										}
									</Row>
								</Card.Header>
								<Card.Body>
									<Card.Text>
										{productOrder.ingredients ? productOrder.ingredients.join(", ") : null}
									</Card.Text>
									<OverlayTrigger
										placement="bottom"
										overlay={
											<Tooltip>
												Você pode inserir no máximo 4 adições ao seu produto.
											</Tooltip>
										}
									>
										<Carousel interval={null} indicators={false}>
											{additions && additions.length ?
												additions.map((add, index) => (
													<Carousel.Item key={index} className="text-dark">
														<Image
															className="d-block m-auto"
															style={{height: "100px"}}
															src={add.thumbnail_url ? process.env.REACT_APP_API_URL + add.thumbnail_url : camera}
															alt="Adição"
														/>
														<Carousel.Caption className="d-flex flex-row align-items-end p-0 h-100">
															{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
																|| (companyInfo && !companyInfo.manual && companySystemOpenByHour) ?
																<Button
																	variant="light"
																	id="btn-custom"
																	className="mx-auto"
																	size="sm"
																	onClick={e => {handleAdditionOrder(e, add); handleProductTotal(e);}}
																>
																	{add.name + " +R$" + add.price}
																</Button>
																:
																null
															}
														</Carousel.Caption>
													</Carousel.Item>
												))
												:
												null
											}
										</Carousel>
									</OverlayTrigger>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col className="my-2" sm>
							<Card bg="light" text="dark">
								<Card.Header>Observações</Card.Header>
								<Card.Body>
									<Form.Control
										value={productNote}
										onChange={e => setProductNote(e.target.value)}
										placeholder="Digite aqui se você deseja remover algum ingrediente do pedido (opcional)"
										as="textarea"
										rows="2"
										style={{resize :"none"}}
									/>
								</Card.Body>
							</Card>
						</Col>
						{additionsOrder &&  additionsOrder.length ?
							<Col className="my-2" sm>
								<Card bg="light" text="dark">
									<Card.Header>Adições</Card.Header>
									<Card.Body>
										<Row className="d-flex flex-row flex-wrap justify-content-start">
											{additionsOrder.map((add, index) =>(
												<Button
													variant="light"
													id="btn-custom"
													size="sm"
													key={index}
													className="m-1"
													onClick={e => {
														var newAdditionsOrder = additionsOrder;
														newAdditionsOrder.splice(index, 1);
														setAdditionsOrder(newAdditionsOrder);
														handleProductTotal(e);
													}}
												>
													{add.name + " X"}
												</Button>
											))}
										</Row>
									</Card.Body>
								</Card>
							</Col>
							:
							null
						}
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => {setProductOrderModal(false); setToastShow(false);}}>
						Fechar
					</Button>
					{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
						|| (companyInfo && !companyInfo.manual && companySystemOpenByHour) ?
						<Button variant="warning" onClick={handleProductOrder}>
							{"Adicionar ao carrinho +R$" + productTotal}
						</Button>
						:
						<Button
							variant="danger"
						>
							Estamos fechados
						</Button>
					}
				</Modal.Footer>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
		</Container>
	);
}

Menu.propTypes = {
	userId : PropTypes.string,
	user : PropTypes.object.isRequired,
	companyInfo : PropTypes.object.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.func.isRequired,
	companySystemOpenByHour : PropTypes.bool
};