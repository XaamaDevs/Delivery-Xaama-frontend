//	Importing React main module and its features
import React from "react";
import PropTypes from "prop-types";

//	Importing React features
import { Toast } from "react-bootstrap";

export default function Push({ toastShow, setToastShow, title, message }) {
	return (
		<div
			aria-live="polite"
			aria-atomic="true"
			style={{
				position: "fixed",
				bottom: "1%",
				right: "1%",
				zIndex: "5"
			}}
		>
			<Toast show={toastShow} onClose={() => setToastShow(false)} delay={3000} autohide>
				<Toast.Header>
					<strong className="mr-auto">{title}</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>
	);
}

Push.propTypes = {
	toastShow: PropTypes.bool.isRequired,
	setToastShow: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired
};
