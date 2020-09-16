//	Importing React main module and its features
import React, { useState, useMemo } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import { Card, Image, Button, Form, Col, Row, Modal, Toast } from "react-bootstrap";

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
	const [userAddress, setUserAddress] = useState(user.address ? user.address.join(", ") : null);
	const [userPasswordO, setUserPasswordO] = useState("");
	const [userPasswordN, setUserPasswordN] = useState("");
	const [userPasswordOnDelete, setUserPasswordOnDelete] = useState("");
	const [thumbnail, setThumbnail] = useState(null);

	//	Company variable
	const [companyName, setCompanyName] = useState(companyInfo.name);
	const [companyEmail, setCompanyEmail] = useState(companyInfo.email);
	const [companyPhone, setCompanyPhone] = useState(companyInfo.phone);
	const [companyAddress, setCompanyAddress] = useState(companyInfo.address);
	const [companyFreight, setCompanyFreight] = useState(companyInfo.freight);
	const [companyProductTypes, setCompanyProductTypes] = useState(companyInfo.productTypes.join(", "));

	//	Message settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modal2Show, setModal2Show] = useState(false);
	const [modal3Show, setModal3Show] = useState(false);
	const [modal4Show, setModal4Show] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");

	//	Defining history to jump through pages
	const history = useHistory();

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
	async function handleUserUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", userName);
		data.append("email", userEmail);
		data.append("phone", userPhone);
		data.append("address", userAddress);

		if(thumbnail){
			data.append("thumbnail", thumbnail);
		} else {
			if(user.thumbnail) {
				const blob = await fetch(user.thumbnail_url).then(r => r.blob());
				const token = user.thumbnail_url.split(".");
				const extension = token[token.length-1];
				setThumbnail(new File([blob], "thumbnail." + extension));
				data.append("thumbnail", new File([blob], "thumbnail." + extension));
			}
		}

		await api.put("user", data , {
			headers : {
				authorization: userId
			}})
			.then(() => {
				setTitle("Alterações usuário");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModal1Show(false);
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	//	Function to handle delete image profile
	async function handleThumbnailDelete(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", userName);
		data.append("email", userEmail);
		data.append("phone", userPhone);
		data.append("address", userAddress);
		data.append("thumbnail", thumbnail);

		await api.put("user", data , {
			headers : {
				authorization: userId
			}})
			.then(() => {
				setTitle("Alterações usuário");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModal3Show(false);
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	async function handlePasswordUpdate(event) {
		event.preventDefault();

		if(userPasswordO && userPasswordO.length && userPasswordN && userPasswordN.length) {
			const data = new FormData();

			data.append("name", userName);
			data.append("email", userEmail);
			data.append("phone", userPhone);
			data.append("address", userAddress);
			data.append("passwordN", userPasswordN);
			data.append("passwordO", userPasswordO);

			await api.put("user" , data,  {
				headers : {
					authorization: userId
				}})
				.then(() => {
					setTitle("Alteração senha");
					setMessage("Alteração feita com sucesso!");
					setColor("warning");
					setModal2Show(false);
					setModalAlert(true);
				}).catch((error) => {
					setTitle("Erro!");
					setColor("danger");
					if(error.response) {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});
		} else {
			setTitle("Alteração senha");
			setMessage("Atençao! Sua senha atual ou senha nova está vazia!");
			setColor("warning");
			setToastShow(true);
		}

		setUserPasswordO("");
		setUserPasswordN("");
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

				setTitle("Alteração usuário");
				setMessage(response.data);
				setColor("warning");
				setToastShow(true);
				history.push("/");
			}).catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
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
				setTitle("Alterações da empresa");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModal4Show(false);
				setModalAlert(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setModalAlert(true);
			});
	}

	async function handleModal(event, modal, user = null) {
		event.preventDefault();

		if(user) {
			setUserName(user.name);
			setUserEmail(user.email);
			setUserPhone(user.phone);
			setUserAddress(user.address ? user.address.join(", ") : null);
		}

		setCompanyName(companyInfo.name);
		setCompanyEmail(companyInfo.email);
		setCompanyAddress(companyInfo.address);
		setCompanyFreight(companyInfo.freight);
		setCompanyProductTypes(companyInfo.productTypes.join(", "));

		switch(modal){
		case 1:
			setModal1Show(true);
			break;
		case 2:
			setModal2Show(true);
			break;
		case 3:
			setModal3Show(true);
			break;
		case 4:
			setModal4Show(true);
			break;
		default:
			break;
		}
	}

	const toast = (
		<div
			aria-live="polite"
			aria-atomic="true"
			style={{
				position: "fixed",
				top: "inherit",
				right: "3%"
			}}
		>
			<Toast show={toastShow} onClose={() => setToastShow(false)} delay={3000} autohide>
				<Toast.Header>
					<strong className="mr-auto">{title}</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>
	);

	return (
		<div className="user-container h-100">
			<div className="d-flex flex-row flex-wrap h-100">
				<div className="col-sm-4 m-auto p-3">
					<Form className="d-flex flex-column" onSubmit={handleUserUpdate}>
						<Form.Control
							id="inputImage"
							className="d-none"
							type="file"
							onChange={event => setThumbnail(event.target.files[0])}
							required
						/>
						<Image
							id="thumbnail"
							className={user.thumbnail || preview ? "border-0 m-auto" : "w-100 m-auto"}
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
									onClick={handleThumbnailDelete}
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
				</div>
				<div id="user-i" className="col-sm-4 p-3">
					<Card bg="dark">
						<Card.Header >{user.name}</Card.Header>
						<Card.Body>
							<Card.Text>{user.email}</Card.Text>
							<Card.Text>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</Card.Text>
							<Card.Text>{user.address && user.address.length ? user.address.join(", ") : "Endereço:" }</Card.Text>
						</Card.Body>
					</Card>
					<Row className="d-flex justify-content-around flex-row flex-wrap my-2">
						<Button
							variant="outline-warning"
							onClick={event => handleModal(event, 1, user)}
						>
							Editar perfil
						</Button>
						<Button
							onClick ={event => handleModal(event, 2, user)}
							className="btn"
							id="btn-password"
						>
							Trocar senha
						</Button>
						{user.userType === 2 ?
							<Button
								onClick = {event => handleModal(event, 4)}
								variant="outline-warning"
							>
								Info da empresa
							</Button>
							:
							<Button
								onClick = {event => handleModal(event, 3, user)}
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
								<button
									onClick={() => history.push("/allusers")}
									className="btn"
									id="btn-password"
								>
									Listar todos usuários
								</button>
								:
								null
							}
						</Row>
						:
						null
					}
				</div>
			</div>

			<Modal show={modal1Show} onHide={() => {setModal1Show(false); setToastShow(false);}} size="lg" centered>
				{toast}
				<Modal.Header closeButton>
					<Modal.Title>Modificar usuário</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleUserUpdate}>
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
										type="text"
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
										type="text"
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
										pattern="^[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+,\s?[0-9]+,\s?[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+(,\s?[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+)?$"
										placeholder="Rua, Número, Bairro, Complemento (opcional)"
									/>
									<Form.Text className="text-muted">
										Separe rua, número, bairro e complemento por vírgula
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setModal1Show(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={modal2Show} onHide={() => {setModal2Show(false); setToastShow(false);}} size="lg" centered>
				{toast}
				<Modal.Header closeButton>
					<Modal.Title>Modificar senha</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handlePasswordUpdate}>
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
							<Button variant="danger" onClick={() => {setModal2Show(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={modal3Show} onHide={() => {setModal3Show(false); setToastShow(false);}} size="md" centered>
				{toast}
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
					<Button variant="warning" onClick={() => {setModal3Show(false); setToastShow(false);}}>
						Cancelar
					</Button>
					<Button variant="danger" type="submit" onClick={handleUserDelete}>
						Apagar Perfil
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modal4Show} onHide={() => {setModal4Show(false); setToastShow(false);}} size="lg" centered>
				{toast}
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
										type="text"
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
										pattern="^[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+,\s?[0-9]+,\s?[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+(,\s?[a-zA-Z0-9\s\-.^~`´'\u00C0-\u024F\u1E00-\u1EFF]+)?$"
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
							<Button variant="danger" onClick={() => {setModal4Show(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={modalAlert} onHide={() => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant={color} onClick={() => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}