//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import Image from "react-bootstrap/Image";
import { Card, ListGroup, Button, Form, Col, Row, Modal } from "react-bootstrap";

// Importing backend api
import api from "../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../assets/camera.svg";


//	Exporting resource to routes.js
export default function User() {
	const [user, setUser] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState([]);
  
  //	Modal settings
  const [modal1Show, setModal1Show] = useState(false);
  const [modal2Show, setModal2Show] = useState(false);
	const [modal3Show, setModal3Show] = useState(false);

	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		async function loadUser() {
			const response = await api.get("/user/" + userId);
			setUser(response.data);
		}

		loadUser();
	}, []);

	const preview = useMemo(() => {
		return thumbnail ? URL.createObjectURL(thumbnail) : null;
	}, [thumbnail]);

	//	Function to handle input image profile
	async function inputImage(event) {
		event.preventDefault();
	
		const input = document.getElementsByTagName("input")[0].click();
	}
	
	const history = useHistory();

	//	Function to handle add image profile
	async function handleSubmit(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", user.name);
		data.append("email", user.email);
		data.append("thumbnail", thumbnail);

		try {
			const response = await api.put("/user", data , {
				headers : { 
					authorization: user._id
				}
			});
			alert(response.data);
			history.go();
		} catch(error) {
			if (error.response) {
				alert(error.response.data);
			} else {
				alert(error);
			}
		}
  }

  async function handleUserUpdate(event) {
		event.preventDefault();

		const data = new FormData();

		data.append("name", userName);
		data.append("email", userEmail);
		data.append("address", userAddress);
		data.append("phone", userPhone);
		
		api.put("user/" + userId, data,  {
			headers : { 
				authorization: userId
			}})
			.then((response) => {
				setModal3Show(true);
				setModal1Show(false);
			}).catch((error) => {
				if(error.response) {
					alert(error.response.data);
				} else {
					alert(error);
				}
			});
	}
  
  async function handleModal(event, modal, action, user = null) {
		event.preventDefault();

		if(action === "open") {
      setUserName(user.name);
      setUserEmail(user.email);
      setUserPhone(user.phone);
      setUserAddress(user.address.join(", "));
		}

		if(modal === 1) {
			setModal1Show((action === "open") ? true : false);
		} else if(modal === 1) {
      setModal3Show((action === "open") ? true : false);
    }
	}


	return (
		<div className="user-container h-100">
			<div className="d-flex flex-row flex-wrap h-100">
				<div className="col-sm-4 m-auto p-3">
					{user.thumbnail ?
						<>
							<form onSubmit={handleSubmit}>
								<Image src={user.thumbnail_url} rounded fluid/>
								<br/> <br/>
								<Button type="submit" variant="outline-warning">Trocar foto</Button>{" "}
								<Button type="submit" variant="outline-danger">Apagar foto</Button>
							</form>
						</>
						:
						<form className="d-flex flex-row flex-wrap h-100" onSubmit={handleSubmit}>
							<input
								type="file"
								className="d-none"
								onChange={event => setThumbnail(event.target.files[0])}
							/>
							<img 
								id="thumbnail"
								className={thumbnail ? "has-thumbnail img-fluid border-0 m-auto" : "h-100 w-100 m-auto"}
								src={preview ? preview : camera} alt="Selecione sua imagem"
								onClick={inputImage}
							/>
							<Button style={{position:"absolute", top:"95%", left:"30%"}} className="mt-4" type="submit" variant="outline-warning" >Adicionar foto</Button>
						</form>
					}
				</div>
				<div className="col-sm-4 m-auto p-3">
					<Card style={{ width: "23rem" }}>
						<Card.Header>{user.name}</Card.Header>
						<ListGroup variant="flush">
							<ListGroup.Item>{user.email}</ListGroup.Item>
							<ListGroup.Item>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</ListGroup.Item>
							<ListGroup.Item>{user.address ? `Bairro: ${user.address[0]} Rua: ${user.address[1]} Número: ${user.address[2]}` : "Endereço:"}</ListGroup.Item>
						</ListGroup>
					</Card>
					<br/>
					{user.userType != 2 ?
						<>
              <Button 
                variant="outline-warning"
                onClick ={event => handleModal(event, 1, "open", user)}>Editar perfil
              </Button> {" "}
							<button className="btn" id="btn-password">Trocar senha</button> {" "}
							<Button variant="outline-danger">Apagar perfil</Button>
						</>
						:
						<>
              <Button 
                variant="outline-warning" 
                onClick ={event => handleModal(event, 1, "open", user)} >Editar perfil
              </Button> {" "}
							<Button variant="outline-danger">Trocar senha</Button> {" "}
						</>
					}
				</div>
			</div>
      <Modal show={modal1Show} onHide={e => setModal1Show(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Modificar produto</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col>
								<Form.Group controlId="userName">
									<Form.Label>Nome</Form.Label>
									<Form.Control 
										value={userName}
										onChange={e => setUserName(e.target.value)} 
										type="text" 
										placeholder="Nome de usuário"
									/>
								</Form.Group>
							</Col>
              <Col>
								<Form.Group controlId="userEmail">
									<Form.Label>Email</Form.Label>
									<Form.Control 
										value={userEmail}
										onChange={e => setUserEmail(e.target.value)} 
										type="text" 
										placeholder="Seu email"
									/>
								</Form.Group>
							</Col>
						</Row>
            <Row>
							<Col>
								<Form.Group controlId="userPhone">
									<Form.Label>Telefone</Form.Label>
									<Form.Control 
										value={userPhone}
										onChange={e => setUserPhone(e.target.value)} 
										type="text" 
										placeholder="(__) _ ____-____"
									/>
								</Form.Group>
							</Col>
              <Col>
								<Form.Group controlId="userAddress">
									<Form.Label>Endereço</Form.Label>
									<Form.Control 
										value={userAddress}
										onChange={e => setUserAddress(e.target.value)} 
										type="text" 
										placeholder="Bairro, Rua, Número"
									/>
								</Form.Group>
							</Col>
						</Row>
						
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={e => setModal1Show(false)}>
						Fechar
					</Button>
					<Button variant="primary" type="submit" onClick={handleUserUpdate}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

      <Modal show={modal3Show} onHide={e => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>Alterações usuário</Modal.Title>
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