//	Importing React main module and its features
import React from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { Link } from "react-router-dom";

//	Importing React Bootstrap features
import { Jumbotron, Carousel, Image } from "react-bootstrap";

//	Exporting resource to routes.js
export default function Home({ companyInfo }) {
	//  Deleting recaptcha
	document.getElementById("recaptcha-key") ? 	document.getElementById("recaptcha-key").remove() : null;
	var element = document.getElementsByClassName("grecaptcha-badge")[0];
	element && element.parentNode ? element.parentNode.removeChild(element) : null;


	return (
		<div className="d-flex flex-row flex-wrap align-items-center my-auto">
			<Jumbotron className="col-sm mr-4 p-0 pl-5 bg-transparent">
				<h1 className="display-5 font-italic text-white">Está com fome?</h1>
				<h1 className="display-1 text-white">Não espere!</h1>
				<p className="font-italic text-warning">Faça seu pedido agora</p>
				<hr className="my-3"/>
				<p className="lead">
					<Link
						to="/menu"
						className="btn btn-outline-light btn-sm p-1">
						Veja o Cardápio
					</Link>
				</p>
			</Jumbotron>
			{companyInfo.carousel_urls ?
				<Carousel className="col-sm-5 m-auto px-5">
					{companyInfo.carousel_urls.map((url, index) => (
						<Carousel.Item key={index}>
							<Image
								className="w-100"
								src={process.env.REACT_APP_API_URL + url}
								alt={"Slide " + (index+1)}
								fluid
							/>
						</Carousel.Item>
					))}
				</Carousel>
				:
				null
			}
		</div>
	);
}

Home.propTypes = {
	companyInfo : PropTypes.object.isRequired
};