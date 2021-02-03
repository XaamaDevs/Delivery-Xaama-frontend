//	Importing React main module and its features
import React, { useState, useEffect  } from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { useHistory, Link } from "react-router-dom";

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
			<Navbar collapseOnSelect className="py-4 px-3" bg="transparent" expand="lg">
				<Nav.Link as={Link} to="/" href="/" className="navbar-brand text-warning mx-5 p-0">
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
				</Nav.Link>
				<Navbar.Toggle className="bg-warning" aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Item>
							<Nav.Link
								as={Link}
								to="/"
								href="/"
								className="text-warning mx-2"
							>
								Início
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								as={Link}
								to="/menu"
								href="/menu"
								className="text-warning mx-2"
							>
								Cardápio
							</Nav.Link>
						</Nav.Item>
						{user && (user.userType === 1 || user.userType === 2) ?
							<Nav.Item>
								<Nav.Link
									as={Link}
									to="/additions"
									href="/additions"
									className="text-warning mx-2"
								>
									Adições
								</Nav.Link>
							</Nav.Item>
							:
							null
						}
						<Nav.Item>
							<Nav.Link
								as={Link}
								to="/about"
								href="/about"
								className="text-warning mx-2"
							>
								Sobre
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								as={Link}
								className="text-warning mx-2"
								to="/rating"
								href="/rating"
							>
								Avaliações
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								as={Link}
								className="text-warning mx-2"
								to="#"
								href="#"
								onClick={() => setModalTimetable(true)}
							>
								Horário de Funcionamento
							</Nav.Link>
						</Nav.Item>
					</Nav>
					<Nav className="ml-auto">
						{order.products && order.products.length ?
							<Nav.Item>
								<Nav.Link
									as={Link}
									to="/finishOrder"
									href="/finishOrder"
									className="text-warning mx-2"
								>
									<RiShoppingBasketLine size="25" />
								</Nav.Link>
							</Nav.Item>
							:
							null
						}
						{!userId ?
							<>
								<Nav.Item>
									<Nav.Link
										as={Link}
										to="/login"
										href="/login"
										className="text-warning mx-2"
									>
										Entrar
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link
										as={Link}
										to="/signup"
										href="/signup"
										className="text-warning mx-2"
									>
										Cadastrar
									</Nav.Link>
								</Nav.Item>
							</>
							:
							<>
								{user.userType === 0 ?
									<Nav.Item>
										<Nav.Link
											as={Link}
											to="/order"
											href="/order"
											className="text-warning mx-2"
										>
											Meus Pedidos
										</Nav.Link>
									</Nav.Item>
									:
									null
								}
								<Nav.Item>
									<Nav.Link
										as={Link}
										to="/user"
										href="/user"
										className="text-warning mx-2"
									>
										Perfil
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link
										as={Link}
										to="#"
										href="#"
										onClick={handleLogout}
										className="text-warning mx-2"
									>
										Sair
									</Nav.Link>
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
							disabled
						>
							Aberto agora
						</Button>
						:
						<Button
							variant="danger"
							disabled
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