//	Importing React main module and its features
import React from "react";

//	Importing React Bootstrap features
import { Container, Spinner } from "react-bootstrap";

//	Exporting resource to routes.js
export default function Loading() {
	return (
		<Container className="d-flex h-100">
			<Spinner className="m-auto" style={{width: "8rem", height: "8rem"}} animation="border" variant="warning" />
		</Container>
	);
}