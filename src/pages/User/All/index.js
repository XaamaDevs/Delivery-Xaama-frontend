//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

// Importing backend api
import api from "../../../services/api";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing React features
import { Button } from "react-bootstrap";


//	Exporting resource to routes.js
export default function AllUsers() {
	const [users, setUsers] = useState([]);

	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		async function loadUser() {
			const response = await api.get("/user", {
				headers : { 
					authorization: userId
				}
			});
			setUsers(response.data);
		}

		loadUser();
	}, []);

	async function handleTypeUser(event, userUpdateId, newType) {
    event.preventDefault();
    
    const data = new FormData();

    data.append("userUpdateId", userUpdateId);
    data.append("type", newType);

    console.log(userUpdateId, newType);

    try {
			const response = await api.put("/company", data , {
				headers : { 
					authorization: userId
				}
			});
			alert(response.data);
			//history.go();
		} catch(error) {
			if (error.response) {
				alert(error.response.data);
			} else {
				alert(error);
			}
		}

	}


	return (
		<div id="all-container">
			<main>
				<ul>
					{users.map(user => (
						<li key={user.userId} className="user-item">
						<header>
							<img src={user.thumbnail ? user.thumbnail_url: camera } />
							<div className="user-info">
								<strong>{user.name}</strong>  
								<span>{user.email}</span>
							</div>              
						</header>
						<p>{user.phone ? user.phone: "Telefone: (__) _ ____-____"}</p>
						<p>{user.address && user.address.length ? user.address.join(", ") : "Endereço não informado" }</p>
						<p>Mude o tipo de cada usuário. Cuidado ao promover um usuário a ADM!</p>
						<Button
							onClick={event => handleTypeUser(event, user._id, 2)}
							variant="outline-danger ml-2">ADM
						</Button>

						<Button
							onClick={event => handleTypeUser(event, user._id, 1)}
							variant="outline-warning ml-2">Gerente
						</Button>

						<Button
							onClick={event => handleTypeUser(event, user._id, 0)}
							variant="outline-primary ml-2">Usuário
						</Button>
					</li>
					))}
				</ul>
			</main>
		</div>
	);
}