//	Importing React main module and its features
import React from "react";

//	Importing React Bootstrap features
import { Container, Spinner } from "react-bootstrap";

//	Exporting resource to routes.js
export default function Loading() {
	return (
		<Container className="d-flex h-100">
			<Spinner className="h-50 m-auto" animation="border" variant="warning" />
		</Container>
	);
}