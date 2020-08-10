//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Exporting resource to routes.js
export default function Home() {
	return (
		<div className="website-container">
			<div className="jumbotron col-6">
				<h1 className="display-4">Hello, world!</h1>
				<p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
				<hr className="my-4"/>
				<p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
				<p className="lead">
					<a className="btn btn-primary btn-lg" href="/" role="button">Learn more</a>
				</p>
			</div>
			<div id="carouselExampleControls" className="carousel slide w-25" data-ride="carousel">
				<div className="carousel-inner">
					<div className="carousel-item active">
						<img className="d-block w-100" src="https://cdn.iconscout.com/icon/free/png-256/fast-food-1851561-1569286.png" alt="First slide"/>
					</div>
					<div className="carousel-item">
						<img className="d-block w-100" src="https://images.rappi.com.br/restaurants_background/fichips-home1-1568066123184.png?d=200x200" alt="Second slide"/>
					</div>
					<div className="carousel-item">
						<img className="d-block w-100" src="https://images.rappi.com.br/products/ab0b2948-e2c3-4069-b91f-5ac06326edec-1571417391656.png?d=128x90" alt="Third slide"/>
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