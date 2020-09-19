//	Importing React main module and its features
import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import { Card, Image, Button, Form, Col, Row, Modal } from "react-bootstrap";

//	Importing website utils
import Alert from "../Website/Alert";
import Push from "../Website/Push";

// Importing backend api
import api from "../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function User({ userId, setUserId, user, setUser, companyInfo }) {
	//	User variables
	const [userName, setUserName] = useState(user.name);
	const [userEmail, setUserEmail] = useState(user.email);
	const [userPhone, setUserPhone] = useState(user.phone);
	const [userAddress, setUserAddress] = useState(user.address ? user.address.join(", ") : "");
	const [userPasswordO, setUserPasswordO] = useState("");
	const [userPasswordN, setUserPasswordN] = useState("");
	const [userPasswordOnDelete, setUserPasswordOnDelete] = useState("");
	const [thumbnail, setThumbnail] = useState(null);

	//	Company variable
	const [companyName, setCompanyName] = useState("");
	const [companyEmail, setCompanyEmail] = useState("");
	const [companyPhone, setCompanyPhone] = useState("");
	const [companyAddress, setCompanyAddress] = useState("");
	const [companyFreight, setCompanyFreight] = useState("");
	const [companyProductTypes, setCompanyProductTypes] = useState("");

	//	Message settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modal2Show, setModal2Show] = useState(false);
	const [modal3Show, setModal3Show] = useState(false);
	const [modal4Show, setModal4Show] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [modalAlertThumbnail, setModalAlertThumbnail] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	//	Defining history to jump through pages
	const history = useHistory();

	//	Update user state variables
	useEffect(() => {
		setUserName(user.name);
		setUserEmail(user.email);
		setUserPhone(user.phone ? user.phone : "");
		setUserAddress(user.address ? user.address.join(", ") : "");
	}, [modal1Show, modal2Show]);

	//	Update company state variables
	useEffect(() => {
		setCompanyName(companyInfo.name);
		setCompanyEmail(companyInfo.email);
		setCompanyAddress(companyInfo.address);
		setCompanyFreight(companyInfo.freight);
		setCompanyProductTypes(companyInfo.productTypes.join(", "));
	}, [modal4Show]);

	//	User image preview
	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail): null;
	}, [thumbnail]);

	//	Function to handle input image profile
	async function inputImage(event) {
		event.preventDefault();

		document.getElementById("inputImage").click();
	}

	//	Function to handle update user
	async function handleUserUpdate(event, action = null) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", userName);
		data.append("email", userEmail);
		data.append("phone", userPhone && userPhone.length ? userPhone : "");
		data.append("address", userAddress && userAddress.length ? userAddress : "");

		if(action === 0) {
			if(thumbnail) {
				data.append("thumbnail", thumbnail);
			} else {
				if(user.thumbnail) {
					const blob = await fetch(user.thumbnail_url).then(r => r.blob());
					const token = user.thumbnail_url.split(".");
					const extension = token[token.length-1];
					data.append("thumbnail", new File([blob], "thumbnail." + extension));
				}
			}
		} else if(action === 1) {
			data.append("passwordN", userPasswordN);
			data.append("passwordO", userPasswordO);

			setUserPasswordO("");
			setUserPasswordN("");
		}

		await api.put("user", data , {
			headers : {
				authorization: userId
			}})
			.then(() => {
				setModal1Show(false);
				setModal2Show(false);
				setTitle("Alterações de usuário");
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
				if(!action) {
					setModalAlertThumbnail(true);
				} else {
					setToastShow(true);
				}
			});
	}

	async function handleUserDelete(event) {
		event.preventDefault();

		await api.delete("user", {
			headers: {
				authorization: userId,
				password: userPasswordOnDelete
			}})
			.then((response) => {
				sessionStorage.removeItem("userId");

				setUserId(sessionStorage.getItem("userId"));
				setUser({});

				setTitle("Alterações de usuário");
				setMessage(response.data);
				setToastShow(true);
				history.push("/");
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});

		setUserPasswordOnDelete("");
	}

	//	Function to handle update company info
	async function handleCompanyUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", companyName);
		data.append("email", companyEmail);
		data.append("address", companyAddress);
		data.append("phone", companyPhone);
		data.append("freight", companyFreight);
		data.append("productTypes", companyProductTypes);

		await api.post("company", data , {
			headers : {
				authorization: userId
			}})
			.then(() => {
				setModal4Show(false);
				setTitle("Alterações da empresa");
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
		<div className="user-container h-100">
			<div className="d-flex flex-row flex-wrap h-100">
				<Col className="m-auto p-3" sm="4">
					<Form className="d-flex flex-column" onSubmit={(e) => handleUserUpdate(e, 0)}>
						<Form.Control
							id="inputImage"
							className="d-none"
							type="file"
							onChange={event => setThumbnail(event.target.files[0])}
							required
						/>
						<Image
							id="thumbnail"
							className={user.thumbnail || preview ? "btn border-0 m-auto" : "btn w-100 m-auto"}
							src={preview ? preview : (user.thumbnail ? user.thumbnail_url : camera)}
							alt="Selecione sua imagem"
							onClick={inputImage}
							rounded
							fluid
						/>
						{user.thumbnail ?
							<div className="d-flex justify-content-center flex-wrap my-auto">
								<Button
									className="my-1 mx-2"
									type="submit"
									variant="outline-warning"
								>
									Trocar foto
								</Button>
								<Button
									className="my-1 mx-2"
									onClick={handleUserUpdate}
									variant="outline-danger"
								>
									Apagar foto
								</Button>
							</div>
							:
							<div className="d-flex">
								<Button
									className="my-3 mx-auto"
									type="submit"
									variant="outline-warning"
								>
									Adicionar foto
								</Button>
							</div>
						}
					</Form>
				</Col>
				<Col className="m-auto p-3" sm="4">
					<Card text="light" bg="dark">
						<Card.Header >{user.name}</Card.Header>
						<Card.Body>
							<Card.Text>{"Email: " + user.email}</Card.Text>
						</Card.Body>
						<Card.Body>
							<Card.Text>{"Telefone: " + (user.phone ? user.phone: "Não informado")}</Card.Text>
						</Card.Body>
						<Card.Body>
							<Card.Text>{"Endereço: " + ((user.address && user.address.length) ? user.address.join(", ") : "Não informado")}</Card.Text>
						</Card.Body>
					</Card>
					<Row className="d-flex justify-content-around flex-row flex-wrap my-2">
						<Button
							variant="outline-warning"
							onClick={() => setModal1Show(true)}
						>
							Editar perfil
						</Button>
						<Button
							onClick ={() => setModal2Show(true)}
							className="btn"
							id="btn-password"
						>
							Trocar senha
						</Button>
						{user.userType === 2 ?
							<Button
								onClick = {() => setModal4Show(true)}
								variant="outline-warning"
							>
								Info da empresa
							</Button>
							:
							<Button
								onClick = {() => setModal3Show(true)}
								variant="outline-danger"
							>
								Apagar perfil
							</Button>
						}
					</Row>
					{user.userType === 1 || user.userType === 2 ?
						<Row className="d-flex justify-content-around flex-row flex-wrap my-2">
							<Button
								onClick={() => history.push("/allorders")}
								className="btn"
								id="btn-password"
							>
								Listar todos pedidos
							</Button>
							{user.userType === 2 ?
								<Button
									onClick={() => history.push("/allusers")}
									id="btn-password"
								>
									Listar todos usuários
								</Button>
								:
								null
							}
						</Row>
						:
						null
					}
				</Col>
			</div>

			<Modal
				show={modal1Show}
				onHide={() => { setModal1Show(false); setToastShow(false); }}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar usuário</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={(e) => handleUserUpdate(e, 0)}>
						<Row>
							<Col sm>
								<Form.Group controlId="userName">
									<Form.Label>Nome</Form.Label>
									<Form.Control
										value={userName}
										onChange={e => setUserName(e.target.value)}
										type="text"
										placeholder="Nome de usuário"
										required
									/>
								</Form.Group>
							</Col>
							<Col sm>
								<Form.Group controlId="userEmail">
									<Form.Label>Email</Form.Label>
									<Form.Control
										value={userEmail}
										onChange={e => setUserEmail(e.target.value)}
										type="email"
										placeholder="Seu email"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm>
								<Form.Group controlId="userPhone">
									<Form.Label>Telefone</Form.Label>
									<Form.Control
										value={userPhone}
										onChange={e => setUserPhone(e.target.value)}
										type="tel"
										pattern="^\(?[0-9]{2}\)?\s?[0-9]?\s?[0-9]{4}-?[0-9]{4}$"
										placeholder="(__) _ ____-____"
									/>
								</Form.Group>
							</Col>
							<Col sm>
								<Form.Group controlId="userAddress">
									<Form.Label>Endereço</Form.Label>
									<Form.Control
										value={userAddress}
										onChange={e => setUserAddress(e.target.value)}
										type="text"
										pattern="^([^\s,]+(\s[^\s,]+)*),\s?([0-9]+),\s?([^\s,]+(\s[^\s,]+)*)(,\s?[^\s,]+(\s[^\s,]+)*)?$"
										placeholder="Rua, Número, Bairro, Complemento (opcional)"
									/>
									<Form.Text className="text-muted">
										Separe rua, número, bairro e complemento por vírgula
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => { setModal1Show(false); setToastShow(false); }}>
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
				show={modal2Show}
				onHide={() => {setModal2Show(false); setToastShow(false);}}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar senha</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={(e) => handleUserUpdate(e, 1)}>
						<Row>
							<Col sm>
								<Form.Group controlId="userPasswordO">
									<Form.Label>Senha atual</Form.Label>
									<Form.Control
										value={userPasswordO}
										onChange={e => setUserPasswordO(e.target.value)}
										type="password"
										pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
										placeholder="Senha atual"
										required
									/>
									<Form.Text className="text-muted">
										Sua nova senha deve ter no mínimo oito caracteres, pelo menos uma letra e um número
									</Form.Text>
								</Form.Group>
							</Col>
							<Col sm>
								<Form.Group controlId="userPasswordN">
									<Form.Label>Senha nova</Form.Label>
									<Form.Control
										value={userPasswordN}
										onChange={e => setUserPasswordN(e.target.value)}
										type="password"
										pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
										placeholder="Senha nova"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => { setModal2Show(false); setToastShow(false); }}>
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
				show={modal3Show}
				onHide={() => { setModal3Show(false); setToastShow(false); }}
				size="md"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Apagar perfil</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Tem certeza que deseja excluir seu perfil? :/
					<Form className="my-3" onSubmit={handleUserDelete}>
						<Form.Group controlId="passwordOnDelete">
							<Form.Label>Confirme sua senha para prosseguir</Form.Label>
							<Form.Control
								placeholder="Senha"
								type="password"
								value={userPasswordOnDelete}
								onChange={event => setUserPasswordOnDelete(event.target.value)}
								required
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => { setModal3Show(false); setToastShow(false); }}>
						Cancelar
					</Button>
					<Button variant="danger" type="submit" onClick={handleUserDelete}>
						Apagar Perfil
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={modal4Show}
				onHide={() => { setModal4Show(false); setToastShow(false); }}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar informações da empresa</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCompanyUpdate}>
						<Row>
							<Col>
								<Form.Group controlId="companyName">
									<Form.Label>Nome</Form.Label>
									<Form.Control
										value={companyName}
										onChange={e => setCompanyName(e.target.value)}
										type="text"
										placeholder="Nome da empresa"
										required
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId="companyEmail">
									<Form.Label>Email</Form.Label>
									<Form.Control
										value={companyEmail}
										onChange={e => setCompanyEmail(e.target.value)}
										type="email"
										placeholder="Email da empresa"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group controlId="companyPhone">
									<Form.Label>Telefone</Form.Label>
									<Form.Control
										value={companyPhone}
										onChange={e => setCompanyPhone(e.target.value)}
										type="text"
										pattern="^\(?[0-9]{2}\)?\s?[0-9]?\s?[0-9]{4}-?[0-9]{4}$"
										placeholder="(__) _ ____-____"
										required
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId="companyAddress">
									<Form.Label>Endereço</Form.Label>
									<Form.Control
										value={companyAddress}
										onChange={e => setCompanyAddress(e.target.value)}
										type="text"
										pattern="^([^\s,]+(\s[^\s,]+)*),\s?([0-9]+),\s?([^\s,]+(\s[^\s,]+)*)(,\s?[^\s,]+(\s[^\s,]+)*)?$"
										placeholder="Rua, Número, Bairro, Cidade"
									/>
									<Form.Text className="text-muted">
										Separe rua, número, bairro e cidade por vírgula
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group controlId="companyFreight">
									<Form.Label>Valor do frete</Form.Label>
									<Form.Control
										value={companyFreight}
										onChange={e => setCompanyFreight(e.target.value)}
										type="text"
										placeholder="Valor do frete"
										required
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId="companyProductTypes">
									<Form.Label>Tipos de produtos</Form.Label>
									<Form.Control
										value={companyProductTypes}
										onChange={e => setCompanyProductTypes(e.target.value)}
										type="text"
										placeholder="Tipos de produtos"
										required
									/>
									<Form.Text className="text-muted">
										Separe os tipos por vírgula
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => { setModal4Show(false); setToastShow(false); }}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
			<Alert.Close
				modalAlert={modalAlertThumbnail}
				setModalAlert={setModalAlertThumbnail}
				title={title}
				message={message}
			/>
		</div>
	);
}

User.propTypes = {
	userId : PropTypes.string.isRequired,
	setUserId : PropTypes.any.isRequired,
	user : PropTypes.object.isRequired,
	setUser : PropTypes.any.isRequired,
	companyInfo : PropTypes.object.isRequired
};