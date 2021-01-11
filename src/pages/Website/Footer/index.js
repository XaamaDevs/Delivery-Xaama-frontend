//	Importing React main module and its features
import React from "react";

//	Importing React Bootstrap features
import { Col } from "react-bootstrap";

//	Exporting resource to routes.js
export default function Footer() {
	return (
		<Col className="d-flex text-light justify-content-center align-items-end my-3">
			<span>
			Copyright &#169; {" " + (new Date).getFullYear() + " | Criado por "}
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
			</span>
		</Col>
	);
}