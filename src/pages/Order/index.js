//	Importing React main module and its features
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import {
	Card,
	Button,
	Modal,
	Form,
	Row,
	Col,
	Spinner,
	Container,
	Image
} from "react-bootstrap";

//	Importing website utils
import Alert from "../Website/Alert";
import Push from "../Website/Push";
import ProductDeck from "../Website/ProductDeck";

// Importing image from camera
import camera from "../../assets/camera.svg";

// Importing styles
import "./styles.css";

// Importing backend api
import api from "../../services/api";

//	Importing socket utils
import {
	connect,
	disconnect,
	subscribeToNewOrders,
	subscribeToDeleteOrders,
	subscribeToUpdateOrders
} from "../../services/websocket";

//	Exporting resource to routes.js
export default function AllOrders({ userId }) {
	//	Order state variables
	const [orders, setOrders] = useState([]);
	const [orderId, setOrderId] = useState("");
	const [orderA, setOrderA] = useState({});
	const [product, setProduct] = useState({});
	const [feedback, setFeedback] = useState("");

	//	Modal settings
	const [orderListingModal, setOrderListingModal] = useState(false);
	const [feedbackModal, setFeedbackModal] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [modalClose, setModalClose] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setLoading] = useState(true);

	function setupWebSocket() {
		disconnect();
		connect();
  }

  	//	Defining history to jump through pages
	const history = useHistory();
  
  function filterOrders(o) {
    let resp = o.filter(f => ( f.user._id === userId ));
    return resp && resp.length ? resp : null;
  }
  
  async function newOrders(o) {
    const resp = await filterOrders(o);
    if(resp && resp.length) {
      setOrders([...orders, resp]);
    }
  }

	useEffect(() => {
    subscribeToNewOrders(o => newOrders(o));
    subscribeToUpdateOrders(o => setOrders(filterOrders(o)));
    subscribeToDeleteOrders(o => setOrders(o));
	}, [orders]);

	useEffect(() => {
		async function loadOrder() {
			await api.get("order/" + userId)
				.then((response) => {
					setOrders(response.data);
					setupWebSocket();
				}).catch((error) => {
					setTitle("Alerta!");
					if(error.response && typeof(error.response.data) !== "object") {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});
			setLoading(false);
		}

		loadOrder();
	}, [userId]);

	async function handleSetOrder(event, order) {
		event.preventDefault();

		setOrderA(order);
		setOrderListingModal(true);
	}

	async function handleFeedback(event) {
		event.preventDefault();

		await api.put("order/" + orderId, {
			status: true,
			feedback: feedback
		}).then(() => {
			setFeedbackModal(false);
			setTitle("Avaliação enviada!");
			setMessage("Obrigado pelo seu feedback!");
			setModalClose(true);
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && typeof(error.response.data) !== "object") {
				setMessage(error.response.data);
			} else {
				setMessage(error.message);
			}
			setFeedbackModal(false);
		});
		setFeedback("");
	}

	return (
		<div className="all-container w-100">
			<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
			{isLoading ?
				<Container className="d-flex h-100">
					<Spinner
						className="my-5 mx-auto"
						style={{width: "5rem", height: "5rem"}}
						animation="grow"
						variant="warning"
					/>
				</Container>
				:
				<>
          {orders && orders.length  ?
            <>
              <h1 style={{color: "#FFFFFF"}} className="display-4 text-center m-auto p-3">Seus últimos pedidos!</h1>
                
              <Row xs={1} sm={2} md={3} xl={4} className="d-flex justify-content-around m-auto w-100" >
                {orders.map(order => (
                  <Col key={order._id} className="order-item">
                    <header>
                      <Image src={order.user.thumbnail_url ? order.user.thumbnail_url: camera } alt="Thumbnail"/>
                      <div className="order-info">
                        <strong>{order.user.name}</strong>
                        <span>{order.user.email}</span>
                      </div>
                    </header>
                    <p>{order.user.phone ? order.phone: "Telefone não informado"}</p>
                    {order.deliver ?
                      <p>{"Endereço de entrega: " + (order.address).join(", ")}</p>
                      :
                      <p>{"Vai retirar no balcão!"}</p>
                    }
                    <p>
                      {"Total a pagar R$" + order.total}
                    </p>
                    <Row>
                      <Button
                        onClick={e => handleSetOrder(e, order)}
                        className="btn d-flex justify-content-center mx-auto mt-1"
                        id="btn-password"
                      >
                      Ver pedido
                      </Button>
                      {!(order.status) ?
                        <Button
                          className="d-flex justify-content-center mx-auto mt-1"
                          variant="danger">Pedido sendo preparado
                        </Button>
                        :
                        <>
                          {!(order.feedback) ?
                            <>
                              <Button
                                className="d-flex justify-content-center mx-auto mt-1"
                                variant="warning">Pedido a caminho
                              </Button>
                              <Button
                                onClick={() => {setOrderId(order._id); setFeedbackModal(true);}}
                                className="d-flex justify-content-center mx-auto mt-1"
                                variant="outline-warning">Recebeu seu pedido? Avalie!
                              </Button>
                            </>
                            :
                            <Button
                              className="d-flex justify-content-center mx-auto mt-1"
                              variant="warning">Pedido entregue
                            </Button>
                          }
                        </>
                      }
                    </Row>
                  </Col>
                ))}
              </Row>
            </>
          :
          <>
            <h1 style={{color: "#FFFFFF"}} className="display-4 text-center m-auto p-3">Não há pedidos!</h1>
          </>
        }
				</>
			}

			<Modal
				show={orderListingModal}
				onHide={() => setOrderListingModal(false)}
				size="lg"
				className="p-0"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Pedido de {orderA.user ? orderA.user.name : null }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Card bg="light">
						<Card.Header>
							<ProductDeck.Header products={orderA.products} setProduct={setProduct} />
						</Card.Header>
						{isLoading ?
							<Spinner
								className="my-5 mx-auto"
								style={{width: "5rem", height: "5rem"}}
								animation="grow"
								variant="warning"
							/>
							:
							product ? <ProductDeck.Card product={product} /> : null
						}
					</Card>
				</Modal.Body>
			</Modal>

			<Modal show={feedbackModal} onHide={() => {setFeedbackModal(false);}} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Avaliar pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleFeedback}>
						<Row>
							<Col>
								<Form.Group controlId="feedback">
									<Form.Label>Sua avaliação</Form.Label>
									<Form.Control
										value={feedback}
										onChange={e => setFeedback(e.target.value)}
										as="textarea"
										rows="12"
										placeholder="Avaliação sobre o pedido e atendimento"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setFeedbackModal(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Enviar avaliação
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Alert.Close modalClose={modalClose} title={title} message={message} setModalClose={setModalClose} />
		</div>
	);
}

AllOrders.propTypes = {
	userId : PropTypes.string.isRequired
};