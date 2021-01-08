//	Importing React main module and its features
import React from "react";
import PropTypes from "prop-types";

//	Importing React features
import { Card, Tabs, Tab, Col, Row, Image } from "react-bootstrap";

// Importing image from camera
import camera from "../../../assets/camera.svg";

export default function ProductDeck({ products }) {
	return (
		<Tabs fill defaultActiveKey={0} id="productDeck">
			{products.map((product, index) => (
				<Tab key={index} eventKey={index} title={product.product.name}>
					<Card className="h-100 p-1" text="dark" bg="light" key={product._id}>
						<Row>
							<Col sm>
								<Image
									src={product.product.thumbnail_url ? process.env.REACT_APP_API_URL + product.product.thumbnail_url : camera}
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
				</Tab>
			))}
		</Tabs>
	);
}

ProductDeck.propTypes = {
	products : PropTypes.array
};