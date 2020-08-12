//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

// Importing styles
//import "./styles.css";

//	Exporting resource to routes.js
export default function Signup() {

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordC, setPasswordC] = useState("");
	const [thumbnail, setThumbnail] = useState(null);

	function handleSubmit() {

	}

	return (
		<div className="user-container d-flex h-100">
			<div className="col-md-3 py-3 m-auto text-white">
				<form onSubmit={handleSubmit}>
					<div className="row my-1">
						<div className="col my-1">
							<label>Email: </label>
							<input 
								type="email" 
								className="form-control" 
								name="email" 
								placeholder="email@provedor.com" 
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
					</div>
					<div className="row my-1">
						<div className="col my-1">
							<label>Senha: </label>
							<input 
								type="password" 
								className="form-control" 
								name="password" 
								placeholder="Senha" 
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>
					<div className="row my-1">
						<div className="col text-center">
							<small>Não tem conta? </small>
							<Link className="text-light" to="/signup">
								<small>Clique aqui</small>
							</Link>
							<small> para se cadastrar</small>
						</div>
					</div>
					<div className="row my-3">
						<div className="col text-center">
							<input 
								type="submit" 
								className="btn btn-warning btn-md" 
								value="Acessar"
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}