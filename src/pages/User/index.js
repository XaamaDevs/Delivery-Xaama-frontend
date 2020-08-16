//	Importing React main module and its features
import React, { useState, useEffect, useMemo } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import Image from "react-bootstrap/Image";
import { Card, ListGroup, Button } from "react-bootstrap";

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
							<ListGroup.Item>{user.address ? user.address.join(", "): "Endreço:"}</ListGroup.Item>
						</ListGroup>
					</Card>
					<br/>
					{user.userType != 2 ?
						<>
							<Button variant="outline-warning">Editar perfil</Button> {" "}
							<button className="btn" id="btn-password">Trocar senha</button> {" "}
							<Button variant="outline-danger">Apagar perfil</Button>
						</>
						:
						<>
							<Button variant="outline-warning">Editar perfil</Button> {" "}
							<Button variant="outline-danger">Trocar senha</Button> {" "}
						</>
					}
				</div>
			</div>
		</div>
	);
}