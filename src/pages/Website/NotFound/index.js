//	Importing React main module and its features
import React from "react";

//	Importing React Router features
import { Link } from "react-router-dom";

//	Importing React Bootstrap features
import { Jumbotron } from "react-bootstrap";

//	Exporting resource to routes.js
export default function NotFound() {
	return (
		<div className="website-container d-flex flex-row flex-wrap align-items-center m-0 p-0 h-100">
			<Jumbotron className="col-sm ml-3 p-3 bg-transparent">
				<h1 className="display-5 font-italic text-white">Erro 404</h1>
				<h1 className="display-1 text-white">Página não encontrada</h1>
				<p className="font-italic text-warning">O conteúdo que você está procurando não existe</p>
				<hr className="my-3"/>
				<p className="lead">
					<Link
						to="/"
						className="btn btn-outline-light btn-sm p-1"
					>
						Voltar para o início
					</Link>
				</p>
			</Jumbotron>
		</div>
	);
}