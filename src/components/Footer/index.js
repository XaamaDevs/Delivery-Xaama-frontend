//	Importing React main module and its features
import React from "react";

//	Importing React Bootstrap features
import { Col } from "react-bootstrap";

//	Exporting resource to routes.js
export default function Footer() {
	return (
		<div className="d-flex justify-content-center align-items-end flex-row flex-wrap text-light mt-auto py-1">
			<Col className="text-center p-0 m-0" sm={"auto"}>
				Copyright &#169; {` ${(new Date()).getFullYear()} |`}
			</Col>
			<Col className="text-center p-0 m-0 ml-1" sm={"auto"}>
				{"Criado por "}
			</Col>
			<Col className="text-center p-0 m-0 ml-1" sm={"auto"}>
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
		</div>
	);
}
