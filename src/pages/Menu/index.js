//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Container, Spinner, Toast, Nav, Card, Button, CardDeck, Modal, Form, Col, Row, Image } from "react-bootstrap";

//	Importing api to communicate to backend
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Menu({ userId, user }) {
	//	Product variables
	const [productsByType, setProductsByType] = useState({});
	const [productTypes, setProductTypes] = useState([]);
	const [products, setProducts] = useState([]);
	const [productId, setProductId] = useState("");
	const [productName, setProductName] = useState("");
	const [productIngredients, setProductIngredients] = useState("");
	const [productPrices, setProductPrices] = useState("");
	const [productType, setProductType] = useState("");
	const [productThumbnail_url, setProductThumbnail_url] = useState(null);
	const [productThumbnail, setProductThumbnail] = useState(null);

	//	Message settings
	const [productAddModal, setProductAddModal] = useState(false);
	const [productUpdateModal, setProductUpdateModal] = useState(false);
	const [productDeleteModal, setProductDeleteModal] = useState(false);
	const [productOrderModal, setProductOrderModal] = useState(false);
	const [modalWarningShow, setModalWarningShow] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");
	const [isLoading, setLoading] = useState(true);

	//	Defining history to jump through pages
	const history = useHistory();

	//	Loading current user info and products list by type
	useEffect(() => {
		async function fetchData() {
			await api.get("productTypes")
				.then((response) => {
					if(response.data && response.data.length) {
						setProductTypes(response.data);
					} else {
						setTitle("Erro!");
						setColor("danger");
						setMessage("Não há tipos de produtos cadastrados");
						setToastShow(true);
					}
				}).catch((error) => {
					setTitle("Erro!");
					setColor("danger");
					if(error.response) {
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
					setColor("danger");
					if(error.response) {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});

			setLoading(false);
		}

		fetchData();
	}, [productTypes, history, userId]);

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
	}

	async function handleProductAdd(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", productName);
		data.append("ingredients", productIngredients);
		data.append("type", productType);
		data.append("prices", productPrices);

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
				authorization: userId
			}})
			.then(() => {
				setProductAddModal(false);
				setTitle("Alterações produto!");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalWarningShow(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
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
				authorization: userId
			}})
			.then(() => {
				setProductUpdateModal(false);
				setTitle("Alterações produto!");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalWarningShow(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
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
				authorization: userId
			}})
			.then(() => {
				setProductDeleteModal(false);
				setTitle("Alterações produto!");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalWarningShow(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	async function handleProductModal(event, modal, product = null) {
		event.preventDefault();
		
		setProductId(product ? product._id : "");
		setProductName(product ? product.name : "");
		setProductIngredients(product ? product.ingredients.join(", ") : "");
		setProductPrices(product ? product.prices.join(", ") : "");
		setProductType(product ? product.type : "");
		setProductThumbnail(null);
		setProductThumbnail_url(product ? product.thumbnail_url : null);

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
			setProductOrderModal(true);
			break;
		default:
			break;
		}
	}

	async function validatePrices(event) {
		const c = event.target.value.replace(productPrices, "");

		if(!/^((^$)|(^\s$)|(^,$)|(^\.$))$/.test(c) && c.length <= 1) {
			event.target.value = /^[0-9]+(\.[0-9])*(,\s[0-9]+(\.?[0-9])*)*$/.test(event.target.value) ? event.target.value : productPrices;
		}

		if(productPrices[productPrices.length-1] === c && /^((^\s$)|(^,$)|(^\.$))$/.test(c)) {
			event.target.value = productPrices;
		}

		if(event.target.value.length === 1 && /^((^\s$)|(^,$)|(^\.$))$/.test(c)) {
			event.target.value = productPrices;
		}

		setProductPrices(event.target.value);
	}

	async function validateIngredients(event) {
		const c = event.target.value.replace(productIngredients, "");

		if(!/^((^$)|(^\s$)|(^,$))$/.test(c) && c.length <= 1) {
			event.target.value = /^[A-Za-z]+(,\s[A-Za-z]+)*$/.test(event.target.value) ? event.target.value : productIngredients;
		}

		if(productIngredients[productIngredients.length-1] === c && /^((^\s$)|(^,$))$/.test(c)) {
			event.target.value = productIngredients;
		}

		if(event.target.value.length === 1 && /^((^\s$)|(^,$))$/.test(c)) {
			event.target.value = productIngredients;
		}

		setProductIngredients(event.target.value);
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
				<Card.Img variant="top" src={product.thumbnail ? product.thumbnail_url : camera} fluid="true" />
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
							<div className="d-flex justify-content-between flex-wrap my-auto">
								<Button  
									variant="warning"
									size="sm"
									onClick ={e => handleProductModal(e, 1, product)}
								>
									Modificar
								</Button>
								<Button 
									variant="danger" 
									size="sm"
									onClick={e => handleProductModal(e, 2, product)}
								>
									Remover
								</Button>
							</div>
							:
							<Button
								className="my-auto" 
								variant="warning"
								size="sm"
								onClick ={e => handleProductModal(e, 3, product)} 
							>
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

	const toast = (
		<div
			aria-live="polite"
			aria-atomic="true"
			style={{
				position: "fixed",
				top: "inherit",
				right: "3%"
			}}
		>
			<Toast show={toastShow} onClose={() => setToastShow(false)} delay={3000} autohide>
				<Toast.Header>
					<strong className="mr-auto">{title}</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>
	);

	return (
		<Container className="product-container w-100">
			<Card className="px-3" bg="dark">
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
				{toast}
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
									id="thumbnail" 
									className={preview || productThumbnail_url ? "btn border-0 m-auto" : "btn w-75 m-auto"}
									src={preview ? preview : (productThumbnail_url ? productThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
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
									<Form.Control 
										value={productPrices}
										onChange={validatePrices} 
										pattern="^[0-9]+(\.[0-9])*(,\s[0-9]+(\.?[0-9])*)*$"
										type="text"
										required
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
										as="select"
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
						<Row>
							<Col sm>
								<Form.Group controlId="productIngredients">
									<Form.Label>Ingredientes</Form.Label>
									<Form.Control 
										value={productIngredients}
										onChange={validateIngredients} 
										pattern="^[A-Za-z]+(,\s[A-Za-z]+)*$"
										as="textarea"
										rows="2"
										required
									/>
									<Form.Text className="text-muted">
										Para múltiplos ingredientes, separe-os entre vírgulas
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setProductAddModal(false); setToastShow(false);}}>
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
				onHide={() => {setProductUpdateModal(false); setToastShow(false);}} 
				size="lg" 
				centered
			>
				{toast}
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
									id="thumbnail" 
									className={preview || productThumbnail_url ? "btn border-0 m-auto" : "btn w-100 m-auto"}
									src={preview ? preview : (productThumbnail_url ? productThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
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
										{productPrices && productPrices.split(",").length === 1 ? "Preço" : "Preços"}
									</Form.Label>
									<Form.Control 
										value={productPrices}
										onChange={validatePrices} 
										pattern="^[0-9]+(\.[0-9])*(,\s[0-9]+(\.?[0-9])*)*$"
										type="text"
										required
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
										as="select"
										required
									>
										{productTypes.map((type, index) => (
											<option key={index}>{type}</option>
										))}
									</Form.Control>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm>
								<Form.Group controlId="productIngredients">
									<Form.Label>Ingredientes</Form.Label>
									<Form.Control 
										value={productIngredients}
										onChange={validateIngredients} 
										pattern="^[A-Za-z]+(,\s[A-Za-z]+)*$"
										as="textarea"
										rows="2"
										required
									/>
									<Form.Text className="text-muted">
										Para múltiplos ingredientes, separe-os entre vírgulas
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setProductUpdateModal(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={productDeleteModal} onHide={() => {setProductDeleteModal(false); setToastShow(false);}}>
				{toast}
				<Modal.Header closeButton>
					<Modal.Title>Remover produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h3>
						{productName && productType ? 
							productType[0].toUpperCase() + productType.slice(1) + " " + productName
							:
							null
						}
					</h3>
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

			<Modal show={productOrderModal} onHide={() => setProductOrderModal(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar ao pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, youre reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => setProductOrderModal(false)}>
						Close
					</Button>
					<Button variant="warning" onClick={() => setProductOrderModal(false)}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modalWarningShow} onHide={() => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant={color} onClick={() => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}