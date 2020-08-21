//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Nav, Card, Button, CardDeck, Modal, Form, Col, Row, Image } from "react-bootstrap";

//	Importing api to communicate to backend
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Additions() {
	//	User variables
	const userId = sessionStorage.getItem("userId");
	const [user, setUser] = useState({});

	//	Product variables
	const [productTypes, setProductTypes] = useState([]);
	const [additions, setAdditions] = useState([]);
	const [additionId, setAdditionId] = useState("");
	const [additionName, setAdditionName] = useState("");
	const [additionPrice, setAdditionPrice] = useState("");
	const [additionType, setAdditionType] = useState("");
	const [additionThumbnail_url, setAdditionThumbnail_url] = useState("");
	const [additionThumbnail, setAdditionThumbnail] = useState(null);

	//	Modal settings
	const [additionAddModal, setAdditionAddModal] = useState(false);
	const [additionUpdateModal, setAdditionUpdateModal] = useState(false);
	const [additionDeleteModal, setAdditionDeleteModal] = useState(false);
	const [modalWarningShow, setModalWarningShow] = useState(false);

	//	Defining history to jump through pages
	const history = useHistory();

	//	Loading current user info and products list by type
	useEffect(() => {
		async function loadResources() {
			await api.get("user/" + userId)
				.then((response) => {
					setUser(response.data);
				});

			await api.get("productTypes")
				.then((response) => {
					if(response.data && response.data.length) {
						setProductTypes(response.data);
					} else {
						alert("Não há tipos de produtos cadastrados");
					}
				}).catch((error) => {
					if(error.response) {
						alert(error.response.data);
					} else {
						alert(error);
					}
				});
			
			api.get("addition")
				.then((response) => {
					setAdditions(response.data);
				});
		}
		
		loadResources();
	}, [userId]);

	//	Product image preview
	const preview = useMemo(() => {
		return additionThumbnail ? URL.createObjectURL(additionThumbnail) : null;
	}, [additionThumbnail]);

	//	Function to handle input product thumbnail
	async function inputImage(event) {
		event.preventDefault();
	
		document.getElementById("inputImage").click();
	}

	async function handleAdditionAdd(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", additionName);
		data.append("price", additionPrice);
		data.append("type", additionType);

		if(additionThumbnail) {
			data.append("thumbnail", additionThumbnail);
		} else {
			const blob = await fetch(additionThumbnail_url).then(r => r.blob());
			const token = additionThumbnail_url.split(".");
			const extension = token[token.length-1];
			data.append("thumbnail", new File([blob], "thumbnail." + extension));
		}

		await api.post("addition", data, {
			headers : { 
				authorization: user._id
			}})
			.then((response) => {
				setAdditionAddModal(false);
				setModalWarningShow(true);
			})
			.catch((error) => {
				if(error.response) {
					alert(typeof(error.response.data) === "object" ? error : error.response.data);
				} else {
					alert(error);
				}
			});
	}

	async function handleAdditionUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", additionName);
		data.append("price", additionPrice);
		data.append("type", additionType);

		if(additionThumbnail) {
			data.append("thumbnail", additionThumbnail);
		} else {
			const blob = await fetch(additionThumbnail_url).then(r => r.blob());
			const token = additionThumbnail_url.split(".");
			const extension = token[token.length-1];
			data.append("thumbnail", new File([blob], "thumbnail." + extension));
		}

		await api.put("addition/" + additionId, data, {
			headers : { 
				authorization: user._id
			}})
			.then((response) => {
				setAdditionUpdateModal(false);
				setModalWarningShow(true);
			})
			.catch((error) => {
				if(error.response) {
					alert(typeof(error.response.data) === "string" ? error.response.data : error);
				} else {
					alert(error);
				}
			});
	}

	async function handleAdditionDelete(event) {
		event.preventDefault();
		
		await api.delete("addition/" + additionId, {
			headers : { 
				authorization: user._id
			}})
			.then((response) => {
				setAdditionDeleteModal(false);
				setModalWarningShow(true);
			})
			.catch((error) => {
				if(error.response) {
					alert(error.response.data);
				} else {
					alert(error);
				}
			});
	}

	async function handleAddAdditionModal(event) {
		event.preventDefault();

		setAdditionId("");
		setAdditionName("");
		setAdditionPrice("");
		setAdditionType("");
		setAdditionThumbnail(null);
		setAdditionThumbnail_url("");

		setAdditionAddModal(true);
	}

	async function handleAdditionModal(event, modal, product) {
		event.preventDefault();

		setAdditionId(product._id);
		setAdditionName(product.name);
		setAdditionPrice(product.price);
		setAdditionType(product.type);
		setAdditionThumbnail_url(product.thumbnail_url);

		switch(modal) {
		case 0:
			setAdditionUpdateModal(true);
			break;
		case 1:
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
						onClick={handleAddAdditionModal}
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
				<Card.Img variant="top" src={addition.thumbnail_url} fluid="true" />
				<Card.Body key={addition._id}>
					<Card.Title>{addition.name}</Card.Title>
					<div className="d-flex  justify-content-between">
						<Button 
							onClick ={e => handleAdditionModal(e, 0, addition)} 
							variant="warning">
								Modificar adição
						</Button>
						<Button 
							variant="danger" 
							onClick={e => handleAdditionModal(e, 1, addition)}>
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
		<div className="product-container container mt-3 w-100">
			<Card className="px-3" bg="dark">
				{header}
				{additions.length ?
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

			<Modal show={additionAddModal} onHide={e => setAdditionAddModal(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Nova adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col className="d-flex m-auto">
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setAdditionThumbnail(event.target.files[0])}
								/>
								<Image 
									id="thumbnail" 
									className={additionThumbnail ? "btn border-0 m-auto" : "btn w-75 m-auto"}
									src={preview ? preview : (additionThumbnail_url ? additionThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
									fluid
								/>
							</Col>
							<Col>
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
										onChange={e => setAdditionPrice(e.target.value)} 
										type="text"
										placeholder="Preço"
										required
									/>
								</Form.Group>
								<Form.Group controlId="additionType">
									<Form.Label>Tipo</Form.Label>
									{productTypes.map((type, index) => (
										<Form.Check key={index} type="checkbox" id={type}>
											<Form.Check.Input type="checkbox" />
											<Form.Check.Label>{type}</Form.Check.Label>
										</Form.Check>
									))}
									<Form.Text className="text-muted">
										Você pode permitir que uma adição possa ser pedida em mais de um tipo de produto
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => setAdditionAddModal(false)}>
						Fechar
					</Button>
					<Button variant="primary" type="submit" onClick={handleAdditionAdd}>
						Adicionar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={additionUpdateModal} onHide={e => setAdditionUpdateModal(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Modificar adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col className="d-flex m-auto">
								<Form.Control
									id="inputImage"
									className="d-none"
									type="file"
									onChange={event => setAdditionThumbnail(event.target.files[0])}
								/>
								<Image 
									id="thumbnail" 
									className={additionThumbnail ? "btn border-0 m-auto" : "btn w-100 m-auto"}
									src={preview ? preview : (additionThumbnail_url ? additionThumbnail_url : camera)}
									alt="Selecione sua imagem"
									onClick={inputImage}
									fluid
								/>
							</Col>
							<Col>
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
										onChange={e => setAdditionPrice(e.target.value)} 
										type="text"
										placeholder="Preço"
										required
									/>
								</Form.Group>
								<Form.Group controlId="additionType">
									<Form.Label>Tipo</Form.Label>
									{productTypes.map((type, index) => (
										<Form.Check key={index} type="checkbox" id={type}>
											<Form.Check.Input 
												type="checkbox" 
												checked={additionType && additionType.find(element => element === type) ? true : false}/>
											<Form.Check.Label>{type}</Form.Check.Label>
										</Form.Check>
									))}
									<Form.Text className="text-muted">
										Você pode permitir que uma adição possa ser pedida em mais de um tipo de produto
									</Form.Text>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => setAdditionUpdateModal(false)}>
						Fechar
					</Button>
					<Button variant="primary" type="submit" onClick={handleAdditionUpdate}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={additionDeleteModal} onHide={e => setAdditionDeleteModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Remover adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h3>{additionName}</h3>
					Você tem certeza que deseja remover esta adição?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => setAdditionDeleteModal(false)}>
						Voltar
					</Button>
					<Button variant="danger" onClick={handleAdditionDelete}>
						Remover
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={modalWarningShow} onHide={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>Alterações de adição</Modal.Title>
				</Modal.Header>
				<Modal.Body>Alterações salvas com sucesso!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}