//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import {
	Container,
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
import Alert from "../../components/Alert";
import Push from "../../components/Push";
import Loading from "../../components/Loading";

//	Importing api to communicate to backend
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Additions({ userId }) {
	//	Addition variables
	const [productTypes, setProductTypes] = useState([]);
	const [additions, setAdditions] = useState([]);
	const [addition, setAddition] = useState(null);
	const [additionId, setAdditionId] = useState("");
	const [additionName, setAdditionName] = useState("");
	const [additionPrice, setAdditionPrice] = useState("");
	const [additionType, setAdditionType] = useState([]);
	const [additionThumbnail_url, setAdditionThumbnail_url] = useState(null);
	const [additionThumbnail, setAdditionThumbnail] = useState(null);
	const [additionAvailable, setAdditionAvailable] = useState();

	//	Modal state variables
	const [modalAlert, setModalAlert] = useState(false);
	const [additionAddModal, setAdditionAddModal] = useState(false);
	const [additionUpdateModal, setAdditionUpdateModal] = useState(false);
	const [additionDeleteModal, setAdditionDeleteModal] = useState(false);

	//	Message settings
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	//	Update addition state variables
	useEffect(() => {
		setAdditionId(addition ? addition._id : "");
		setAdditionName(addition ? addition.name : "");
		setAdditionPrice(addition ? addition.price : "");
		setAdditionType(addition ? addition.type : "");
		setAdditionThumbnail(null);
		setAdditionThumbnail_url(addition ? addition.thumbnail_url : null);
		setAdditionAvailable(addition ? addition.available : true);
	}, [additionAddModal, additionUpdateModal, additionDeleteModal]);

	//	Addition image preview
	const preview = useMemo(() => {
		return additionThumbnail ? URL.createObjectURL(additionThumbnail) : null;
	}, [additionThumbnail]);

	//	Loading current user info and addition list
	useEffect(() => {
		async function fetchData() {
			await api.get("productTypes")
				.then((response) => {
					if(response.status === 200) {
						setProductTypes(response.data);
					}
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && error.response.status === 400) {
						setMessage(error.response.data);
						setToastShow(true);
					} else if(error.response && error.response.status === 404) {
						setProductTypes([]);
					} else if(error.response && error.response.status === 500) {
						setMessage(error.message);
						setToastShow(true);
					} else {
						setMessage("Algo deu errado :(");
						setToastShow(true);
					}
				});

			await api.get("addition")
				.then((response) => {
					if(response.status === 200) {
						setAdditions(response.data);
					}
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && error.response.status === 400) {
						setMessage(error.response.data);
						setToastShow(true);
					} else if(error.response && error.response.status === 404) {
						setAdditions([]);
					} else if(error.response && error.response.status === 500) {
						setMessage(error.message);
						setToastShow(true);
					} else {
						setMessage("Algo deu errado :(");
						setToastShow(true);
					}
				});

			setIsLoading(false);
		}

		fetchData();
	}, []);

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
		data.append("thumbnail", additionThumbnail);

		await api.post("addition", data, {
			headers : {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 201) {
				setAdditionAddModal(false);
				setTitle("Nova adição");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
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
		}).then((response) => {
			if(response.status === 200) {
				setAdditionUpdateModal(false);
				setTitle("Alterações de adição");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	async function handleAdditionThumbnailUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("thumbnail", additionThumbnail);

		await api.put("additionThumbnail/" + additionId, data, {
			headers : {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 200) {
				setAdditionUpdateModal(false);
				setTitle("Alterações de adição");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	async function handleAdditionDelete(event) {
		event.preventDefault();

		await api.delete("addition/" + additionId, {
			headers : {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 200) {
				setAdditionDeleteModal(false);
				setTitle("Remoção de adição");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	const header = (
		<Card.Header className="pb-3">
			<Nav variant="tabs" defaultActiveKey="#">
				<Nav.Item>
					<Nav.Link
						href="#"
						className="btn-outline-warning rounded"
						onClick={() => { setAddition(null); setAdditionAddModal(true); }}
					>
						Nova adição
					</Nav.Link>
				</Nav.Item>
			</Nav>
		</Card.Header>
	);

	const additionCard = (additionI, index) => {
		return (
			<Col key={index} className="px-1 my-2 mx-auto" lg="4" md="6" sm="12">
				<Card className="m-0 h-100" bg="secondary">
					<Card.Img
						variant="top"
						src={additionI.thumbnail ? process.env.REACT_APP_API_URL + additionI.thumbnail_url : camera}
						fluid="true"
					/>
					<Card.Body key={additionI._id}>
						<Card.Title>{additionI.name}</Card.Title>
						<div className="d-flex justify-content-around flex-wrap my-auto">
							<Button
								className="my-1"
								variant="warning"
								size="sm"
								onClick ={() => { setAddition(additionI); setAdditionUpdateModal(true); }}
							>
							Modificar
							</Button>

							{additionI.available ?
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
								onClick={() => { setAddition(additionI); setAdditionDeleteModal(true); }}
							>
							Remover
							</Button>
						</div>
					</Card.Body>
					<Card.Footer>
						<small>
							{"Preço: R$" + additionI.price}
						</small>
					</Card.Footer>
				</Card>
			</Col>
		);
	};

	const additionFormBody = (
		<>
			<Row>
				<Form.Group as={Col} controlId="additionName" sm>
					<Form.Label>Nome</Form.Label>
					<Form.Control
						value={additionName}
						onChange={e => setAdditionName(e.target.value)}
						type="text"
						placeholder="Nome da adição"
						required
					/>
				</Form.Group>
				<Form.Group as={Col} controlId="additionPrice" sm>
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
			</Row>
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
			<Form.Group className={additionAddModal ? "d-none" : null} controlId="additionAvailable">
				<Form.Check
					type="switch"
					id="custom-switch2"
					label={additionAvailable ? "Disponível" : "Indisponível"}
					checked={additionAvailable}
					onChange={e => setAdditionAvailable(e.target.checked)}
				/>
			</Form.Group>
		</>
	);

	return (
		<Container className="addition-container w-100">
			<Card className="px-3" text="light" bg="dark">
				{header}
				{isLoading ?
					<Loading animation="grow" />
					:
					<CardDeck className="p-2">
						{additions && additions.length ?
							<Row className="m-auto">
								{additions.map((additionI, index) => (
									additionCard(additionI, index)
								))}
							</Row>
							:
							null
						}
					</CardDeck>
				}
			</Card>

			<Modal
				show={additionAddModal}
				onHide={() =>  { setAddition(null); setAdditionAddModal(false); setToastShow(false); }}
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
							<Col className="d-flex m-auto" sm="6">
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									accept="image/*"
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
									onClick={() => document.getElementById("inputImage").click()}
									rounded
									fluid
								/>
							</Col>
							<Col>
								{additionFormBody}
							</Col>
						</Row>
						<Modal.Footer>
							<Button
								variant="danger"
								onClick={() => {
									setAddition(null);
									setAdditionAddModal(false);
									setToastShow(false);
								}}
							>
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
				onHide={() => { setAddition(null); setAdditionUpdateModal(false); setToastShow(false); }}
				size="lg" centered
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Modificar adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col className="d-flex text-center flex-column m-auto" sm="6">
							<Form onSubmit={handleAdditionThumbnailUpdate}>
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									accept="image/*"
									onChange={event => setAdditionThumbnail(event.target.files[0])}
									required
								/>
								<Image
									id={preview || additionThumbnail_url ? "thumbnail" : "camera"}
									className={preview || additionThumbnail_url ? "btn border-0 m-auto" : "btn w-75 m-auto"}
									src={preview ?
										preview
										:
										(additionThumbnail_url ? process.env.REACT_APP_API_URL + additionThumbnail_url : camera)
									}
									alt="Selecione sua imagem"
									onClick={() => document.getElementById("inputImage").click()}
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
								{additionFormBody}
								<Modal.Footer>
									<Button
										variant="danger"
										onClick={() => {
											setAddition(null);
											setAdditionUpdateModal(false);
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
						</Col>
					</Row>
				</Modal.Body>
			</Modal>

			<Modal
				show={additionDeleteModal}
				onHide={() => {
					setAddition(null);
					setAdditionDeleteModal(false);
					setToastShow(false);
				}}
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Remover adição {additionName}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Você tem certeza que deseja remover esta adição?
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="warning"
						onClick={() => {
							setAddition(null);
							setAdditionDeleteModal(false);
							setToastShow(false);
						}}
					>
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
	userId : PropTypes.string.isRequired
};