//	Importing React main module and its features
import React from "react";

//	Importing React Router features
import { Link } from "react-router-dom";

//	Importing React Bootstrap features
import { Jumbotron, Carousel, Image } from "react-bootstrap";

//	Exporting resource to routes.js
export default function Home() {
	return (
		<div className="website-container d-flex flex-row flex-wrap align-items-center m-0 p-0 h-100">
			<Jumbotron className="col-sm m-auto p-0 pl-5 bg-transparent">
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
			<Carousel className="col-sm-5 m-auto px-5">
				<Carousel.Item>
					<Image
						className="w-100"
						src="https://cdn.iconscout.com/icon/free/png-256/fast-food-1851561-1569286.png"
						alt="First slide"
						fluid
					/>
				</Carousel.Item>
				<Carousel.Item>
					<Image
						className="w-100"
						src="https://gormansfamilyfood.com/files/2020/04/003-drink.png"
						alt="Second slide"
						fluid
					/>
				</Carousel.Item>
				<Carousel.Item>
					<Image
						className="w-100"
						src="https://plazaoaxacallc.com/files/2019/06/001_taco.png"
						alt="Third slide"
						fluid
					/>
				</Carousel.Item>
			</Carousel>
		</div>
	);
}