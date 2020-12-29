//	Importing React main module and its features
import React, { useState } from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import {
	Container,
	//Modal,
	//OverlayTrigger,
	//Tooltip,
	Nav,
	Card,
	//Button,
	CardDeck,
	//Form,
	//Col,
	Row
} from "react-bootstrap";

//	Importing website utils
import Alert from "../Website/Alert";
//import Push from "../Website/Push";

//	Importing api to communicate to backend
//import api from "../../services/api";


//	Exporting resource to routes.js
export default function Menu({ companyInfo }) {
	
	// Card variable
	//const [companyCards] = useState(companyInfo && companyInfo.cards ? companyInfo.cards : null);
	const [types] = useState(companyInfo && companyInfo.productTypes ? companyInfo.productTypes : null);
	const [cardType, setCardType] = useState(null);
	//const [cardAvailable, setCardAvailable] = useState(null);
	//const [cardQtdMax, setCardQtdMax] = useState(null);
	//const [cardDiscount, setCardDiscount] = useState(null);

	//	Message settings
	const [modalAlert] = useState(false);
	const [title] = useState("");
	const [message] = useState("");
	//const [modalCards, setModalCards] = useState(false);


	const header = (
		<Card.Header className="pb-3">
			<Nav fill variant="tabs">
				{types && types.length ?
					types.map((typeP, index) => (
						<Nav.Item key={index}>
							<Nav.Link
								className="btn-outline-warning rounded"
								href={"#" + index}
								onClick={e => handleCardsList(e, typeP)}>
								{typeP}
							</Nav.Link>
						</Nav.Item>
					))
					:
					null
				}
	
			</Nav>
		</Card.Header>
	);

	// const productCard = (product) => {
	// 	return (
	// 		<Card className="col-sm-4 my-1 p-0" bg="secondary" key={product._id}>
	// 			<Card.Img variant="top" src={product.thumbnail ? product.thumbnail_url : camera} fluid="true" />
	// 			<Card.Body className="d-flex align-content-between flex-column" key={product._id}>
	// 				<Card.Title>{product.name}</Card.Title>
	// 				<Card.Text>
	// 					{product.ingredients.map((ingredient, index) => (
	// 						index === product.ingredients.length-1 ?
	// 							ingredient
	// 							:
	// 							ingredient + ", "
	// 					))}
	// 				</Card.Text>
	// 				{userId ?
	// 					<div className="d-flex justify-content-between flex-wrap my-auto">
	// 						<Button
	// 							variant="warning"
	// 							size="sm"
	// 							onClick ={e => handleProductModal(e, 1, product)}
	// 						>
	// 							Modificar
	// 						</Button>

	// 						{product.available ?
	// 							<Button
	// 								variant="success"
	// 								size="sm"
	// 								className="btn"
	// 								id="btn-available"
	// 							>
	// 								Disponível
	// 							</Button>
	// 							:
	// 							<Button
	// 								variant="dark"
	// 								size="sm"
	// 							>
	// 								Indisponível
	// 							</Button>
	// 						}

	// 						<Button
	// 							variant="danger"
	// 							size="sm"
	// 							onClick={e => handleProductModal(e,2, product)}
	// 						>
	// 							Remover
	// 						</Button>
	// 					</div>
	// 					:
	// 					<>
	// 						{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
	// 							|| (companyInfo && !companyInfo.manual ) ?

	// 							product.available ?
	// 								<Button
	// 									className="my-auto"
	// 									variant="warning"
	// 									size="sm"
	// 									onClick ={() => {
	// 										setProductNote("");
	// 										setAdditionsOrder([]);
	// 										setProductSize(0);
	// 										setProductTotal(0);
	// 										setProductOrder(product);
	// 										setProductTotal(product.prices[0]);
	// 										setProductOrderModal(true);
	// 									}}
	// 								>
	// 									Adicionar aos pedidos
	// 								</Button>
	// 								:
	// 								<Button
	// 									variant="danger"
	// 									size="sm"
	// 								>
	// 									Indisponível no momento
	// 								</Button>
	// 							:
	// 							<Button
	// 								variant="danger"
	// 								size="sm"
	// 							>
	// 								Estamos fechados
	// 							</Button>
	// 						}
	// 					</>
	// 				}
	// 			</Card.Body>
	// 			<Card.Footer>
	// 				<small>
	// 					{product.prices.length === 1 ?
	// 						"Preço: "
	// 						:
	// 						"Preços por tamanho: "
	// 					}
	// 					{product.prices.map((price, index) => (
	// 						index === product.prices.length-1 ?
	// 							"R$" + price
	// 							:
	// 							"R$" + price + ", "
	// 					))}
	// 				</small>
	// 			</Card.Footer>
	// 		</Card>
	// 	);
	// };

	//	Return a list of cards given type
	async function handleCardsList(event, typeP) {
		event.preventDefault();

		setCardType(typeP);
	}

	//  Function to change cards
	// async function handleCards(event) {
	// 	event.preventDefault();
	// }

	return (
		<Container className="product-container w-100">
			<Card className="px-3" text="light" bg="dark">
				{header}
				{cardType && cardType.length ?
					<CardDeck className="p-2">
						{Array(cardType.length).fill(null).map((value, i) => (
							i%3 === 0 ?
								<Row className="d-flex justify-content-around m-auto w-100" key={i/3}>
									{Array(3).fill(null).map((value, j) => (
										i+j < cardType.length ? "productCard(cardTypes[i+j])" : null
									))}
								</Row>
								:
								null
						))}
					</CardDeck>
					:
					<h1 className="display-5 text-center m-auto p-5">Selecione o cartão fidelidade acima</h1>
				}
			</Card>

			{/* <Modal
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
									src={preview ? preview : (productThumbnail_url ? productThumbnail_url : camera)}
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
									src={preview ? preview : (productThumbnail_url ? productThumbnail_url : camera)}
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
					<Button variant="danger">
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
								src={preview ? preview : (productOrder.thumbnail_url ? productOrder.thumbnail_url : camera)}
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
															src={add.thumbnail_url ? add.thumbnail_url : camera}
															alt="Adição"
														/>
														<Carousel.Caption className="d-flex flex-row align-items-end p-0 h-100">
															{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm)
																|| (companyInfo && !companyInfo.manual) ?
																<Button
																	className="mx-auto"
																	size="sm"
																	variant="primary"
																	
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
						|| (companyInfo && !companyInfo.manual) ?
						<Button variant="warning">
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

			<Modal
				show={modalCards}
				onHide={() => { setModalCards(false); setToastShow(false); }}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar informações dos cartões fidelidade</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form className="my-3" onSubmit={handleCards}>
						<Form.Group controlId="cardsUpdate">
							{cardTypes.map((typesP, index) => (
								<>
									<Row key={typesP} eventKey={index}>
										<Col>
											<Tabs
												fill
												defaultActiveKey={index}
												id="uncontrolled-tabs"
												activeKey={eventKey}
												onSelect={(k) => setEventKey(k)} >
											
												<Tab eventKey={index} title={typesP}>
													<Card>
														<Card.Body>	
															<Form.Group controlId="types">
																<Form.Label>Cartão fidelidade para {typesP}:</Form.Label>
																<br/>
																<InputGroup size="sm" className="mb-3">
																	<InputGroup.Prepend>
																		<InputGroup.Checkbox
																			checked={companyCards && companyCards[index] && companyCards[index].available ? companyCards[index].available: false}
																			onChange={e => setCompanyCards(e.target.checked)} 
																		/>
																	</InputGroup.Prepend>
																	<InputGroup.Append>
																		<InputGroup.Text>Marque aqui se existe cartão fidelidade para esse produto!</InputGroup.Text>
																	</InputGroup.Append>
																</InputGroup>
															</Form.Group>
															
															<Row>
																<Col>
																	<Form.Group controlId="qtdMax">
																		<Form.Label>Quantidade</Form.Label>
																		<Form.Control
																			value={cardQtdMax ? cardQtdMax : (companyCards && companyCards[index] && companyCards[index].qtdMax ? companyCards[index].qtdMax: null) }
																			onChange={e => setCardQtdMax(e.target.value)}
																			type="number"
																			min="10"
																			max="20"
																			placeholder="Quantidade para obter o desconto"
																			required
																		/>
																	</Form.Group>
																</Col>
																<Col>
																	<Form.Group controlId="discount">
																		<Form.Label>Desconto</Form.Label>
																		<Form.Control
																			value={companyCards && companyCards[index] && companyCards[index].discount ? companyCards[index].discount: null}
																			type="number"
																			min="5"
																			max="20"
																			placeholder="Desconto em Reais"
																			required
																		/>
																	</Form.Group>
																</Col>
															</Row>
														</Card.Body>
													</Card>
												</Tab>
											</Tabs>
										</Col>
									</Row>
								</>
							))
							}
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => { setModalCards(false); setToastShow(false); }}>
						Fechar
					</Button>
					<Button variant="warning" type="submit">
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal> */}

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message}/>
		</Container>
	);
}

Menu.propTypes = {
	userId : PropTypes.string,
	user : PropTypes.object.isRequired,
	companyInfo : PropTypes.object.isRequired,
};