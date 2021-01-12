//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import {
	Container,
	Spinner,
	Nav,
	Card,
	Button,
	CardDeck,
	Modal,
	Form,
	Col,
	Row,
	Image
} from "react-bootstrap";

//	Importing website utils
import Alert from "../Website/Alert";
import Push from "../Website/Push";

//	Importing api to communicate to backend
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Additions({ userId }) {
	//	Addition variables
	const [productTypes, setProductTypes] = useState([]);
	const [additions, setAdditions] = useState([]);
	const [additionId, setAdditionId] = useState("");
	const [additionName, setAdditionName] = useState("");
	const [additionPrice, setAdditionPrice] = useState("");
	const [additionType, setAdditionType] = useState([]);
	const [additionThumbnail_url, setAdditionThumbnail_url] = useState(null);
	const [additionThumbnail, setAdditionThumbnail] = useState(null);
	const [additionAvailable, setAdditionAvailable] = useState();

	//	Message settings
	const [additionAddModal, setAdditionAddModal] = useState(false);
	const [additionUpdateModal, setAdditionUpdateModal] = useState(false);
	const [additionDeleteModal, setAdditionDeleteModal] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setLoading] = useState(true);

	//	Loading current user info and addition list
	useEffect(() => {
		async function fetchData() {
			await api.get("productTypes")
				.then((response) => {
					if(response.data) {
						setProductTypes(response.data);
					} else {
						setTitle("Erro!");
						setMessage("Não há tipos de produtos cadastrados");
						setToastShow(true);
					}
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && typeof(error.response.data) !== "object") {
						setMessage(error.response.data);
					} else {
						setMessage(error.message);
					}
					setToastShow(true);
				});

			await api.get("addition")
				.then((response) => {
					setAdditions(response.data);
				}).catch((error) => {
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
	}, [userId]);

	//	Addition image preview
	const preview = useMemo(() => {
		return additionThumbnail ? URL.createObjectURL(additionThumbnail) : null;
	}, [additionThumbnail]);

	//	Function to handle input addition thumbnail
	async function inputImage(event) {
		event.preventDefault();

		document.getElementById("inputImage").click();
	}

	async function handleAdditionAdd(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", additionName);
		data.append("price", additionPrice);

		const addTypesElem = document.getElementById("additionType").children;
		var addTypes = "";

		for(const type of addTypesElem) {
			if(type.selected === true) {
				addTypes += type.value + ", ";
			}
		}

		addTypes = addTypes.length ? addTypes.slice(0, -2) : addTypes;

		data.append("type", addTypes);

		if(additionThumbnail) {
			data.append("thumbnail", additionThumbnail);
		} else if(additionThumbnail_url) {
			const blob = await fetch(additionThumbnail_url).then(r => r.blob());
			const token = additionThumbnail_url.split(".");
			const extension = token[token.length-1];
			data.append("thumbnail", new File([blob], "thumbnail." + extension));
		}

		await api.post("addition", data, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setAdditionAddModal(false);
				setTitle("Nova adição!");
				setMessage("Adição criada com sucesso!");
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

	async function handleAdditionUpdate(event) {
		event.preventDefault();

		const addTypesElem = document.getElementById("additionType").children;
		var addTypes = "";

		for(const type of addTypesElem) {
			if(type.selected === true) {
				addTypes += type.value + ", ";
			}
		}

		addTypes = addTypes.length ? addTypes.slice(0, -2) : addTypes;
		
		const data = {
			name: additionName,
			price: additionPrice,
			available: additionAvailable,
			type: addTypes
		};

		await api.put("addition/" + additionId, data, {
			headers : {
				"x-access-token": userId
			}
		}).then(() => {
			setAdditionUpdateModal(false);
			setTitle("Alterações de adição!");
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
	
	async function handleAdditionThumbnailUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		if(additionThumbnail) {
			data.append("thumbnail", additionThumbnail);
		} else if(additionThumbnail_url) {
			const blob = await fetch(additionThumbnail_url).then(r => r.blob());
			const token = additionThumbnail_url.split(".");
			const extension = token[token.length-1];
			data.append("thumbnail", new File([blob], "thumbnail." + extension));
		}

		await api.put("additionThumbnail/" + additionId, data, {
			headers : {
				"x-access-token": userId
			}
		}).then(() => {
			setAdditionUpdateModal(false);
			setTitle("Alterações de adição!");
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

	async function handleAdditionDelete(event) {
		event.preventDefault();

		await api.delete("addition/" + additionId, {
			headers : {
				"x-access-token": userId
			}})
			.then(() => {
				setAdditionDeleteModal(false);
				setTitle("Remoção de adição!");
				setMessage("Adição removida com sucesso!");
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

	async function handleAdditionModal(event, modal, addition = null) {
		event.preventDefault();

		setAdditionId(addition ? addition._id : "");
		setAdditionName(addition ? addition.name : "");
		setAdditionPrice(addition ? addition.price : "");
		setAdditionType(addition ? addition.type : "");
		setAdditionThumbnail(null);
		setAdditionThumbnail_url(addition ? addition.thumbnail_url : null);
		setAdditionAvailable(addition ? addition.available : true);

		switch(modal) {
		case 0:
			setAdditionAddModal(true);
			break;
		case 1:
			setAdditionUpdateModal(true);
			break;
		case 2:
			setAdditionDeleteModal(true);
			break;
		case 3:
			setAdditionAvailable(false);
			handleAdditionUpdate(event);
			break;
		case 4:
			setAdditionAvailable(true);
			handleAdditionUpdate(event);
			break;
		default:
			break;
		}
	}

	const header = (
		<Card.Header className="pb-3">
			<Nav variant="tabs" defaultActiveKey="#">
				<Nav.Item>
					<Nav.Link
						href="#"
						className="btn-outline-warning rounded"
						onClick={e => handleAdditionModal(e, 0)}
					>
						Nova adição
					</Nav.Link>
				</Nav.Item>
			</Nav>
		</Card.Header>
	);

	const additionCard = (addition) => {
		return (
			<Card className="col-sm-4 my-1 p-0" bg="secondary" key={addition._id}>
				<Card.Img
					variant="top"
					src={addition.thumbnail ? process.env.REACT_APP_API_URL + addition.thumbnail_url : camera}
					fluid="true"
				/>
				<Card.Body key={addition._id}>
					<Card.Title>{addition.name}</Card.Title>
					<div className="d-flex justify-content-around flex-wrap my-auto">
						<Button
							className="my-1"
							variant="warning"
							size="sm"
							onClick ={e => handleAdditionModal(e, 1, addition)}
						>
								Modificar
						</Button>

						{addition.available ?
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
								variant="dark"
								size="sm"
							>
								Indisponível
							</Button>
						}

						<Button
							className="my-1"
							variant="danger"
							size="sm"
							onClick={e => handleAdditionModal(e, 2, addition)}
						>
							Remover
						</Button>
					</div>
				</Card.Body>
				<Card.Footer>
					<small>
						{"Preço: R$" + addition.price}
					</small>
				</Card.Footer>
			</Card>
		);
	};

	return (
		<Container className="addition-container w-100">
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
					additions.length ?
						<CardDeck className="p-2">
							{Array(additions.length).fill(null).map((value, i) => (
								i%3 === 0 ?
									<Row className="d-flex justify-content-around m-auto w-100" key={i/3}>
										{Array(3).fill(null).map((value, j) => (
											i+j < additions.length ? additionCard(additions[i+j]) : null
										))}
									</Row>
									:
									null
							))}
						</CardDeck>
						:
						null
				}
			</Card>

			<Modal
				show={additionAddModal}
				onHide={() =>  {setAdditionAddModal(false); setToastShow(false);}}
				size="lg"
				centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Nova adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleAdditionAdd}>
						<Row>
							<Col className="d-flex m-auto" sm>
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setAdditionThumbnail(event.target.files[0])}
								/>
								<Image
									id={preview || additionThumbnail_url ? "thumbnail" : "camera"}
									className={preview || additionThumbnail_url ? "btn border-0 m-auto" : "btn w-75 m-auto"}
									src={preview ?
										preview
										:
										(additionThumbnail_url ? process.env.REACT_APP_API_URL + additionThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
									rounded
									fluid
								/>
							</Col>
							<Col sm>
								<Form.Group controlId="additionName">
									<Form.Label>Nome</Form.Label>
									<Form.Control
										value={additionName}
										onChange={e => setAdditionName(e.target.value)}
										type="text"
										placeholder="Nome da adição"
										required
									/>
								</Form.Group>
								<Form.Group controlId="additionPrice">
									<Form.Label>
										Preço
									</Form.Label>
									<Form.Control
										value={additionPrice}
										onChange={e => {
											e.target.value = isNaN(e.target.value) ? additionPrice : e.target.value;
											setAdditionPrice(e.target.value);
										}}
										pattern="^[0-9]+(\.[0-9]+)*$"
										type="text"
										placeholder="Preço da adição"
										required
									/>
								</Form.Group>
								<Form.Group controlId="additionType">
									<Form.Label>Tipo</Form.Label>
									<Form.Control as="select" htmlSize="2" multiple required>
										{productTypes.map((type, index) => (
											<option key={index}>{type}</option>
										))}
									</Form.Control>
									<Form.Text className="text-muted">
										Selecione mais de uma opção segurando ctrl e clicando nos tipos desejados
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setAdditionAddModal(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Adicionar
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal
				show={additionUpdateModal}
				onHide={() => {setAdditionUpdateModal(false); setToastShow(false);}}
				size="lg" centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col className="d-flex m-auto" sm>
							<Form onSubmit={handleAdditionThumbnailUpdate}>
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setAdditionThumbnail(event.target.files[0])}
									required
								/>
								<Image
									id={preview || additionThumbnail_url ? "thumbnail" : "camera"}
									className={preview || additionThumbnail_url ? "btn border-0 m-auto" : "btn w-100 m-auto"}
									src={preview ? preview : (additionThumbnail_url ? process.env.REACT_APP_API_URL + additionThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
									rounded
									fluid
								/>
								
								<Button variant="warning" type="submit" className="d-flex mx-auto my-2">
									Alterar imagem
								</Button>
							</Form>
						</Col>
						<Col sm>			
							<Form onSubmit={handleAdditionUpdate}>
								<Form.Group controlId="additionName">
									<Form.Label>Nome</Form.Label>
									<Form.Control
										value={additionName}
										onChange={e => setAdditionName(e.target.value)}
										type="text"
										placeholder="Nome do adicional"
										required
									/>
								</Form.Group>
								<Form.Group controlId="additionPrice">
									<Form.Label>
										Preço
									</Form.Label>
									<Form.Control
										value={additionPrice}
										onChange={e => {
											e.target.value = isNaN(e.target.value) ? additionPrice : e.target.value;
											setAdditionPrice(e.target.value);
										}}
										pattern="^[0-9]+(\.[0-9]+)*$"
										type="text"
										placeholder="Preço da adição"
										required
									/>
								</Form.Group>
								<Form.Group controlId="additionType">
									<Form.Label>Tipo</Form.Label>
									<Form.Control as="select" htmlSize="2" multiple required>
										{productTypes.map((type, index) => (
											<option
												key={index}
												selected={additionType && additionType.indexOf(type) >= 0 ? true : false}>
												{type}
											</option>
										))}
									</Form.Control>
									<Form.Text className="text-muted">
										Selecione mais de uma opção segurando ctrl e clicando nos tipos desejados
									</Form.Text>
								</Form.Group>
								<Form.Group controlId="additionAvailable">
									<Form.Check
										type="switch"
										id="custom-switch2"
										label={additionAvailable ? "Disponível" : "Indisponível"}
										checked={additionAvailable}
										onChange={e => setAdditionAvailable(e.target.checked)}
									/>
								</Form.Group>
								<Modal.Footer>
									<Button variant="danger" onClick={() => {setAdditionUpdateModal(false); setToastShow(false);}}>
										Fechar
									</Button>
									<Button variant="warning" type="submit">
										Salvar alterações
									</Button>
								</Modal.Footer>
							</Form>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>

			<Modal show={additionDeleteModal} onHide={() => {setAdditionDeleteModal(false); setToastShow(false);}}>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Remover adição {additionName}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Você tem certeza que deseja remover esta adição?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => {setAdditionDeleteModal(false); setToastShow(false);}}>
						Voltar
					</Button>
					<Button variant="danger" onClick={handleAdditionDelete}>
						Remover
					</Button>
				</Modal.Footer>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
		</Container>
	);
}

Additions.propTypes = {
	userId : PropTypes.string.isRequired,
	user : PropTypes.object.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.any.isRequired
};