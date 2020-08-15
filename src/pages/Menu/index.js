//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import Image from "react-bootstrap/Image";
import { Nav, Card, Button, CardColumns, ListGroup } from "react-bootstrap";

//	Importing api to communicate to backend
import api from "../../services/api";

//	Exporting resource to routes.js
export default function Menu() {
	const [productsByType, setProductsByType] = useState({});
	const [products, setProducts] = useState([]);

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
									if(product.type == type) {
										prods.push(product);
									}
								}
								
								prodsByType[type] = prods;
							}

							setProductsByType(prodsByType);
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
	}, [history]);

	async function handleProduct(event, product) {
		event.preventDefault();

		setProducts(productsByType[product]);
	}

	return (
		<div className="product-container container mt-5 w-75">
			<Card>
				<Card.Header key>
					<Nav variant="tabs">
						{Object.keys(productsByType).map((type, index) => (
							productsByType[type].length ?
								<Nav.Item key={index}>
									<Nav.Link 
										href={type} 
										onClick={e => handleProduct(e, type)}>{type[0].toUpperCase() + type.slice(1)}
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
							<Card key={product._id}>
								<Card.Img variant="top" src={product.thumbnail_url} fluid />
								<Card.Body key={product._id}>
									<Card.Title>{product.name}</Card.Title>
									<Card.Text>
										{product.ingredients.map((ingredient, index) => (
											index == product.ingredients.length-1 ?
												ingredient
												:
												ingredient + ", "
										))}
									</Card.Text>
									<Button variant="primary">Adicionar aos pedidos</Button>
								</Card.Body>
								<Card.Footer>
									<small>
										{product.prices.length == 1 ?
											"Preço: "
											:
											"Preços por tamanho: "
										}
										{product.prices.map((price, index) => (
											index == product.prices.length-1 ?
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
		</div>
	);
}