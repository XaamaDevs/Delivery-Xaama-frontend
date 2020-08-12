//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Exporting resource to routes.js
export default function Home() {
	return (
		<div className="website-container d-flex flex-row align-items-center m-0 p-0 h-100">
			<div className="jumbotron col-6 ml-5 mt-5 p-3 pl-5 bg-transparent">
				<h1 className="display-5 font-italic text-white">Está com fome?</h1>
				<h1 className="display-1 text-white">Não espere!</h1>
				<p className="font-italic text-warning">Faça seu pedido agora</p>
				<hr className="my-3"/>
				<p className="lead">
					<Link 
						to="/menu" 
						className="btn btn-outline-light btn-sm bg-transparent p-1">
						Veja o Cardápio
					</Link>
				</p>
			</div>
			<div id="carouselExampleControls" className="carousel slide m-auto" data-ride="carousel">
				<div className="carousel-inner">
					<div className="carousel-item active">
						<img className="w-100" src="https://cdn.iconscout.com/icon/free/png-256/fast-food-1851561-1569286.png" alt="First slide"/>
					</div>
					<div className="carousel-item">
						<img className="w-100" src="https://gormansfamilyfood.com/files/2020/04/003-drink.png" alt="Second slide"/>
					</div>
					<div className="carousel-item">
						<img className="w-100" src="https://plazaoaxacallc.com/files/2019/06/001_taco.png" alt="Third slide"/>
					</div>
				</div>
				<a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
					<span className="carousel-control-prev-icon" aria-hidden="true"></span>
					<span className="sr-only">Previous</span>
				</a>
				<a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
					<span className="carousel-control-next-icon" aria-hidden="true"></span>
					<span className="sr-only">Next</span>
				</a>
			</div>
		</div>
	);
}