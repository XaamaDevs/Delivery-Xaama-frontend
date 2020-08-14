//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import Image from "react-bootstrap/Image";
import { Container, Card, ListGroup, Button } from "react-bootstrap";

// Importing backend api
import api from "../../services/api";

// Importing image from camera
import camera from "../../assets/camera.svg";


//	Exporting resource to routes.js
export default function User() {
	const [user, setUser] = useState([]);
	const [thumbnail, setThumbnail] = useState(null);


	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		async function loadUser() {
			const response = await api.get("/user/" + userId);
			setUser(response.data);
		}

		loadUser();
	}, []);

	const preview = useMemo(() => {
		return user.thumbnail ? URL.createObjectURL(user.thumbnail) : null;
	}, [thumbnail]);

	//	Function to handle input image profile
	async function inputImage(event) {
		event.preventDefault();
	
		const input = document.getElementsByTagName("input")[0].click();
	}


	return (
		<div className="user-container h-100">
			<div className="d-flex flex-row flex-wrap h-100">
				<div className="col-sm-4 m-auto p-3">
					{user.thumbnail ?
						<Image src={user.thumbnail_url} fluid/>
						:
						<form className="d-flex flex-row flex-wrap h-100">
							<input
								type="file"
								className="d-none"
								onChange={event => setThumbnail(event.target.files[0])}
							/>
							<img 
								id="thumbnail"
								className={user.thumbnail ? "has-thumbnail img-fluid border-0 m-auto" : "h-100 w-100 m-auto"}
								src={preview ? preview : camera} alt="Selecione sua imagem"
								onClick={inputImage}
							/>
						</form>
					}
					<br/> <br/>
					<Button variant="outline-warning">Trocar foto</Button>{" "}
					<Button variant="outline-danger">Apagar foto</Button>
				</div>
				<div className="col-sm-4 m-auto p-3">
					<Card style={{ width: "23rem" }}>
						<Card.Header>{user.name}</Card.Header>
						<ListGroup variant="flush">
							<ListGroup.Item>{user.email}</ListGroup.Item>
							<ListGroup.Item>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</ListGroup.Item>
							<ListGroup.Item>{user.address ? user.address: "Endreço:"}</ListGroup.Item>
						</ListGroup>
					</Card>
					<br/>
					<Button variant="outline-warning">Editar perfil</Button> {" "}
					<Button variant="outline-danger">Trocar senha</Button> {" "}
					<Button variant="outline-danger">Apagar perfil</Button>
				</div>
			</div>
		</div>
	);
}