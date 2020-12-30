//	Importing React main module and its features
import React, { useState } from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import {
	Container,
	Modal,
	Nav,
	Card,
	Button,
	CardDeck,
	Form,
	Col,
	Row,
	InputGroup
} from "react-bootstrap";

//	Importing website utils
import Alert from "../Website/Alert";
//import Push from "../Website/Push";

//	Importing api to communicate to backend
//import api from "../../services/api";


//	Exporting resource to routes.js
export default function Menu({ companyInfo }) {
	
	// Card variable
	const [companyCards] = useState(companyInfo && companyInfo.cards ? companyInfo.cards : null);
	const [types] = useState(companyInfo && companyInfo.productTypes ? companyInfo.productTypes : null);
	
	const [card, setCard] = useState(null);
	const [cardType, setCardType] = useState(null);
	const [cardAvailable, setCardAvailable] = useState(null);
	const [cardQtdMax, setCardQtdMax] = useState(null);
	const [cardDiscount, setCardDiscount] = useState(null);

	//	Message settings
	const [modalAlert] = useState(false);
	const [title] = useState("");
	const [message] = useState("");
	const [modalCards, setModalCards] = useState(false);

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

	const CardC = (
		<Card className="col-sm-4 my-1 p-0" bg="secondary" key={card && card.type ? card.type : null}>
			<Card.Body className="d-flex align-content-between flex-column" key={card && card.type ? card.type : null}>
				<Card.Title>{card && card.type ? card.type : null}</Card.Title>
				{card && card.available ?
					<>
						<Card.Text>
							{card && card.qtdMax ? "Quantidade de pedidos para completar o cartão: " + card.qtdMax : "Quantidade de pedidos desse produto para completar o cartão: Não atribuído"}
						</Card.Text>
						<Card.Text>
							{card && card.discount ? "Desconto aṕos completar o cartão: R$" + card.discount : "Desconto aṕos completar o cartão: Não atribuído" }
						</Card.Text>
					</>
					:
					<Card.Text>
						Não existe cartão fidelidade para este produto
					</Card.Text>
				}
				<div className="d-flex justify-content-between flex-wrap my-auto">
					<Button
						variant="success"
						size="sm"
						className="btn"
						id="btn-available"
						onClick ={e => setModalCards(e)}
					>
						Modificar
					</Button>
				</div>
			</Card.Body>
			<Card.Footer>
				<small>
					OBS: Se o pedido for mais barato que o desconto, o desconto será o valor do pedido. O valor do frete não está incluso!
				</small>
			</Card.Footer>
		</Card>
	);

	//	Return a list of cards given type
	async function handleCardsList(event, typeP) {
		event.preventDefault();
		
		for(const c of companyCards ) {
			if(c.type == typeP) {
				setCard(c);
				setCardType(typeP);
				setCardAvailable(c.available); 
				setCardQtdMax(c.qtdMax);
				setCardDiscount(c.discount);
			}
		}
	}

	// Function to change cards
	async function handleCards(event) {
		event.preventDefault();
	}

	return (
		<Container className="product-container w-100">
			<Card className="px-3" text="light" bg="dark">
				{header}
				{cardType && cardType.length ?
					<CardDeck className="p-2">
						<Row className="d-flex justify-content-around m-auto w-100" key={cardType}>
							{CardC}
						</Row>
					</CardDeck>
					:
					<h1 className="display-5 text-center m-auto p-5">Selecione o cartão fidelidade acima</h1>
				}
			</Card>

			<Modal
				show={modalCards}
				onHide={() => { setModalCards(false);} }
				size="lg"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Modificar cartão fidelidade</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form className="my-3" onSubmit={handleCards}>
						<Form.Label>Cartão fidelidade {cardType}</Form.Label>
						<Row>
							<Col>
								<Form.Group controlId="type">
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Checkbox
												checked={cardAvailable ? cardAvailable : false}
												onChange={e => setCardAvailable(e.target.checked)} 
											/>
										</InputGroup.Prepend>
										<InputGroup.Append>
											<InputGroup.Text>Marque aqui se existe cartão fidelidade para esse produto!</InputGroup.Text>
										</InputGroup.Append>
									</InputGroup>
								</Form.Group>
							</Col>	
						</Row>
						<Row>
							<Col>
								<Form.Group controlId="qtdMax">
									<Form.Label>Quantidade</Form.Label>
									<Form.Control
										value={cardQtdMax}
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
										value={cardDiscount}
										onChange={e => setCardDiscount(e.target.value)}
										type="number"
										min="5"
										max="20"
										placeholder="Desconto em Reais"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => { setModalCards(false); }}>
						Fechar
					</Button>
					<Button variant="warning" type="submit">
						Salvar alterações
					</Button>
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
};