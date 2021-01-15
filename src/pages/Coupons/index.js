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
	Row,
	Nav,
	Container,
	Spinner
} from "react-bootstrap";

//	Importing website utils
import Alert from "../../components/Alert";
import Push from "../../components/Push";

//	Importing api to communicate to backend
import api from "../../services/api";

//	Exporting resource to routes.js
export default function Coupons({ userId }) {
	//	Coupon state variables
	const couponTypes = ["qty", "private", "value", "freight"];
	const couponTypesptbr = ["quantidade", "privado", "valor", "frete"];
	const [coupons, setCoupons] = useState([]);
	const [coupon, setCoupon] = useState([]);
	const [couponsByType, setCouponsByType] = useState({});
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
	const [isLoading, setLoading] = useState(true);

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

	//	Loading coupons list by type
	useEffect(() => {
		async function fetchData() {
			api.get("couponAll", {
				headers: {
					"x-access-token": userId
				}})
				.then((response) => {
					var cpnsByType = {};

					for(var type of couponTypes) {
						var cpns = [];

						for(var cpn of response.data) {
							if(cpn.type === type) {
								cpns.push(cpn);
							}
						}

						cpnsByType[type] = cpns;
					}

					setCouponsByType(cpnsByType);
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

			setLoading(false);
		}

		fetchData();
	});

	//	Return a list of coupons given type
	async function handleCouponsList(event, type) {
		event.preventDefault();

		setCoupons(couponsByType[type]);
	}

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

	const header = (
		<Card.Header className="pb-3">
			<Nav fill variant="tabs">
				{couponTypesptbr.map((type, index) => (
					type && type.length ?
						<Nav.Item key={index}>
							<Nav.Link
								className="btn-outline-warning rounded"
								href={"#" + index}
								onClick={e => handleCouponsList(e, couponTypes[index])}>
								{type[0].toUpperCase() + type.slice(1)}
							</Nav.Link>
						</Nav.Item>
						:
						null
				))}
				<Nav.Item>
					<Nav.Link
						className="btn-outline-warning rounded"
						onClick={null}>
						Adicionar novo cupom
					</Nav.Link>
				</Nav.Item>
			</Nav>
		</Card.Header>
	);

	const couponCard = (couponI) => (
		<Card text="white" bg="dark">
			<Card.Header>
				{couponI && couponI.name ? couponI.name : null}
			</Card.Header>
			<Card.Body>
				<Card.Text>
					{couponI && couponI.qty ? "Quantidade: " + couponI.qty : "Quantidade: Não atribuído"}
				</Card.Text>
				<Card.Text>
					{couponI && couponI.discount ?
						"Desconto:" + (couponI.method === "cash" ? "R$" + couponI.discount : couponI.discount + "%")
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
	);

	return (
		<Container className="product-container w-100">
			<Card className="px-3" text="light" bg="dark">
				{header}
				{isLoading ?
					<Spinner
						className="my-5 mx-auto"
						style={{width: "5rem", height: "5rem"}}
						animation="grow"
						variant="warning"
					/>
					:
					coupons && coupons.length ?
						<CardDeck className="p-2">
							{Array(coupons.length).fill(null).map((value, i) => (
								i%3 === 0 ?
									<Row className="d-flex justify-content-around m-auto w-100" key={i/3}>
										{Array(3).fill(null).map((value, j) => (
											i+j < coupons.length ? couponCard(coupons[i+j]) : null
										))}
									</Row>
									:
									null
							))}
						</CardDeck>
						:
						<h1 className="display-5 text-center m-auto p-5">Selecione o tipo de cupom acima</h1>
				}
			</Card>

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
		</Container>
	);
}

Coupons.propTypes = {
	userId : PropTypes.string
};