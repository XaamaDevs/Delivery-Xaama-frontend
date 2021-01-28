//	Importing React main module and its features
import React, { useState, useEffect  } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { NavLink, useHistory } from "react-router-dom";

//	Importing React Bootstrap features
import {
	Navbar,
	Nav,
	Modal,
	Button,
	Row,
	Col,
	Image
} from "react-bootstrap";

//	Importing React icons features
import { RiShoppingBasketLine } from "react-icons/ri";

//	Exporting resource to routes.js
export default function WebsiteNavbar({
	userId,
	setUserId,
	user,
	setUser,
	order,
	setOrder,
	companyInfo,
	companySystemOpenByHour,
	setCompanySystemOpenByHour,
	data
}) {
	//	Modal state variables
	const [modalTimetable, setModalTimetable] = useState(false);

	//  Current day of the week and time
	const [systemTime, setSystemTime] = useState(
		data && data.getHours() && data.getMinutes() ?
			data.getHours() + ":" + data.getMinutes() : ""
	);

	//	Defining history to jump through pages
	const history = useHistory();

	//  Updating system time
	useEffect(() => {
		function systemOpen() {
			const openHour =
				data && companyInfo && companyInfo.timetable && companyInfo.timetable[data.getDay()].beginHour ?
					companyInfo.timetable[data.getDay()].beginHour : "";

			const endHour =
				data && companyInfo && companyInfo.timetable && companyInfo.timetable[data.getDay()].endHour ?
					companyInfo.timetable[data.getDay()].endHour : "";

			const current = new Date("2020-07-28 " + systemTime);
			const open = new Date("2020-07-28 " + openHour);
			const end = new Date("2020-07-28 " + endHour);

			if(end.getTime() < open.getTime()) {
				if ((current.getTime() >= open.getTime()) || (current.getTime() <= end.getTime())) {
					return true;
				} else {
					return false;
				}
			} else if ((current.getTime() >= open.getTime()) && (current.getTime() <= end.getTime())) {
				return true;
			} else {
				return false;
			}
		}

		setSystemTime(data ? data.getHours() + ":" + data.getMinutes() : "");
		setCompanySystemOpenByHour(systemOpen() ? true : false);
	}, [data, setSystemTime, setCompanySystemOpenByHour, companyInfo, systemTime]);

	//	Function to handle user logout
	async function handleLogout(event) {
		event.preventDefault();

		try {
			sessionStorage.removeItem("userId");

			setUserId("");
			setUser({});
			setOrder({});
			sessionStorage.removeItem("order");

			history.push("/");
		} catch (error) {
			alert(error);
		}
	}

	return (
		<>
			<Navbar className="py-4 px-3" bg="transparent" expand="lg">
				<NavLink to="/" className="navbar-brand text-warning mx-5 p-0">
					{companyInfo.logo ?
						<Image
							className="border-0 m-auto"
							width="100px"
							src={process.env.REACT_APP_API_URL + companyInfo.logo_url}
							alt="Logo"
							fluid
						/>
						:
						companyInfo.name
					}
				</NavLink>
				<Navbar.Toggle className="bg-warning" aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Item>
							<NavLink
								style={{ color: "#ffbf00" }}
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
								style={{ color: "#ffbf00" }}
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
									style={{ color: "#ffbf00" }}
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
						<Nav.Item>
							<NavLink
								style={{ color: "#ffbf00" }}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								to="/about"
								className="nav-link mx-2"
							>
								Sobre
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink
								style={{ color: "#ffbf00" }}
								activeClassName="activeRoute"
								activeStyle={{ color: "white" }}
								className="nav-link mx-2"
								to="/rating"
							>
								Avaliações
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink
								style={{ color: "#ffbf00" }}
								className="nav-link mx-2"
								to="#"
								onClick={() => setModalTimetable(true)}
							>
								Horário de Funcionamento
							</NavLink>
						</Nav.Item>
					</Nav>
					<Nav className="ml-auto">
						{order.products && order.products.length ?
							<Nav.Item>
								<NavLink
									style={{ color: "#ffbf00" }}
									activeClassName="activeRoute"
									activeStyle={{ color: "white" }}
									to="/finishOrder"
									className="nav-link mx-2"
								>
									<RiShoppingBasketLine size="25" />
								</NavLink>
							</Nav.Item>
							:
							null
						}
						{!userId ?
							<>
								<Nav.Item>
									<NavLink
										style={{ color: "#ffbf00" }}
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
										style={{ color: "#ffbf00" }}
										activeClassName="activeRoute"
										activeStyle={{ color: "white" }}
										to="/signup"
										className="nav-link mx-2"
									>
									Cadastrar
									</NavLink>
								</Nav.Item>
							</>
							:
							<>
								{user.userType === 0 ?
									<Nav.Item>
										<NavLink
											style={{ color: "#ffbf00" }}
											activeClassName="activeRoute"
											activeStyle={{ color: "white" }}
											to="/order"
											className="nav-link mx-2"
										>
											Meus Pedidos
										</NavLink>
									</Nav.Item>
									:
									null
								}
								<Nav.Item>
									<NavLink
										style={{ color: "#ffbf00" }}
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
										style={{ color: "#ffbf00" }}
										to="#"
										onClick={handleLogout}
										className="nav-link mx-2"
									>
									Sair
									</NavLink>
								</Nav.Item>
							</>
						}
					</Nav>
				</Navbar.Collapse>
			</Navbar>

			<Modal
				show={modalTimetable}
				onHide={() => setModalTimetable(false)}
				size="md"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Horário de Funcionamento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{(companyInfo && companyInfo.timetable && companyInfo.timetable.length ?
						companyInfo.timetable.map((t, index) => (
							<Row key={index} className="mt-2">
								<Col className="text-center my-2 ml-auto p-0 pl-2">
									{t.dayWeek}:
								</Col>
								{(t.beginHour && t.endHour ?
									<>
										<Col className="text-center my-2 p-0">
											De
										</Col>
										<Col className="text-center my-2 p-0">
											{t.beginHour}
										</Col >
										<Col className="text-center my-2 p-0">
											às
										</Col>
										<Col className="text-center my-2 mr-auto p-0 pr-2">
											{t.endHour}
										</Col>
									</>
									:
									<Col className="text-center my-2 mr-auto p-0 pr-2">
										Fechado
									</Col>
								)}
							</Row>
						))
						:
						<Row>
							<Col className="my-2" md="auto">
								Horário indisponível
							</Col>
						</Row>
					)}
				</Modal.Body>
				<Modal.Footer>
					{(companyInfo && companyInfo.manual && companyInfo.systemOpenByAdm) ||
					(companyInfo && !companyInfo.manual && companySystemOpenByHour) ?
						<Button
							variant="light"
							size="md"
							id="btn-custom"
						>
							Aberto agora
						</Button>
						:
						<Button
							variant="danger"
						>
							Fechado
						</Button>
					}
					<Button variant="warning" onClick={() => setModalTimetable(false)}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

WebsiteNavbar.propTypes = {
	userId : PropTypes.string,
	setUserId : PropTypes.func.isRequired,
	user : PropTypes.object.isRequired,
	setUser : PropTypes.func.isRequired,
	order : PropTypes.object.isRequired,
	setOrder : PropTypes.func.isRequired,
	companyInfo : PropTypes.object.isRequired,
	companySystemOpenByHour : PropTypes.bool,
	setCompanySystemOpenByHour : PropTypes.func.isRequired,
	setData : PropTypes.func.isRequired,
	data : PropTypes.object.isRequired,
	noCards : PropTypes.bool.isRequired
};