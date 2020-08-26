//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

// Importing backend api
import api from "../../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing React features
import { Button, Modal, Row, Col, Spinner, Container } from "react-bootstrap";

//	Exporting resource to routes.js
export default function AllOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");

  //	Modal settings
	const [modalOrderListing, setModalOrderListing] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
		async function loadOrder() {
			const response = await api.get("/order", {
				headers : { 
					authorization: userId
				}
			});
      setOrders(response.data);
			setLoading(false);
		}

		loadOrder();
  }, [orders]);
  
	return (
		<div className="all-container w-100">
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
				<Row xs={1} sm={2} md={3} xl={4} className="d-flex justify-content-around m-auto w-100" >
					{orders.map(order => (
						<Col key={order._id} className="order-item">
							<header>
								<img src={order.user.thumbnail ? order.user.thumbnail_url: camera } />
								<div className="order-info">
									<strong>{order.user.name}</strong>
									<span>{order.user.email}</span>
								</div>             
							</header>
							<p>{order.user.phone ? order.phone: "Telefone: (__) _ ____-____"}</p>
							<p>{order.user.address && order.user.address.length ? order.user.address.join(", ") : "Endereço não informado" }</p>
							<Button
									onClick={e => setModalOrderListing(true)}
									variant="outline-warning">Ver pedido
								</Button>
						</Col>
					))}
				</Row>
			}

      <Modal show={modalOrderListing} onHide={e => setModalOrderListing(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Pedido</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={e => setModalOrderListing(false)}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
			
			<Modal show={modalAlert} onHide={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant={color} onClick={e => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}