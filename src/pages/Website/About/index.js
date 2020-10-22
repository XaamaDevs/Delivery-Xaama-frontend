//	Importing React main module and its features
import React from "react";
import PropTypes from "prop-types";

//	Importing React Bootstrap features
import { Container, Row, Col, Card } from "react-bootstrap";

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
										className="text-white">
										{companyInfo.phone}
									</a>
								</h5>
							</Col>
							<Col sm>
								<h5 className="text-center">
									<a
										href={"mailto:" + companyInfo.email}
										className="text-white">
										{companyInfo.email}
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
								<a
									href={"https://www.google.com/maps/search/" + companyInfo.address}
									target="_blank"
									rel="noopener noreferrer"
									className="text-white"
								>
									<h5 className="text-center">{companyInfo.address}</h5>
									<p className="m-0">(Clique para abrir o Google Maps)</p>
								</a>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
}

About.propTypes = {
	companyInfo : PropTypes.object.isRequired
};