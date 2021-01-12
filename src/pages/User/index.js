//	Importing React main module and its features
import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import { Card, Image, Button, Form, Col, Row, Modal, ProgressBar } from "react-bootstrap";

//	Importing website utils
import Alert from "../../components/Alert";
import Push from "../../components/Push";

// Importing backend api
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function User({ userId, setUserId, user, setUser, companyInfo, noCards}) {
	//	User variables
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPhone, setUserPhone] = useState("");
	const [userAddress, setUserAddress] = useState("");
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
	const [logo, setLogo] = useState(null);
	const [c1, setC1] = useState(null);
	const [c2, setC2] = useState(null);
	const [c3, setC3] = useState(null);
	const [companyManual, setCompanyManual] = useState(companyInfo && companyInfo.manual ? companyInfo.manual : false);
	const [companySystemOpenByAdm, setCompanySystemOpenByAdm] = useState(companyInfo && companyInfo.systemOpenByAdm ? companyInfo.systemOpenByAdm : false);
	const [companyTimeWithdrawal, setCompanyTimeWithdrawal] = useState(companyInfo && companyInfo.timeWithdrawal ? companyInfo.timeWithdrawal : null);
	const [companyTimeDeliveryI, setCompanyTimeDeliveryI] = useState(companyInfo ? companyInfo.timeDeliveryI : null);
	const [companyTimeDeliveryF, setCompanyTimeDeliveryF] = useState(companyInfo ? companyInfo.timeDeliveryF: null);

	// Timetable variable
	const [timetableSundayI, setTimetableSundayI] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[0] && companyInfo.timetable[0].beginHour ? companyInfo.timetable[0].beginHour : undefined);
	const [timetableSundayF, setTimetableSundayF] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[0] && companyInfo.timetable[0].endHour ? companyInfo.timetable[0].endHour : undefined);
	const [timetableMondayI, setTimetableMondayI] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[1] && companyInfo.timetable[1].beginHour ? companyInfo.timetable[1].beginHour : undefined);
	const [timetableMondayF, setTimetableMondayF] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[1] && companyInfo.timetable[1].endHour ? companyInfo.timetable[1].endHour : undefined);
	const [timetableTuesdayI, setTimetableTuesdayI] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[2] && companyInfo.timetable[2].beginHour ? companyInfo.timetable[2].beginHour : undefined);
	const [timetableTuesdayF, setTimetableTuesdayF] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[2] && companyInfo.timetable[2].endHour ? companyInfo.timetable[2].endHour : undefined);
	const [timetableWednesdayI, setTimetableWednesdayI] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[3] && companyInfo.timetable[3].beginHour ? companyInfo.timetable[3].beginHour : undefined);
	const [timetableWednesdayF, setTimetableWednesdayF] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[3] && companyInfo.timetable[3].endHour ? companyInfo.timetable[3].endHour : undefined);
	const [timetableThursdayI, setTimetableThursdayI] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[4] && companyInfo.timetable[4].beginHour ? companyInfo.timetable[4].beginHour : undefined);
	const [timetableThursdayF, setTimetableThursdayF] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[4] && companyInfo.timetable[4].endHour ? companyInfo.timetable[4].endHour : undefined);
	const [timetableFridayI, setTimetableFridayI] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[5] && companyInfo.timetable[5].beginHour ? companyInfo.timetable[5].beginHour : undefined);
	const [timetableFridayF, setTimetableFridayF] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[5] && companyInfo.timetable[5].endHour ? companyInfo.timetable[5].endHour : undefined);
	const [timetableSaturdayI, setTimetableSaturdayI] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[6] && companyInfo.timetable[6].beginHour ? companyInfo.timetable[6].beginHour : undefined);
	const [timetableSaturdayF, setTimetableSaturdayF] = useState(companyInfo && companyInfo.timetable && companyInfo.timetable[6] && companyInfo.timetable[6].endHour ? companyInfo.timetable[6].endHour : undefined);

	//	Message settings
	const [modal1Show, setModal1Show] = useState(false);
	const [modal2Show, setModal2Show] = useState(false);
	const [modal3Show, setModal3Show] = useState(false);
	const [modal4Show, setModal4Show] = useState(false);
	const [modalImages, setModalImages] = useState(false);
	const [modalTimetable, setModalTimetable] = useState(false);
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
		setCompanyPhone(companyInfo.phone);
		setCompanyAddress(companyInfo.address);
		setCompanyFreight(companyInfo.freight);
		setCompanyProductTypes(companyInfo.productTypes.join(", "));
	}, [modal4Show, modalImages]);

	//	User image preview
	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail): null;
	}, [thumbnail]);

	//	Company logo preview
	const logoPreview = useMemo(() => {
		return logo ? URL.createObjectURL(logo): null;
	}, [logo]);

	//	Company carousel image 1 preview
	const c1Preview = useMemo(() => {
		return c1 ? URL.createObjectURL(c1): null;
	}, [c1]);

	//	Company carousel image 2 preview
	const c2Preview = useMemo(() => {
		return c2 ? URL.createObjectURL(c2): null;
	}, [c2]);

	//	Company carousel image 3 preview
	const c3Preview = useMemo(() => {
		return c3 ? URL.createObjectURL(c3): null;
	}, [c3]);

	//	Function to handle update user
	async function handleUserUpdate(event, action = null) {
		event.preventDefault();

		var s = [];

		for (var c of user.cards) {
			s.push(c.status);
		}

		var data = {
			name: userName,
			email: userEmail,
			phone: userPhone && userPhone.length ? userPhone : "99999999999",
			address: userAddress && userAddress.length ? userAddress : "Rua, 1, Bairro, Casa",
			status: s,
		};

		if(action === 1) {
			data["passwordN"] = userPasswordN;
			data["passwordO"] = userPasswordO;

			setUserPasswordO("");
			setUserPasswordN("");
		}

		await api.put("user", data , {
			headers : {
				"x-access-token": userId
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

	//	Function to handle update user
	async function handleUserThumbnailUpdate(event, action = null) {
		event.preventDefault();

		const data = new FormData();

		if(action === 0) {
			if(thumbnail) {
				data.append("thumbnail", thumbnail);
			}
		}
		var delImg = false;

		if(action === null) {
			delImg = true;
		}

		data.append("delImg", delImg);

		await api.put("userThumbnail", data , {
			headers : {
				"x-access-token": userId
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
				"x-access-token": userId,
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

		const data = {
			name: companyName,
			email: companyEmail,
			address: companyAddress,
			phone: companyPhone,
			freight: companyFreight,
			productTypes: companyProductTypes,
			manual: companyManual,
			systemOpenByAdm: companySystemOpenByAdm,
			timeDeliveryI: companyTimeDeliveryI,
			timeDeliveryF: companyTimeDeliveryF,
			timeWithdrawal: companyTimeWithdrawal
		};

		var upCard = false;
		var upCompany = false;
		var t = companyInfo.productTypes.join(", ");

		if(companyProductTypes != t) {
			upCard = true;
		}

		await api.put("company", data , {
			headers : {
				"x-access-token": userId
			}
		}).then(() => {
			upCompany = true;
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && typeof(error.response.data) !== "object") {
				setMessage(error.response.data);
			} else {
				setMessage(error.message);
			}
			setToastShow(true);
		});

		if(upCard && upCompany) {
			await api.put("userCard", {}, {
				headers : {
					"x-access-token": userId
				}
			}).then(() => {
				setModal4Show(false);
				setModalImages(false);
				upCard = false;
				upCompany = false;
				setTitle("Alterações da empresa");
				setMessage("Alterações feitas com sucesso!");
				setModalAlert(true);
			}).catch((error) => {
				setTitle("Erro!");
				if(error.response && typeof(error.response.data) !== "object") {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
		} else if(!upCard && upCompany) {
			setModal4Show(false);
			setModalImages(false);
			setTitle("Alterações da empresa");
			setMessage("Alterações feitas com sucesso!");
			setModalAlert(true);
		}
	}

	//	Function to handle update company logo
	async function handleCompanyImageUpdate(event, action = null) {
		event.preventDefault();

		const data = new FormData();

		if(action === "logo") {
			data.append("op", "logo");
			
			if(logo) {
				data.append("image", logo);
			}

		} else if(action === "c1") {
			data.append("op", "c1");

			if(c1) {
				data.append("image", c1);
			}

		} else if(action === "c2") {
			data.append("op", "c2");

			if(c2) {
				data.append("image", c2);
			}

		} else if(action === "c3") {
			data.append("op", "c3");

			if(c3) {
				data.append("image", c3);
			}
		}

		await api.put("companyImages", data , {
			headers : {
				"x-access-token": userId
			}
		}).then(() => {
			setModal4Show(false);
			setModalImages(false);
			setTitle("Alterações da empresa");
			setMessage("Alterações feitas com sucesso!");
			setModalAlert(true);
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && typeof(error.response.data) !== "object") {
				setMessage(error.response.data);
			} else {
				setMessage(error.message);
			}
			setToastShow(true);
		});
	}

	//  Function to change opening hours
	async function handleTimetable(event) {
		event.preventDefault();

		const timetable = [
			{dayWeek: "Domingo", beginHour: timetableSundayI ? timetableSundayI : null,
				endHour: timetableSundayF ? timetableSundayF : null
			},
			{dayWeek: "Segunda", beginHour: timetableMondayI ? timetableMondayI : null,
				endHour: timetableMondayF ? timetableMondayF : null
			},
			{dayWeek: "Terça", beginHour: timetableTuesdayI ? timetableTuesdayI : null,
				endHour: timetableTuesdayF ? timetableTuesdayF : null
			},
			{dayWeek: "Quarta", beginHour: timetableWednesdayI ? timetableWednesdayI : null,
				endHour: timetableWednesdayF ? timetableWednesdayF : null
			},
			{dayWeek: "Quinta", beginHour: timetableThursdayI ? timetableThursdayI : null,
				endHour: timetableThursdayF ? timetableThursdayF : null
			},
			{dayWeek: "Sexta", beginHour: timetableFridayI ? timetableFridayI : null,
				endHour: timetableFridayF ? timetableFridayF : null
			},
			{dayWeek: "Sábado", beginHour: timetableSaturdayI ? timetableSaturdayI : null,
				endHour: timetableSaturdayF ? timetableSaturdayF : null
			}
		];

		await api.put("companyUpdateTimetable", {timetable}, {
			headers : {
				"x-access-token": userId,
			}
		}).then(() => {
			setModalTimetable(false);
			setTitle("Alterações da empresa");
			setMessage("Alterações feitas com sucesso!");
			setModalAlert(true);
		}).catch((error) => {
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
			<div className="d-flex flex-row flex-wrap my-auto">
				<Col className="m-auto p-3" sm="4">
					<Form className="d-flex flex-column" onSubmit={(e) => handleUserThumbnailUpdate(e, 0)}>
						<Form.Control
							id="inputImage"
							className="d-none"
							type="file"
							onChange={event => setThumbnail(event.target.files[0])}
							required
						/>
						<Image
							id={user.thumbnail || preview ? "thumbnail" : "camera"}
							className={user.thumbnail || preview ? "btn border-0 m-auto" : "btn w-100 m-auto"}
							src={preview ? preview : (user.thumbnail ? process.env.REACT_APP_API_URL + user.thumbnail_url : camera)}
							alt="Selecione sua imagem"
							onClick={() => document.getElementById("inputImage").click()}
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
									onClick={handleUserThumbnailUpdate}
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
				<Col className="m-auto p-3" sm="auto">
					<Card text="light" bg="dark">
						<Card.Header >{user.name}</Card.Header>
						<Card.Body>
							<Card.Text>{"Email: " + user.email}</Card.Text>
						</Card.Body>
						<Card.Body>
							<Card.Text>{"Telefone: " + (user.phone ? user.phone: "Não informado")}</Card.Text>
						</Card.Body>
						<Card.Body>
							<Card.Text>
								{"Endereço: " + (
									(user.address && user.address.length) ?
										user.address.join(", ")
										:
										"Não informado"
								)}
							</Card.Text>
							<Row className="d-flex justify-content-around flex-row flex-wrap">
								<Button
									variant="outline-warning"
									className="mx-1 my-2"
									onClick={() => setModal1Show(true)}
								>
									Editar perfil
								</Button>
								<Button
									variant="light"
									onClick ={() => setModal2Show(true)}
									id="btn-custom-outline"
									className="mx-1 my-2"
								>
									Trocar senha
								</Button>
								{user.userType === 2 ?
									<Button
										onClick = {() => setModal4Show(true)}
										variant="outline-warning"
										className="mx-1 my-2"
									>
										Info da empresa
									</Button>
									:
									<Button
										onClick = {() => setModal3Show(true)}
										variant="outline-danger"
										className="mx-1 my-2"
									>
										Apagar perfil
									</Button>
								}
							</Row>
							{user.userType === 1 || user.userType === 2 ?
								<>
									<Row className="d-flex justify-content-around flex-row flex-wrap">
										<Button
											variant="light"
											onClick={() => history.push("/allorders")}
											className="mx-1 my-2"
											id="btn-custom-outline"
										>
											Listar pedidos
										</Button>
										{user.userType === 2 ?
											<>
												<Button
													variant="light"
													className="mx-1 my-2"
													onClick={() => history.push("/allusers")}
													id="btn-custom-outline"
												>
													Listar usuários
												</Button>
												<Button
													className="mx-1 my-2"
													variant="outline-warning"
													onClick={() => setModalImages(true)}
												>
													Editar imagens
												</Button>
											</>
											:
											null
										}
									</Row>
									{user.userType === 2 ?
										<Row className="d-flex justify-content-around flex-row flex-wrap">
											<Button
												className="mx-1 my-2"
												variant="outline-warning"
												onClick={() => setModalTimetable(true)}
											>
														Horário de funcionamento
											</Button>
											<Button
												variant="light"
												className="mx-1 my-2"
												id="btn-custom-outline"
												onClick={() => history.push("/cards")}
											>
														Cartões fidelidade
											</Button>
										</Row>
										:
										null
									}
								</>
								:
								null
							}
						</Card.Body>
					</Card>
				</Col>
				{user.userType === 0 && user.cards && user.cards.length && !noCards ?
					<Col className="m-auto p-3" sm="4">
						<h3 className="display-5 text-center m-auto p-3">Cartões Fidelidade:</h3>
						{user.cards.map((card, index) => (
							companyInfo.cards[index].available ?
								<>
									<Row key={index}>
										<Col>
											<h6>{card.cardFidelity}: {card.qtdCurrent}/{companyInfo.cards[index].qtdMax}</h6>
										</Col>
										<Col>
											<h6 align="right">Desconto: R${companyInfo.cards[index].discount}*</h6>
										</Col>
									</Row>

									<ProgressBar
										variant={(parseInt(card.qtdCurrent*100)/companyInfo.cards[index].qtdMax) < 40 ? "danger" : "warning"}
										animated now={parseInt((card.qtdCurrent*100)/companyInfo.cards[index].qtdMax)}
										label={`${parseInt((card.qtdCurrent*100)/companyInfo.cards[index].qtdMax)}%`} />
									<br/>
								</>
								:
								null
						))}
						<small id="text-OBS">* OBS: Se o pedido de um produto for mais barato que o desconto desse produto, o desconto será o valor do pedido desse produto. O valor do frete não está incluso!</small>
					</Col>
					:
					null
				}
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
					<Form onSubmit={(e) => handleUserUpdate(e)}>
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
				show={modalTimetable}
				onHide={() => {setModalTimetable(false); setToastShow(false);}}
				size="md"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar horário de funcionamento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Label>Deixe o horário com (--:--) para os dias que estiver fechado!</Form.Label>
					<Form onSubmit={(e) => handleTimetable(e)}>
						<Row className="mt-2">
							<Col className="my-2" sm={2}>
							Domingo:
							</Col>
							<Col className="my-2" md="auto">
								De
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableSundayI">
									<Form.Control
										value={timetableSundayI}
										onChange={e => setTimetableSundayI(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col >
							<Col className="my-2" md="auto">
								às
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableSundayF">
									<Form.Control
										value={timetableSundayF}
										onChange={e => setTimetableSundayF(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="my-2" sm={2}>
							Segunda:
							</Col>
							<Col className="my-2" md="auto">
								De
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableMondayI">
									<Form.Control
										value={timetableMondayI}
										onChange={e => setTimetableMondayI(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col >
							<Col className="my-2" md="auto">
								às
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableMondayF">
									<Form.Control
										value={timetableMondayF}
										onChange={e => setTimetableMondayF(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="my-2" sm={2}>
							Terça:
							</Col>
							<Col className="my-2" md="auto">
								De
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableTuesdayI">
									<Form.Control
										value={timetableTuesdayI}
										onChange={e => setTimetableTuesdayI(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col >
							<Col className="my-2" md="auto">
								às
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableTuesdayF">
									<Form.Control
										value={timetableTuesdayF}
										onChange={e => setTimetableTuesdayF(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="my-2" sm={2}>
							Quarta:
							</Col>
							<Col className="my-2" md="auto">
								De
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableWednesdayI">
									<Form.Control
										value={timetableWednesdayI}
										onChange={e => setTimetableWednesdayI(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col >
							<Col className="my-2" md="auto">
								às
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableWednesdayF">
									<Form.Control
										value={timetableWednesdayF}
										onChange={e => setTimetableWednesdayF(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="my-2" sm={2}>
							Quinta:
							</Col>
							<Col className="my-2" md="auto">
								De
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableThursdayI">
									<Form.Control
										value={timetableThursdayI}
										onChange={e => setTimetableThursdayI(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col >
							<Col className="my-2" md="auto">
								às
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableThursdayF">
									<Form.Control
										value={timetableThursdayF}
										onChange={e => setTimetableThursdayF(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="my-2" sm={2}>
							Sexta:
							</Col>
							<Col className="my-2" md="auto">
								De
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableFridayI">
									<Form.Control
										value={timetableFridayI}
										onChange={e => setTimetableFridayI(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col >
							<Col className="my-2" md="auto">
								às
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableFridayF">
									<Form.Control
										value={timetableFridayF}
										onChange={e => setTimetableFridayF(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="my-2" sm={2}>
							Sábado:
							</Col>
							<Col className="my-2" md="auto">
								De
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableSaturdayI">
									<Form.Control
										value={timetableSaturdayI}
										onChange={e => setTimetableSaturdayI(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col >
							<Col className="my-2" md="auto">
								às
							</Col>
							<Col md="auto">
								<Form.Group controlId="timetableSaturdayF">
									<Form.Control
										value={timetableSaturdayF}
										onChange={e => setTimetableSaturdayF(e.target.value)}
										type="time"
									/>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => { setModalTimetable(false); setToastShow(false); }}>
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
							<Col sm>
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
							<Col sm>
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
							<Col sm>
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
							<Col sm>
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
							<Col sm>
								<Form.Group controlId="companyFreight">
									<Form.Label>Valor do frete</Form.Label>
									<Form.Control
										value={companyFreight}
										onChange={e => setCompanyFreight(e.target.value)}
										type="number"
										placeholder="Valor do frete"
										min="1"
										max="10"
										required
									/>
								</Form.Group>
							</Col>
							<Col sm>
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
						<Row>
							<Col sm>
								<Form.Group controlId="companyTimeWithdrawal">
									<Form.Label>Tempo para retirada de um pedido</Form.Label>
									<Form.Control
										value={companyTimeWithdrawal}
										onChange={e => setCompanyTimeWithdrawal(e.target.value)}
										type="number"
										min="10"
										max="120"
										placeholder="Tempo em minutos"
										required
									/>
								</Form.Group>
							</Col>
							<Col sm>
								<Form.Group controlId="companyTimeDeliveryI">
									<Form.Label>Tempo mínimo para entrega de um pedido</Form.Label>
									<Form.Control
										value={companyTimeDeliveryI}
										onChange={e => setCompanyTimeDeliveryI(e.target.value)}
										type="number"
										min="10"
										max="120"
										placeholder="Tempo em minutos"
										required
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm>
								<Form.Group controlId="companyManual">
									<Form.Label align="justify">
										Controlar sistema aberto/fechado manualmente
									</Form.Label>
									<Form.Check
										type="switch"
										id="custom-switch4"
										label={companyManual ? "Manual" : "Automático"}
										checked={companyManual}
										onChange={e => setCompanyManual(e.target.checked)}
									/>
								</Form.Group>
								{companyManual ?
									<Form.Group controlId="companySystemOpenByAdm">
										<Form.Label>Fechar/Abrir sistema</Form.Label>
										<Form.Check
											type="switch"
											id="custom-switch3"
											label={companySystemOpenByAdm ? "Aberto" : "Fechado"}
											checked={companySystemOpenByAdm}
											onChange={e => setCompanySystemOpenByAdm(e.target.checked)}
										/>
									</Form.Group>
									:
									null
								}
							</Col>
							<Col sm>
								<Form.Group controlId="companyTimeDeliveryF">
									<Form.Label>Tempo máximo para entrega de um pedido</Form.Label>
									<Form.Control
										value={companyTimeDeliveryF}
										onChange={e => setCompanyTimeDeliveryF(e.target.value)}
										type="number"
										min="10"
										max="120"
										placeholder="Tempo em minutos"
										required
									/>
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

			<Modal
				show={modalImages}
				onHide={() => {
					setC1(null);
					setC2(null);
					setC3(null);
					setLogo(null);
					setModalImages(false);
					setToastShow(false); }}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Editar imagens</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm>
							<Form className="d-flex flex-column" onSubmit={(e) => handleCompanyImageUpdate(e, "logo")}>
								<Form.Group controlId="inputLogo">
									<Form.Label>Logo da empresa</Form.Label>
									<Form.Control
										className="d-none"
										type="file"
										onChange={event => setLogo(event.target.files[0])}
										required
									/>
								</Form.Group>
								<Col className="text-center mx-auto" sm="4">
									<Image
										id={companyInfo.logo || logoPreview ? "thumbnail" : "camera"}
										className={companyInfo.logo || logoPreview ? "btn border-0 m-auto" : "btn w-100 m-auto"}
										src={logoPreview ? logoPreview : (companyInfo.logo ? process.env.REACT_APP_API_URL + companyInfo.logo_url : camera)}
										alt="Selecione sua logo"
										onClick={() => document.getElementById("inputLogo").click()}
										rounded
										fluid
									/>
								</Col>
								{companyInfo.logo ?
									<Button
										className="my-3 mx-auto"
										type="submit"
										variant="warning"
									>
										Trocar Logo
									</Button>
									:
									<div className="d-flex">
										<Button
											className="my-3 mx-auto"
											type="submit"
											variant="warning"
										>
											Adicionar Logo
										</Button>
									</div>
								}
							</Form>
						</Col>
					</Row>
					<Row className="mx-1">
						Imagens do carrossel
					</Row>
					<Row>
						<Col className="text-center mx-auto" sm="4">
							<Form className="d-flex flex-column" onSubmit={(e) => handleCompanyImageUpdate(e, "c1")}>
								<Form.Control
									id="inputCarouselC1"
									className="d-none"
									type="file"
									onChange={event => {setC1(event.target.files[0]);}}
									required
								/>
								<Image
									id={companyInfo.carousel[0] || c1Preview ? "thumbnail" : "camera"}
									className={companyInfo.carousel[0] || c1Preview ? "btn border-0 m-auto" : "btn w-50 m-auto"}
									src={c1Preview ? c1Preview : (companyInfo.carousel[0] ? process.env.REACT_APP_API_URL + companyInfo.carousel_urls[0] : camera)}
									alt="Selecione sua imagem para o carrossel"
									onClick={() => document.getElementById("inputCarouselC1").click()}
									rounded
									fluid
								/>
							
								{companyInfo.carousel[0] ?
									<Button
										className="d-flex my-3 mx-auto"
										type="submit"
										variant="warning"
									>
										Trocar foto 1
									</Button>
									:
									<div className="d-flex">
										<Button
											className="my-3 mx-auto"
											type="submit"
											variant="warning"
										>
											Adicionar foto 1
										</Button>
									</div>
								}
							</Form>
						</Col>
						<Col className="text-center mx-auto" sm="4">
							<Form className="d-flex flex-column" onSubmit={(e) => handleCompanyImageUpdate(e, "c2")}>
								<Form.Control
									id="inputCarouselC2"
									className="d-none"
									type="file"
									onChange={event => {setC2(event.target.files[0]);}}
									required
								/>
								<Image
									id={companyInfo.carousel[1] || c2Preview ? "thumbnail" : "camera"}
									className={companyInfo.carousel[1] || c2Preview ? "btn border-0 m-auto" : "btn w-50 m-auto"}
									src={c2Preview ? c2Preview : (companyInfo.carousel[1] ? process.env.REACT_APP_API_URL + companyInfo.carousel_urls[1] : camera)}
									alt="Selecione sua imagem para o carrossel"
									onClick={() => document.getElementById("inputCarouselC2").click()}
									rounded
									fluid
								/>
						
								{companyInfo.carousel[1] ?
									<Button
										className="d-flex my-3 mx-auto"
										type="submit"
										variant="warning"
									>
										Trocar foto 2
									</Button>
									:
									<div className="d-flex">
										<Button
											className="my-3 mx-auto"
											type="submit"
											variant="warning"
										>
											Adicionar foto 2
										</Button>
									</div>
								}
							</Form>
						</Col>
						<Col className="text-center mx-auto" sm="4">
							<Form className="d-flex flex-column" onSubmit={(e) => handleCompanyImageUpdate(e, "c3")}>
								<Form.Control
									id="inputCarouselC3"
									className="d-none"
									type="file"
									onChange={event => {setC3(event.target.files[0]);}}
									required
								/>
								<Image
									id={companyInfo.carousel[2] || c3Preview ? "thumbnail" : "camera"}
									className={companyInfo.carousel[2] || c3Preview ? "btn border-0 m-auto" : "btn w-50 m-auto"}
									src={c3Preview ? c3Preview : (companyInfo.carousel[2] ? process.env.REACT_APP_API_URL + companyInfo.carousel_urls[2] : camera)}
									alt="Selecione sua imagem para o carrossel"
									onClick={() => document.getElementById("inputCarouselC3").click()}
									rounded
									fluid
								/>
						
								{companyInfo.carousel[2] ?
									<Button
										className="d-flex my-3 mx-auto"
										type="submit"
										variant="warning"
									>
										Trocar foto 3
									</Button>
									:
									<div className="d-flex">
										<Button
											className="my-3 mx-auto"
											type="submit"
											variant="warning"
										>
											Adicionar foto 3
										</Button>
									</div>
								}
							</Form>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
			<Alert.Close
				modalAlert={modalAlertThumbnail}
				setModalAlert={setModalAlertThumbnail}
				title={title}
				message={message}
			/>
		</>
	);
}

User.propTypes = {
	userId : PropTypes.string.isRequired,
	setUserId : PropTypes.any.isRequired,
	user : PropTypes.object.isRequired,
	setUser : PropTypes.any.isRequired,
	companyInfo : PropTypes.object.isRequired,
	noCards : PropTypes.object.isRequired
};