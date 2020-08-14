//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import Image from "react-bootstrap/Image";
import { Container, Card, ListGroup, Button } from "react-bootstrap";

// Importing backend api
import api from "../../services/api";


//	Exporting resource to routes.js
export default function User() {
	const [user, setUser] = useState([]);

	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		async function loadUser() {
			const response = await api.get("/user/" + userId);
			setUser(response.data);
		}

		loadUser();
	}, []);


	return (
		<div className="user-container h-100">
			<div className="d-flex flex-row flex-wrap h-100">
				<div className="col-sm-4 m-auto p-3">
					<Image src={user.thumbnail_url} fluid/>
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