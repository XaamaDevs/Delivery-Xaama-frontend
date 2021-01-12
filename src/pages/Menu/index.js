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

	//	Message settings
	const [productAddModal, setProductAddModal] = useState(false);
	const [productUpdateModal, setProductUpdateModal] = useState(false);
	const [productDeleteModal, setProductDeleteModal] = useState(false);
	const [productOrderModal, setProductOrderModal] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setLoading] = useState(true);

	//	Loading current user info and products list by type
	useEffect(() => {
		async function fetchData() {
			await api.get("productTypes")
				.then((response) => {
					if(response.data && response.data.length) {
						setProductTypes(response.data);
					} else {
						setTitle("Erro!");
						setMessage("Não há tipos de produtos cadastrados");
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

			setLoading(false);
		}

		fetchData();
	}, [productTypes, userId]);

	//	Product image preview
	const preview = useMemo(() => {
		return productThumbnail ? URL.createObjectURL(productThumbnail) : null;
	}, [productThumbnail]);

	//	Function to handle input product thumbnail
	async function inputImage(event) {
		event.preventDefault();

		document.getElementById("inputImage").click();
	}

	//	Return a list of products given type
	async function handleProductsList(event, type) {
		event.preventDefault();

		setProducts(productsByType[type]);
		setAdditions(additionsByType[type]);
	}

	async function handleProductAdd(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", productName);
		data.append("ingredients", productIngredients);
		data.append("type", productType);
		data.append("prices", productPrices);
		data.append("sizes", productSizes);

		if(productThumbnail) {
			data.append("thumbnail", productThumbnail);
		} else {
			if(productThumbnail_url){
				const blob = await fetch(productThumbnail_url).then(r => r.blob());
				const token = productThumbnail_url.split(".");
				const extension = token[token.length-1];
				data.append("thumbnail", new File([blob], "thumbnail." + extension));
			}
		}

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

		const data = new FormData();

		data.append("name", productName);
		data.append("ingredients", productIngredients);
		data.append("prices", productPrices);
		data.append("type", productType);
		data.append("sizes", productSizes);
		data.append("available", productAvailable);

		if(productThumbnail) {
			data.append("thumbnail", productThumbnail);
		} else {
			if(productThumbnail_url){
				const blob = await fetch(productThumbnail_url).then(r => r.blob());
				const token = productThumbnail_url.split(".");
				const extension = token[token.length-1];
				data.append("thumbnail", new File([blob], "thumbnail." + extension));
			}
		}

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
				setOrder({ products: [product], user, deliver: false, total: productTotal, address: user.address });
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

	async function handleProductModal(event, modal, product = null) {
		event.preventDefault();

		setProductId(product ? product._id : "");
		setProductName(product ? product.name : "");
		setProductIngredients(product ? product.ingredients.join(", ") : "");
		setProductPrices(product ? product.prices.join(", ") : "");
		setProductSizes(product ? product.sizes.join(", ") : "");
		setProductType(product ? product.type : "");
		setProductThumbnail(null);
		setProductThumbnail_url(product ? product.thumbnail_url : null);
		setProductAvailable(product ? product.available : true);

		switch(modal) {
		case 0:
			setProductAddModal(true);
			break;
		case 1:
			setProductUpdateModal(true);
			break;
		case 2:
			setProductDeleteModal(true);
			break;
		case 3:
			setProductAvailable(false);
			handleProductUpdate(event);
			break;
		case 4:
			setProductAvailable(true);
			handleProductUpdate(event);
			break;
		default:
			break;
		}
	}

	const header = (
		<Card.Header className="pb-3">
			<Nav fill variant="tabs">
				{Object.keys(productsByType).map((type, index) => (
					productsByType[type] && productsByType[type].length ?
						<Nav.Item key={index}>
							<Nav.Link
								className="btn-outline-warning rounded"
								href={"#" + index}
								onClick={e => handleProductsList(e, type)}>
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
							onClick={e => handleProductModal(e, 0)}>
							Adicionar novo produto
						</Nav.Link>
					</Nav.Item>
					:
					null
				}
			</Nav>
		</Card.Header>
	);

	const productCard = (product) => {
		return (
			<Card className="col-sm-4 my-1 p-0" bg="secondary" key={product._id}>
				<Card.Img variant="top" src={product.thumbnail ? process.env.REACT_APP_API_URL + product.thumbnail_url : camera} fluid="true" />
				<Card.Body className="d-flex align-content-between flex-column" key={product._id}>
					<Card.Title>{product.name}</Card.Title>
					<Card.Text>
						{product.ingredients.map((ingredient, index) => (
							index === product.ingredients.length-1 ?
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
									onClick ={e => handleProductModal(e, 1, product)}
								>
									Modificar
								</Button>

								{product.available ?
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
										variant="dark"
										size="sm"
									>
										Indisponível
									</Button>
								}

								<Button
									className="my-1"
									variant="danger"
									size="sm"
									onClick={e => handleProductModal(e,2, product)}
								>
									Remover
								</Button>
							</div>
							:
							<>
								{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
									|| (companyInfo && !companyInfo.manual && companySystemOpenByHour) ?

									product.available ?
										<Button
											className="my-auto"
											variant="warning"
											size="sm"
											onClick ={() => {
												setProductNote("");
												setAdditionsOrder([]);
												setProductSize(0);
												setProductTotal(0);
												setProductOrder(product);
												setProductTotal(product.prices[0]);
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
						{product.prices.length === 1 ?
							"Preço: "
							:
							"Preços por tamanho: "
						}
						{product.prices.map((price, index) => (
							index === product.prices.length-1 ?
								"R$" + price
								:
								"R$" + price + ", "
						))}
					</small>
				</Card.Footer>
			</Card>
		);
	};

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
				onHide={() => {setProductAddModal(false); setToastShow(false);}}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Adicionar produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleProductAdd}>
						<Row>
							<Col className="d-flex m-auto" sm>
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setProductThumbnail(event.target.files[0])}
								/>
								<Image
									id={preview || productThumbnail_url ? "thumbnail" : "camera"}
									className={preview || productThumbnail_url ? "btn border-0 m-auto" : "btn w-75 m-auto"}
									src={preview ? preview : (productThumbnail_url ? process.env.REACT_APP_API_URL + productThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
									rounded
									fluid
								/>
							</Col>
							<Col sm>
								<Form.Group controlId="productName">
									<Form.Label>Nome</Form.Label>
									<Form.Control
										value={productName}
										onChange={e => setProductName(e.target.value)}
										type="text"
										placeholder="Nome do produto"
										required
									/>
								</Form.Group>
								<Form.Group controlId="productPrices">
									<Form.Label>
										Preço
									</Form.Label>
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
								<Form.Group controlId="productSizes">
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
							</Col>
						</Row>
						<Row>
							<Col sm>
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
							</Col>
							<Col sm>
								<Form.Group controlId="productType">
									<Form.Label>Tipo</Form.Label>
									<Form.Control
										value={productType}
										onChange={e => setProductType(e.target.value)}
										as="select"
										placeholder="Tipo do produto"
										required
									>
										<option></option>
										{productTypes.map((type, index) => (
											<option key={index}>{type}</option>
										))}
									</Form.Control>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => {setProductAddModal(false); setToastShow(false);}}>
						Fechar
					</Button>
					<Button variant="warning" type="submit" onClick={handleProductAdd}>
						Adicionar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={productUpdateModal}
				onHide={() => {setProductUpdateModal(false); setToastShow(false);}}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleProductUpdate}>
						<Row>
							<Col className="d-flex m-auto" sm>
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setProductThumbnail(event.target.files[0])}
								/>
								<Image
									id={preview || productThumbnail_url ? "thumbnail" : "camera"}
									className={preview || productThumbnail_url ? "btn border-0 m-auto" : "btn w-100 m-auto"}
									src={preview ? preview : (productThumbnail_url ? process.env.REACT_APP_API_URL + productThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
									rounded
									fluid
								/>
							</Col>
							<Col sm>
								<Form.Group controlId="productName">
									<Form.Label>Nome</Form.Label>
									<Form.Control
										value={productName}
										onChange={e => setProductName(e.target.value)}
										type="text"
										placeholder="Nome do produto"
										required
									/>
								</Form.Group>
								<Form.Group controlId="productPrices">
									<Form.Label>
										Preço
									</Form.Label>
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
								<Form.Group controlId="productSizes">
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
							</Col>
						</Row>
						<Row>
							<Col sm>
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
							</Col>
							<Col sm>
								<Form.Group controlId="productType">
									<Form.Label>Tipo</Form.Label>
									<Form.Control
										value={productType}
										onChange={e => setProductType(e.target.value)}
										as="select"
										placeholder="Tipo do produto"
										required
									>
										{productTypes.map((type, index) => (
											<option key={index}>{type}</option>
										))}
									</Form.Control>
								</Form.Group>
								<Form.Group controlId="productAvailable">
									<Form.Check
										type="switch"
										id="custom-switch"
										label={productAvailable ? "Disponível" : "Indisponível"}
										checked={productAvailable}
										onChange={e => setProductAvailable(e.target.checked)}
									/>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => {setProductUpdateModal(false); setToastShow(false);}}>
						Fechar
					</Button>
					<Button variant="warning" type="submit" onClick={handleProductUpdate}>
						Salvar alterações
					</Button>
				</Modal.Footer>
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
																	className="mx-auto"
																	size="sm"
																	variant="primary"
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

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message}/>
		</Container>
	);
}

Menu.propTypes = {
	userId : PropTypes.string,
	user : PropTypes.object.isRequired,
	companyInfo : PropTypes.object.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.any.isRequired,
	setData : PropTypes.any.isRequired,
	companySystemOpenByHour : PropTypes.any.isRequired
};