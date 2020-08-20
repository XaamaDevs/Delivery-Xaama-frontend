//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { NavLink, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Navbar, Nav } from "react-bootstrap";

// Importing backend api
import api from "../../../services/api";

// Importing styles
import "./styles.css";

//	Exporting resource to routes.js
export default function WebsiteNavbar() {
	//  Defining user varibles
	const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
	const [user, setUser] = useState({});

	//	Defining history to jump through pages
	const history = useHistory();

	//	Loading user info
	useEffect(() => {
		api.get("/user/" + userId)
			.then((response) => {
				setUser(response.data);
			})
			.catch((error) => {
				if(error.response) {
					alert(error.response.data);
				} else {
					alert(error);
				}
			});
	}, [userId]);

	//	Function to handle user logout
	async function handleLogout(event) {
		event.preventDefault();

		try {
			sessionStorage.removeItem("userId");

			setUserId(sessionStorage.getItem("userId"));

			history.push("/");
		} catch (error) {
			alert(error);
		}
	}

	return (
		<Navbar className="text-warning pt-5 px-3" bg="transparent" expand="lg">
			<NavLink to="/" className="navbar-brand text-warning">Xaama</NavLink>
			<Navbar.Toggle className="bg-warning" aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Item>
						<NavLink
							style={{color: "#ffbf00"}}
							exact activeClassName="activeRoute"
							activeStyle={{ color: "white" }}
							to="/"
							className="nav-link mx-2"
						>
							Início
						</NavLink>
					</Nav.Item>
					<Nav.Item>
						<NavLink 
							style={{color: "#ffbf00"}}
							activeClassName="activeRoute"
							activeStyle={{ color: "white" }}
							to="/menu"
							className="nav-link mx-2"
						>
							Cardápio
						</NavLink>
					</Nav.Item>
					{user.userType === 1 || user.userType === 2 ?
						<Nav.Item>
							<NavLink 
								style={{color: "#ffbf00"}}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/additionals"
								className="nav-link mx-2"
							>
								Adicionais
							</NavLink>
						</Nav.Item>
						:
						null
					}
				</Nav>
				{!userId ?
					<Nav className="ml-auto">
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/login"
								className="nav-link mx-2"
							>
								Entrar
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/signup"
								className="nav-link mx-2"
							>
								Cadastrar
							</NavLink>
						</Nav.Item>
					</Nav>
					:
					<Nav className="ml-auto">
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/user"
								className="nav-link mx-2"
							>
								Perfil
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink
								style={{color: "#ffbf00"}}
								to="#"
								onClick={handleLogout}
								className="nav-link mx-2"
							>
								Sair
							</NavLink>
						</Nav.Item>
					</Nav>
				}
			</Navbar.Collapse>
		</Navbar>
	);
}