//	Importing React main module and its features
import React from "react";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import { Modal, Button } from "react-bootstrap";

export default {
	Refresh: function Refresh({ modalAlert, title, message }) {
		//	Defining history to jump through pages
		const history = useHistory();

		return (
			<Modal show={modalAlert} onHide={() => history.go()}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => history.go()}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		);
	},
	Close: function Close({ modalAlert, setModalAlert, title, message }) {
		return (
			<Modal show={modalAlert} onHide={() => setModalAlert(false)}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={() => setModalAlert(false)}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
};