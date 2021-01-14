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
export default function Coupons({ userId }) {
	//	Coupon state variables
	const [coupons, setCoupons] = useState([]);
	const [coupon, setCoupon] = useState([]);
	const [couponUserId, setCouponUserId] = useState([]);
	const [couponName, setCouponName] = useState("");
	const [couponType, setCouponType] = useState("");
	const [couponQty, setCouponQty] = useState("");
	const [couponMethod, setCouponMethod] = useState("");
	const [couponDiscount, setCouponDiscount] = useState(0);
	const [couponAvailable, setCouponAvailable] = useState(false);
	const [modalCoupon, setModalCoupon] = useState(false);

	//	Message settings
	const [modalAlert, setModalAlert] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [toastShow, setToastShow] = useState(false);

	//	Update card state variables
	useEffect(() => {
		setCouponUserId(coupon ? coupon.userId : []);
		setCouponName(coupon ? coupon.name : "");
		setCouponType(coupon ? coupon.type : "");
		setCouponQty(coupon ? coupon.qty : "");
		setCouponMethod(coupon ? coupon.method : "");
		setCouponDiscount(coupon ? coupon.discount : 0);
		setCouponAvailable(coupon ? coupon.available : false);
	}, [modalCoupon]);

	useEffect(() => {
		async function fetchData() {
			api.get("couponAll", {
				headers: {
					"x-access-token": userId
				}})
				.then((response) => {
					if(response.data) {
						setCoupons(response.data);
					}
				})
				.catch((error) => {
					setTitle("Erro!");
					if(error.response && typeof(error.response.data) !== "object") {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});
		}

		fetchData();
	});

	//	Function to update coupons
	async function handleCoupons(event) {
		event.preventDefault();

		const data = {
			userId: couponUserId,
			name: couponName,
			type: couponType,
			qty: couponQty,
			method: couponMethod,
			discount: couponDiscount,
			available: couponAvailable,
		};

		await api.put("coupon/" + coupon._id, data, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setModalCoupon(false);
				setTitle("Alterações de cupom");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	return (
		<>
			<CardDeck className="mx-3">
				<Row xs={1} sm={2} md={3} className="d-flex justify-content-around m-auto w-100">
					{coupons.map((couponI, index) => (
						<Col key={index} className="my-2">
							<Card text="white" bg="dark">
								<Card.Header>
									{couponI.name[0].toUpperCase() + couponI.name.slice(1)}
								</Card.Header>
								<Card.Body>
									<Card.Text>
										{couponI.qty ? "Quantidade: " + couponI.qty : "Quantidade: Não atribuído"}
									</Card.Text>
									<Card.Text>
										{couponI.discount ?
											"Desconto:" (couponI.method === "cash" ? "R$" + couponI.discount : couponI.discount + "%")
											:
											"Desconto: Não atribuído"
										}
									</Card.Text>
									<Button
										variant="light"
										size="sm"
										id="btn-custom"
										onClick ={() => { setCoupon(couponI); setModalCoupon(true); } }
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
				show={modalCoupon}
				onHide={() => { setCoupon(null); setModalCoupon(false); setToastShow(false);} }
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>
						Modificar cupom - {couponName ? couponName[0].toUpperCase() + couponName.slice(1) : null}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCoupons}>
						<Row>
							<Col sm>
								<Form.Group controlId="type">
									<Form.Check
										type={"checkbox"}
										checked={couponAvailable ? couponAvailable : false}
										onChange={e => setCouponAvailable(e.target.checked)}
										label={"Disponibilizar cupom?"}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm>
								<Form.Group controlId="qty">
									<Form.Label>Quantidade</Form.Label>
									<Form.Control
										value={couponQty}
										onChange={e => setCouponQty(e.target.value)}
										type="number"
										placeholder="Quantidade"
										required
									/>
								</Form.Group>
							</Col>
							<Col sm>
								<Form.Group controlId="discount">
									<Form.Label>Desconto</Form.Label>
									<Form.Control
										value={couponDiscount}
										onChange={e => setCouponDiscount(e.target.value)}
										type="number"
										placeholder="Desconto"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => { setCoupon(null); setModalCoupon(false); setToastShow(false);}}>
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

Coupons.propTypes = {
	userId : PropTypes.string
};