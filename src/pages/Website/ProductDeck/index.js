//	Importing React main module and its features
import React from "react";
import PropTypes from "prop-types";

//	Importing React features
import { CardDeck, Card, Nav, Col, Row, Image } from "react-bootstrap";

// Importing image from camera
import camera from "../../../assets/camera.svg";

const ProductDeck = {
	Header: function Header({ products, setProduct }) {
		return (
			<Nav fill variant="tabs">
				{products ? products.map((productA, index) => (
					<Nav.Item key={index}>
						<Nav.Link
							className="btn-outline-dark rounded"
							href={"#" + index}
							onClick={() => setProduct(productA)}
						>
							{productA.product.name}
						</Nav.Link>
					</Nav.Item>
				))
					:
					null
				}
			</Nav>
		);
	},
	Card: function ProductCard({ product }) {
		return (
			<>
				{product.product ?
					<CardDeck className="p-2">
						<Card className="h-100 p-1" text="light" bg="secondary" key={product._id}>
							<Row>
								<Col sm>
									<Image
										src={product.product.thumbnail_url ? product.product.thumbnail_url : camera}
										alt="thumbnail"
										fluid
										rounded
									/>
								</Col>
								<Col sm>
									<Row>
										<Card.Body>
											<Card.Title>{product.product ? product.product.name : null }</Card.Title>
											<Card.Text>
												{product.product ? ((product.product.ingredients.length === 1) ?
													"Ingrediente: "
													:
													"Ingredientes: "
												)
													:
													null
												}
												{product.product ? product.product.ingredients.map((ingredient, index) => (
													index === product.product.ingredients.length-1 ?
														ingredient
														:
														ingredient + ", "
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
													{(product.additions).map(addition => (
														<Col key={(addition) ? addition._id : null } sm>
															{addition.name + "\nPreço: R$" + addition.price}
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
										"Preço: R$" + product.product.prices[product.size]
										:
										null
									}
								</small>
							</Card.Footer>
						</Card>
					</CardDeck>
					:
					<h1 style={{color: "#000000"}} className="display-5 text-center m-auto p-5">
						Selecione o produto desejado acima
					</h1>
				}
			</>
		);
	}
};

export default ProductDeck;

ProductDeck.Header.propTypes = {
	products : PropTypes.array.isRequired,
	setProduct : PropTypes.any.isRequired
};

ProductDeck.Card.propTypes = {
	product : PropTypes.object.isRequired
};