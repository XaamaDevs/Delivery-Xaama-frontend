//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import {
	Modal,
	Card,
	Button,
	CardDeck,
	Form,
	Col,
	Row
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../components/Alert";
import Push from "../../components/Push";

//	Importing api to communicate to backend
import api from "../../services/api";

//	Exporting resource to routes.js
export default function Cards({ companyInfo, userId }) {
	// Card variable
	const [companyCards] = useState(companyInfo && companyInfo.cards ? companyInfo.cards : null);
	const [types] = useState(companyInfo && companyInfo.productTypes ? companyInfo.productTypes : null);

	const [card, setCard] = useState(null);
	const [cardType, setCardType] = useState(null);
	const [cardAvailable, setCardAvailable] = useState(null);
	const [cardQtdMax, setCardQtdMax] = useState(null);
	const [cardDiscount, setCardDiscount] = useState(null);

	//	Message settings
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [modalCards, setModalCards] = useState(false);
	const [toastShow, setToastShow] = useState(false);

	//	Update card state variables
	useEffect(() => {
		setCardType(card ? card.type : null);
		setCardAvailable(card ? card.available : null);
		setCardQtdMax(card ? card.qtdMax : null);
		setCardDiscount(card ? card.discount : null);
	}, [modalCards]);

	// Function to change cards
	async function handleCards(event) {
		event.preventDefault();

		for(var c of companyCards) {
			if(c.type == cardType) {
				c.available = cardAvailable ? cardAvailable : false;
				c.qtdMax = cardQtdMax ? cardQtdMax : 0;
				c.discount = cardDiscount ? cardDiscount : 0;
			}
		}

		const data = {
			productTypes: types.join(", "),
			cards: companyCards
		};

		await api.put("companyUpdateCards", data, {
			headers : {
				"x-access-token": userId
			}
		}).then(() => {
			setModalCards(false);
			setTitle("Alterações cartão de fidelidade!");
			setMessage("Alterações feitas com sucesso!");
			setModalAlert(true);
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response.status === 400 || error.response.status === 404) {
				setMessage(error.message);
			} else if(error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	return (
		<>
			<CardDeck className="mx-3">
				<Row xs={1} sm={2} md={3} className="d-flex justify-content-around m-auto w-100">
					{companyCards.map((cardI, index) => (
						<Col key={index} className="my-2">
							<Card text="white" bg="dark">
								<Card.Header>
									{cardI.type[0].toUpperCase() + cardI.type.slice(1)}
								</Card.Header>
								<Card.Body>
									{cardI && cardI.available ?
										<>
											<Card.Text>
												{cardI && cardI.qtdMax ? "Quantidade de pedidos para completar o cartão: " + cardI.qtdMax : "Quantidade de pedidos desse produto para completar o cartão: Não atribuído"}
											</Card.Text>
											<Card.Text>
												{cardI && cardI.discount ? "Desconto aṕos completar o cartão: R$" + cardI.discount : "Desconto aṕos completar o cartão: Não atribuído" }
											</Card.Text>
										</>
										:
										<Card.Text>
											Não existe cartão fidelidade para este produto
										</Card.Text>
									}
									<Button
										variant="light"
										size="sm"
										id="btn-custom"
										onClick ={() => { setCard(cardI); setModalCards(true); } }
									>
										Modificar
									</Button>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</CardDeck>

			<Modal
				show={modalCards}
				onHide={() => { setCard(null); setModalCards(false); setToastShow(false);} }
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>
						Modificar cartão fidelidade - {cardType ? cardType[0].toUpperCase() + cardType.slice(1) : null}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCards}>
						<Row>
							<Col sm>
								<Form.Group controlId="type">
									<Form.Check
										type={"checkbox"}
										checked={cardAvailable ? cardAvailable : false}
										onChange={e => setCardAvailable(e.target.checked)}
										label={"Disponibilizar cartão fidelidade para esse produto?"}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm>
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
							<Col sm>
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
						<Modal.Footer>
							<Button variant="danger" onClick={() => { setCard(null); setModalCards(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message}/>
		</>
	);
}

Cards.propTypes = {
	userId : PropTypes.string,
	companyInfo : PropTypes.object,
};