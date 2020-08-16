//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import { Nav, Card, Button, CardColumns, Modal, Form, Col, Row, Image } from "react-bootstrap";

//	Importing api to communicate to backend
import api from "../../services/api";

//	Exporting resource to routes.js
export default function Menu() {
	const userId = sessionStorage.getItem("userId");
	const [productsByType, setProductsByType] = useState({});
	const [productTypes, setProductTypes] = useState([]);
	const [products, setProducts] = useState([]);
	const [user, setUser] = useState("");
	const [productId, setProductId] = useState("");
	const [productName, setProductName] = useState("");
	const [productIngredients, setProductIngredients] = useState([]);
	const [productPrices, setProductPrices] = useState([]);
	const [productType, setProductType] = useState("");
	const [productThumbnail_url, setProductThumbnail_url] = useState("");

	//	Modal settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modal2Show, setModal2Show] = useState(false);
	const [modal3Show, setModal3Show] = useState(false);

	//	Defining history to jump through pages
	const history = useHistory();

	//	Loading current user contacts
	useEffect(() => {
		api.get("product")
			.then((response) => {
				const products = response.data;

				api.get("productTypes")
					.then((types) => {
						if(types.data && types.data.length) {
							var prodsByType = {};
							for(var type of types.data) {
								var prods = [];

								for(var product of products) {
									if(product.type === type) {
										prods.push(product);
									}
								}
								
								prodsByType[type] = prods;
							}

							setProductTypes(types.data);
							setProductsByType(prodsByType);
							setProducts(prodsByType[Object.keys(prodsByType)[0]]);
							api.get("user/" + userId)
								.then((response) => {
									setUser(response.data);
								});
						} else {
							alert("Não há tipos de produtos cadastrados");
						}
					}).catch((error) => {
						if (error.response) {
							alert(error.response.data);
						} else {
							alert(error);
						}
					});
			}).catch((error) => {
				if (error.response) {
					alert(error.response.data);
				} else {
					alert(error);
				}

				history.push("/");
			});
	}, [history, userId]);

	async function handleProduct(event, product) {
		event.preventDefault();

		setProducts(productsByType[product]);
	}

	async function handleProductUpdate(event, product) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", productName);
		data.append("ingredients", productIngredients);
		data.append("prices", productPrices);
		data.append("type", productType);
		data.append("thumbnail_url", productThumbnail_url);

		api.put("product/" + productId, data,  {
			headers : { 
				authorization: user._id
			}})
			.then((response) => {
				setModal3Show(true);
				setModal1Show(false);
			}).catch((error) => {
				if(error.response) {
					alert(error.response.data);
				} else {
					alert(error);
				}
			});
	}

	async function handleModal(event, modal, action, product = null) {
		event.preventDefault();

		if(action === "open") {
			setProductId(product._id);
			setProductName(product.name);
			setProductIngredients(product.ingredients);
			setProductPrices(product.prices);
			setProductType(product.type);
			setProductThumbnail_url(product.thumbnail_url);
		}

		if(modal === 1) {
			setModal1Show((action === "open") ? true : false);
		} else if(modal === 1) {
			setModal2Show((action === "open") ? true : false);
		} else {
			setModal3Show((action === "open") ? true : false);
		}
	}

	return (
		<div className="product-container container mt-5 w-100">
			<Card className="px-3" bg="dark">
				<Card.Header className="pb-3">
					<Nav fill variant="tabs" defaultActiveKey={Object.keys(productsByType)[0]}>
						{Object.keys(productsByType).map((type, index) => (
							productsByType[type].length ?
								<Nav.Item key={index}>
									<Nav.Link 
										className="btn-outline-warning rounded"
										href={type} 
										onClick={e => handleProduct(e, type)}>
										{type[0].toUpperCase() + type.slice(1)}
									</Nav.Link>
								</Nav.Item>
								:
								null
						))}
					</Nav>
				</Card.Header>
				{products.length ?
					<CardColumns>
						{products.map((product) => (
							<Card bg="secondary" key={product._id}>
								<Card.Img variant="top" src={product.thumbnail_url} fluid="true" />
								<Card.Body key={product._id}>
									<Card.Title>{product.name}</Card.Title>
									<Card.Text>
										{product.ingredients.map((ingredient, index) => (
											index === product.ingredients.length-1 ?
												ingredient
												:
												ingredient + ", "
										))}
									</Card.Text>
									{user ? 
										user.userType === 1 || user.userType === 2 ?
											<Button 
												onClick ={e => handleModal(e, 1, "open", product)} 
												variant="warning">
													Modificar produto
											</Button>
											:
											<Button 
												onClick ={e => handleModal(e, 2, "open", product)} 
												variant="warning">
													Adicionar aos pedidos
											</Button>
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
						))}
					</CardColumns>
					:
					null
				}
			</Card>
			
			<Modal show={modal1Show} onHide={e => setModal1Show(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Modificar produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col>
								<Image src={productThumbnail_url} fluid="true"/>
							</Col>
							<Col>
								<Form.Group controlId="productName">
									<Form.Label>Nome</Form.Label>
									<Form.Control 
										value={productName}
										onChange={e => setProductName(e.target.value)} 
										type="text" 
										placeholder="Nome do produto"
									/>
								</Form.Group>
								<Form.Group controlId="productPrices">
									<Form.Label>
										{productPrices.length == 1 ? "Preço" : "Preços"}
									</Form.Label>
									<Form.Control 
										value={productPrices ? 
											productPrices.map((price, index) => (
												index === 0 ? price : " " + price
											))
											:
											null
										}
										onChange={e => setProductPrices(e.target.value)} 
										type="text"
									/>
									<Form.Text className="text-muted">
										Se o produto tiver mais de um tamanho, separe-os entre vírgulas
									</Form.Text>
								</Form.Group>
								<Form.Group controlId="productType">
									<Form.Label>Tipo</Form.Label>
									<Form.Control 
										value={productType} 
										onChange={e => setProductType(e.target.value)} 
										as="select">
										{productTypes.map((type, index) => (
											<option key={index}>{type}</option>
										))}
									</Form.Control>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group controlId="productIngredients">
									<Form.Label>Ingredientes</Form.Label>
									<Form.Control 
										value={productIngredients ? 
											productIngredients.map((ingredients, index) => (
												index === 0 ? ingredients : " " + ingredients
											))
											:
											null
										}
										onChange={e => setProductIngredients(e.target.value)} 
										as="textarea"
										rows="2"
									/>
									<Form.Text className="text-muted">
										Para múltiplos ingredientes, separe-os entre vírgulas
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => setModal1Show(false)}>
						Fechar
					</Button>
					<Button variant="primary" type="submit" onClick={handleProductUpdate}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modal2Show} onHide={e => setModal2Show(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar ao pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => setModal2Show(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={e => setModal2Show(false)}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modal3Show} onHide={e => setModal3Show(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Alterações produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>Alterações salvas com sucesso!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => setModal3Show(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}