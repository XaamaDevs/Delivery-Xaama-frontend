//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import { Nav, Card, Button, CardDeck, Modal, Form, Col, Row, Image } from "react-bootstrap";

//	Importing api to communicate to backend
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Menu() {
	const userId = sessionStorage.getItem("userId");
	const [productsByType, setProductsByType] = useState({});
	const [productTypes, setProductTypes] = useState([]);
	const [products, setProducts] = useState([]);
	const [user, setUser] = useState("");
	const [productId, setProductId] = useState("");
	const [productName, setProductName] = useState("");
	const [productIngredients, setProductIngredients] = useState("");
	const [productPrices, setProductPrices] = useState("");
	const [productType, setProductType] = useState("");
	const [productThumbnail_url, setProductThumbnail_url] = useState("");
	const [productThumbnail, setProductThumbnail] = useState(null);

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

	const preview = useMemo(() => {
		return productThumbnail ? URL.createObjectURL(productThumbnail) : null;
	}, [productThumbnail]);

	//	Function to handle input product thumbnail
	async function inputImage(event) {
		event.preventDefault();
	
		const input = document.getElementById("inputImage").click();
	}

	//	Return a list of products given type
	async function handleProductsList(event, type) {
		event.preventDefault();

		setProducts(productsByType[type]);
	}

	async function handleProductUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", productName);
		data.append("ingredients", productIngredients);
		data.append("prices", productPrices);
		data.append("type", productType);
		if(productThumbnail) {
			data.append("thumbnail", productThumbnail);
			console.log(productThumbnail);
		} else {
			const blob = await fetch(productThumbnail_url).then(r => r.blob());
			const token = productThumbnail_url.split(".");
			const extension = token[token.length-1];
			data.append("thumbnail", new File([blob], "thumbnail." + extension));
		}

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
			setProductIngredients(product.ingredients.join(", "));
			setProductPrices(product.prices.join(", "));
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

	const header = (
		<Card.Header className="pb-3">
			<Nav fill variant="tabs" defaultActiveKey={Object.keys(productsByType)[0]}>
				{Object.keys(productsByType).map((type, index) => (
					productsByType[type].length ?
						<Nav.Item key={index}>
							<Nav.Link 
								className="btn-outline-warning rounded"
								href={type} 
								onClick={e => handleProductsList(e, type)}>
								{type[0].toUpperCase() + type.slice(1)}
							</Nav.Link>
						</Nav.Item>
						:
						null
				))}
			</Nav>
		</Card.Header>
	);

	const productCard = (product) => {
		return (
			<Card className="col-sm-3 my-1" bg="secondary" key={product._id}>
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
		);
	};

	return (
		<div className="product-container container mt-5 w-100">
			<Card className="px-3" bg="dark">
				{header}
				{products.length ?
					<CardDeck className="p-2">
						{Array(products.length).fill(null).map((value, i) => (
							i%3 == 0 ?
								<Row className="d-flex justify-content-around" key={i/3}>
									{Array(3).fill(null).map((value, j) => (
										i+j < products.length ? 
											productCard(products[i+j])
											:
											null
									))}
								</Row>
								:
								null
						))}
					</CardDeck>
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
							<Col className="d-flex m-auto">
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setProductThumbnail(event.target.files[0])}
								/>
								<Image 
									id="thumbnail" 
									src={preview ? preview : (productThumbnail_url ? productThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
									fluid="true"
								/>
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
										{productPrices && productPrices.split(",").length == 1 ? "Preço" : "Preços"}
									</Form.Label>
									<Form.Control 
										value={productPrices}
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
										value={productIngredients}
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

			<Modal show={modal3Show} onHide={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>Alterações produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>Alterações salvas com sucesso!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}