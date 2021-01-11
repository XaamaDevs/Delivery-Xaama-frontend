//	Importing React main module and its features
import React from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import { Container, Row, Col, Card } from "react-bootstrap";

//	Importing React icons features
import { RiWhatsappLine, RiPhoneLine, RiMailLine } from "react-icons/ri";

//	Exporting resource to routes.js
export default function About({ companyInfo }) {
	return (
		<div className="d-flex flex-column flex-wrap justify-content-center m-0 p-0 w-100">
			<Container className="w-100">
				<Card text="light" bg="transparent">
					<Card.Header>
						<h1 className="display-5 text-center m-3">Entre em contato conosco</h1>
					</Card.Header>
					<Card.Body className="p-0">
						<Row className="text-center m-5">
							<Col sm>
								<h5 className="text-center">
									<a
										href={"tel:" + companyInfo.phone}
										className="text-white"
									>
										<Row><Col><RiPhoneLine size="50"/></Col></Row>
										<Row><Col>{companyInfo.phone}</Col></Row>
									</a>
								</h5>
							</Col>
							<Col sm>
								<h5 className="text-center">
									<a
										href={"mailto:" + companyInfo.email}
										className="text-white"
									>
										<Row><Col><RiMailLine size="50"/></Col></Row>
										<Row><Col>{companyInfo.email}</Col></Row>
									</a>
								</h5>
							</Col>
							<Col sm>
								<h5 className="text-center">
									<a
										href={"https://wa.me/+55" + companyInfo.phone}
										className="text-white"
										target="_blank"
										rel="noreferrer"
									>
										<Row><Col><RiWhatsappLine size="50"/></Col></Row>
										<Row><Col>{"Whatsapp"}</Col></Row>
									</a>
								</h5>
							</Col>
						</Row>
					</Card.Body>
					<Card.Header>
						<h1 className="display-5 text-center m-3">Nosso Endereço</h1>
					</Card.Header>
					<Card.Body className="p-0">
						<Row className="text-center m-5">
							<Col sm>
								<iframe
									width="100%"
									height="400"
									id="gmap_canvas"
									src={"https://maps.google.com/maps?q=" + companyInfo.address + "&t=&z=18&ie=UTF8&iwloc=&output=embed"}
									frameBorder="0"
									scrolling="no"
								></iframe>
							</Col>
						</Row>
					</Card.Body>
					<Card.Header>
						<Row>
							<Col className="text-center">
								Copyright &#169; {" " + (new Date).getFullYear() + " Criado por "}
								<a
									className="text-warning"
									href="https://github.com/DiegoTeixeira7"
									target="_blank"
									rel="noreferrer"
								>
									Diêgo Teixeira
								</a>
								{" e "}
								<a
									className="text-warning"
									href="https://github.com/ThiagoPereiraUFV"
									target="_blank"
									rel="noreferrer"
								>
									Thiago Pereira
								</a>
							</Col>
						</Row>
					</Card.Header>
				</Card>
			</Container>
		</div>
	);
}

About.propTypes = {
	companyInfo : PropTypes.object.isRequired
};