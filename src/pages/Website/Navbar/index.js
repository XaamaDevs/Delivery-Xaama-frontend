//	Importing React main module and its features
import React from "react";

//	Importing React Router features
import { NavLink, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import { Navbar, Nav } from "react-bootstrap";

//	Exporting resource to routes.js
export default function WebsiteNavbar({ userId, setUserId, user, setUser }) {
	//	Defining history to jump through pages
	const history = useHistory();

	//	Function to handle user logout
	async function handleLogout(event) {
		event.preventDefault();

		try {
			sessionStorage.removeItem("userId");

			setUserId(sessionStorage.getItem("userId"));
			setUser({});

			history.push("/");
		} catch (error) {
			alert(error);
		}
	}

	return (
		<Navbar className="text-warning py-5 px-3" bg="transparent" expand="lg">
			<NavLink to="/" className="navbar-brand text-warning mx-5">Xaama</NavLink>
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
					{user && (user.userType === 1 || user.userType === 2) ?
						<Nav.Item>
							<NavLink 
								style={{color: "#ffbf00"}}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/additions"
								className="nav-link mx-2"
							>
								Adições
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