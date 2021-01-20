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
export default function Coupons({ userId, companyInfo }) {
	//	Coupon state variables
	const couponTypes = ["quantidade", "valor", "frete"];
	const couponMethods = ["dinheiro", "porcentagem"];
	const [coupons, setCoupons] = useState([]);
	const [coupon, setCoupon] = useState(null);
	const [couponsByType, setCouponsByType] = useState({});
	const [couponId, setCouponId] = useState("");
	const [couponUserId, setCouponUserId] = useState("");
	const [couponName, setCouponName] = useState("");
	const [couponType, setCouponType] = useState("");
	const [couponQty, setCouponQty] = useState("");
	const [couponMethod, setCouponMethod] = useState("");
	const [couponDiscount, setCouponDiscount] = useState(null);
	const [couponMinValue, setCouponMinValue] = useState(null);
	const [couponAvailable, setCouponAvailable] = useState(false);
	const [couponPrivate, setCouponPrivate] = useState(false);

	//	Users state variables
	const [users, setUsers] = useState([]);

	//	Modal state variables
	const [modalAlert, setModalAlert] = useState(false);
	const [modalCouponAdd, setModalCouponAdd] = useState(false);
	const [modalCouponUpdate, setModalCouponUpdate] = useState(false);
	const [modalCouponDelete, setModalCouponDelete] = useState(false);

	//	Message settings
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [toastShow, setToastShow] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	//	Update coupon state variables
	useEffect(() => {
		setCouponUserId(coupon && coupon.private && coupon.userId && users ?
			users.find(u => u._id === coupon.userId).email
			:
			users && users[0] ?
				users[0].email
				:
				""
		);
		setCouponId(coupon ? coupon._id : "");
		setCouponName(coupon ? coupon.name : "");
		setCouponType(coupon ? coupon.type : couponTypes[0]);
		setCouponQty(coupon ? coupon.qty : null);
		setCouponMethod(coupon ? coupon.method : couponMethods[0]);
		setCouponDiscount(coupon ? coupon.discount : null);
		setCouponMinValue(coupon ? coupon.minValue : null);
		setCouponAvailable(coupon ? coupon.available : false);
		setCouponPrivate(coupon ? coupon.private : false);
	}, [modalCouponAdd, modalCouponUpdate]);

	//	Loading coupons list by type and all users
	useEffect(() => {
		async function fetchData() {
			await api.get("couponAll", {
				headers: {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
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
				}
			});

			await api.get("userAll", {
				headers: {
					"x-access-token": userId
				}
			}).then((response) => {
				if(response.status === 200) {
					setUsers(response.data);
				}
			});

			setIsLoading(false);
		}

		fetchData();
	}, []);

	//	Return a list of coupons given type
	async function handleCouponsList(event, type) {
		event.preventDefault();

		setCoupons(couponsByType[type]);
	}

	//	Function to create a new coupon
	async function handleCouponAdd(event) {
		event.preventDefault();

		const data = {
			name: couponName,
			type: couponType,
			qty: couponQty,
			method: couponMethod,
			discount: couponDiscount,
			minValue: couponMinValue,
			private: couponPrivate,
			userId: couponPrivate ? users.find(u => u.email === couponUserId)._id : null
		};

		await api.post("coupon", data, {
			headers : {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 201) {
				setModalCouponAdd(false);
				setTitle("Alterações de cupom");
				setMessage(response.data);
				setModalAlert(true);
			}
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

	//	Function to update coupons
	async function handleCouponUpdate(event) {
		event.preventDefault();

		const data = {
			name: couponName,
			type: couponType,
			qty: couponQty,
			method: couponMethod,
			discount: couponDiscount,
			minValue: couponMinValue,
			available: couponAvailable,
			private: couponPrivate,
			userId: couponPrivate ? users.find(u => u.email === couponUserId)._id : null
		};

		await api.put("coupon/" + coupon._id, data, {
			headers : {
				"x-access-token": userId
			}
		}).then(() => {
			setModalCouponUpdate(false);
			setTitle("Alterações de cupom");
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

	//	Function to delete coupons
	async function handleCouponDelete(event) {
		event.preventDefault();

		await api.delete("coupon/" + couponId, {
			headers : {
				"x-access-token": userId
			}
		}).then(() => {
			setModalCouponDelete(false);
			setTitle("Alterações de cupom");
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

	const header = (
		<Card.Header className="pb-3">
			<Nav fill variant="tabs">
				{couponTypes.map((type, index) => (
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
						onClick={() => setModalCouponAdd(true)}
					>
						Adicionar novo cupom
					</Nav.Link>
				</Nav.Item>
			</Nav>
		</Card.Header>
	);

	const couponCard = (couponI) => (
		couponI ?
			<Card as={Col} className="p-0 m-2" text="white" bg="secondary" sm="4">
				<Card.Header>
					{couponI.name ? couponI.name : null}
				</Card.Header>
				<Card.Body>
					{couponI.discount ?
						<Card.Text>
							{"Desconto: " + (couponI.method === "dinheiro" ? "R$ " + couponI.discount : couponI.discount + "%")}
						</Card.Text>
						:
						null
					}
					{couponI.minValue ?
						<Card.Text>
							{"Valor mínimo para o desconto: R$ " + couponI.minValue}
						</Card.Text>
						:
						null
					}
					{!couponI.private ?
						<Card.Text>
							{"Quantidade: " + (couponI.qty ?  couponI.qty : "Não atribuído")}
						</Card.Text>
						:
						null
					}
					<Card.Text>
						{"Cupom: " + (couponI.private ? "privado" : "público")}
					</Card.Text>
					<div className="d-flex justify-content-around flex-wrap my-auto">
						<Button
							className="my-1"
							variant="warning"
							size="sm"
							onClick ={() => { setCoupon(couponI); setModalCouponUpdate(true); } }
						>
							Modificar
						</Button>

						{couponI.available ?
							<Button
								className="my-1"
								variant="light"
								size="sm"
								id="btn-custom"
							>
								Disponível
							</Button>
							:
							<Button
								className="my-1"
								variant="light"
								size="sm"
								id="btn-custom-outline"
							>
								Indisponível
							</Button>
						}
						<Button
							className="my-1"
							variant="danger"
							size="sm"
							onClick={() => {
								setCouponId(couponI._id);
								setCouponName(couponI.name);
								setModalCouponDelete(true);
							}}
						>
							Remover
						</Button>
					</div>
				</Card.Body>
			</Card>
			:
			null
	);

	const couponFormBody = (
		<>
			<Row>
				<Form.Group as={Col} controlId="couponName" sm>
					<Form.Label>Nome</Form.Label>
					<Form.Control
						value={couponName}
						onChange={e => setCouponName(e.target.value)}
						type="text"
						placeholder="Nome do cupom"
						required
					/>
				</Form.Group>
				<Form.Group as={Col} controlId="couponType" sm>
					<Form.Label>Tipo</Form.Label>
					<Form.Control
						value={couponType}
						onChange={e =>  {
							setCouponType(e.target.value);
							setCouponMethod(e.target.value === "frete" ? "dinheiro" : couponMethod);
							setCouponDiscount(e.target.value === "frete" ? companyInfo.freight : couponDiscount);
							setCouponPrivate(e.target.value === "quantidade" ? false : couponPrivate);
						}}
						as="select"
						placeholder="Tipo do cupom"
						required
					>
						<option selected disabled>Selecione o tipo do cupom</option>
						{couponTypes.map((type, index) => (
							<option key={index}>{type}</option>
						))}
					</Form.Control>
				</Form.Group>
			</Row>
			<Row>
				<Form.Group as={Col} controlId="couponMethod" sm>
					<Form.Label>Método</Form.Label>
					<Form.Control
						value={couponType === "frete" ? "dinheiro" : couponMethod}
						onChange={e => setCouponMethod(e.target.value)}
						as="select"
						placeholder="Método do cupom"
						required
						disabled={couponType === "frete"}
					>
						<option selected disabled>Selecione o método de desconto</option>
						{couponMethods.map((method, index) => (
							<option key={index}>{method}</option>
						))}
					</Form.Control>
				</Form.Group>
				<Form.Group as={Col} controlId="couponDiscount" sm>
					<Form.Label>
						{"Desconto " + (couponMethod === "porcentagem" ? "(em porcentagem %)" : "(em reais R$)")}
					</Form.Label>
					<Form.Control
						value={couponType === "frete" ? companyInfo.freight : couponDiscount}
						onChange={e => setCouponDiscount(e.target.value)}
						type="number"
						placeholder="Desconto"
						required
						disabled={couponType === "frete"}
					/>
				</Form.Group>
			</Row>
			<Row>
				<Form.Group as={Col} controlId="couponQty" sm>
					<Form.Label>Quantidade</Form.Label>
					<Form.Control
						value={couponQty}
						onChange={e => setCouponQty(e.target.value)}
						type="number"
						placeholder="Quantidade"
						required={!couponPrivate}
						disabled={couponPrivate}
					/>
				</Form.Group>
				<Form.Group as={Col} controlId="couponMinValue" sm>
					<Form.Label>Valor mínimo (em reais R$)</Form.Label>
					<Form.Control
						value={couponMinValue}
						onChange={e => setCouponMinValue(e.target.value)}
						type="number"
						placeholder="Valor mínimo"
						required={couponType === "valor"}
						disabled={couponType !== "valor"}
					/>
				</Form.Group>
			</Row>
			<Row>
				<Form.Group as={Col} controlId="type" sm>
					<Form.Label>Cupom privado?</Form.Label>
					<Form.Check
						type={"checkbox"}
						checked={couponPrivate ? couponPrivate : false}
						className="my-2"
						onChange={e => setCouponPrivate(e.target.checked !== undefined ? e.target.checked : couponPrivate)}
						label={couponPrivate ? "Privado" : "Público"}
						disabled={couponType === "quantidade"}
					/>
				</Form.Group>
				<Form.Group as={Col} className={modalCouponAdd ? "d-none" : null} controlId="couponAvailable" sm>
					<Form.Label>Disponibilizar cupom?</Form.Label>
					<Form.Check
						type={"checkbox"}
						checked={couponAvailable ? couponAvailable : false}
						className="my-2"
						onChange={e => setCouponAvailable(e.target.checked)}
						label={couponAvailable ? "Disponibilizar" : "Não disponibilizar"}
					/>
				</Form.Group>
			</Row>
			<Row>
				<Form.Group as={Col} controlId="couponUserId" sm>
					<Form.Label>Usuário que receberá o cupom</Form.Label>
					<Form.Control
						value={couponUserId}
						onChange={e => setCouponUserId(e.target.value)}
						as="select"
						placeholder="Usuário que receberá o cupom"
						required={couponPrivate}
						disabled={!couponPrivate}
					>
						<option selected disabled>Selecione o email do usuário</option>
						{users.map((user, index) => (
							<option key={index}>{user.email}</option>
						))}
					</Form.Control>
				</Form.Group>
			</Row>
		</>
	);

	return (
		<Container className="w-100">
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
				show={modalCouponAdd}
				onHide={() => { setCoupon(null); setModalCouponAdd(false); setToastShow(false);} }
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Adicionar cupom</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCouponAdd}>
						{couponFormBody}
						<Modal.Footer>
							<Button
								variant="danger"
								onClick={() => {
									setCoupon(null);
									setModalCouponAdd(false);
									setToastShow(false);
								}}
							>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal
				show={modalCouponUpdate}
				onHide={() => { setCoupon(null); setModalCouponUpdate(false); setToastShow(false);} }
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
					<Form onSubmit={handleCouponUpdate}>
						{couponFormBody}
						<Modal.Footer>
							<Button variant="danger" onClick={() => { setCoupon(null); setModalCouponUpdate(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={modalCouponDelete} onHide={() => { setModalCouponDelete(false); setToastShow(false); }}>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>{"Remover cupom " + couponName}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Você tem certeza que deseja remover este cupom?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => { setModalCouponDelete(false); setToastShow(false); }}>
						Voltar
					</Button>
					<Button variant="danger" onClick={handleCouponDelete}>
						Remover
					</Button>
				</Modal.Footer>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message}/>
		</Container>
	);
}

Coupons.propTypes = {
	userId : PropTypes.string,
	companyInfo : PropTypes.object
};