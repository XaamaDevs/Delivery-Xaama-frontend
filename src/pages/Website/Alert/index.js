//	Importing React main module and its features
import React from "react";
import PropTypes from "prop-types";

//	Importing React Router features
import { useHistory } from "react-router-dom";

//	Importing React features
import { Modal, Button } from "react-bootstrap";

const Alert = {
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

export default Alert;

Alert.Refresh.propTypes = {
	modalAlert : PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired
};

Alert.Close.propTypes = {
	modalAlert : PropTypes.bool.isRequired,
	setModalAlert : PropTypes.any.isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired
};