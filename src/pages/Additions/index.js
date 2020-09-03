//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { 
	Container, 
	Spinner, 
	Toast, 
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

	//	Message settings
	const [additionAddModal, setAdditionAddModal] = useState(false);
	const [additionUpdateModal, setAdditionUpdateModal] = useState(false);
	const [additionDeleteModal, setAdditionDeleteModal] = useState(false);
	const [modalWarningShow, setModalWarningShow] = useState(false);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("");
	const [isLoading, setLoading] = useState(true);

	//	Defining history to jump through pages
	const history = useHistory();

	//	Loading current user info and addition list
	useEffect(() => {
		async function fetchData() {
			await api.get("productTypes")
				.then((response) => {
					if(response.data) {
						setProductTypes(response.data);
					} else {
						setTitle("Erro!");
						setColor("danger");
						setMessage("Não há tipos de produtos cadastrados");
						setToastShow(true);
					}
				})
				.catch((error) => {
					setTitle("Erro!");
					setColor("danger");
					if(error.response) {
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
					setColor("danger");
					if(error.response) {
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
				authorization: userId
			}})
			.then(() => {
				setAdditionAddModal(false);
				setTitle("Nova adição!");
				setMessage("Adição criada com sucesso!");
				setColor("warning");
				setModalWarningShow(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
					setMessage(error.response.data);
				} else {
					setMessage(error.message);
				}
				setToastShow(true);
			});
	}

	async function handleAdditionUpdate(event) {
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

		await api.put("addition/" + additionId, data, {
			headers : { 
				authorization: userId
			}})
			.then(() => {
				setAdditionUpdateModal(false);
				setTitle("Alterações de adição!");
				setMessage("Alterações feitas com sucesso!");
				setColor("warning");
				setModalWarningShow(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
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
				authorization: userId
			}})
			.then(() => {
				setAdditionDeleteModal(false);
				setTitle("Remoção de adição!");
				setMessage("Adição removida com sucesso!");
				setColor("warning");
				setModalWarningShow(true);
			})
			.catch((error) => {
				setTitle("Erro!");
				setColor("danger");
				if(error.response) {
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
				<Card.Img variant="top" src={addition.thumbnail ? addition.thumbnail_url : camera} fluid="true" />
				<Card.Body key={addition._id}>
					<Card.Title>{addition.name}</Card.Title>
					<div className="d-flex justify-content-between flex-wrap my-auto">
						<Button 
							variant="warning"
							size="sm"
							onClick ={e => handleAdditionModal(e, 1, addition)} 
						>
								Modificar adição
						</Button>
						<Button 
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
		<Container className="addition-container w-100">
			<Card className="px-3" bg="dark">
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
				{toast}
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
									id="thumbnail" 
									className={preview || additionThumbnail_url ? "btn border-0 m-auto" : "btn w-75 m-auto"}
									src={preview ? preview : (additionThumbnail_url ? additionThumbnail_url : camera)}
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
				{toast}
				<Modal.Header closeButton>
					<Modal.Title>Modificar adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleAdditionUpdate}>
						<Row>
							<Col className="d-flex m-auto" sm>
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setAdditionThumbnail(event.target.files[0])}
								/>
								<Image 
									id="thumbnail" 
									className={preview || additionThumbnail_url ? "btn border-0 m-auto" : "btn w-100 m-auto"}
									src={preview ? preview : (additionThumbnail_url ? additionThumbnail_url : camera)}
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
							</Col>
						</Row>
						<Modal.Footer>
							<Button variant="danger" onClick={() => {setAdditionUpdateModal(false); setToastShow(false);}}>
								Fechar
							</Button>
							<Button variant="warning" type="submit">
								Salvar alterações
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={additionDeleteModal} onHide={() => {setAdditionDeleteModal(false); setToastShow(false);}}>
				{toast}
				<Modal.Header closeButton>
					<Modal.Title>Remover adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h3>{additionName}</h3>
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

			<Modal show={modalWarningShow} onHide={() => history.go()}>
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
		</Container>
	);
}