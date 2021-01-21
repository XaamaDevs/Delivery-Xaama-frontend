//	Importing React main module and its features
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Importing backend api
import api from "../../../services/api";

//	Exporting resource to routes.js
export default function Rating({ userId }) {
	const [rating, setRating] = useState([]);

	useEffect(() => {
		async function fetchData() {
			await api.get("ratingAll", {}).then((response) => {
				if(response.status === 200) {
					setRating(response.data);
				}
			});
		}

		fetchData();
	}, []);

	return (
		<>
			{console.log(rating)}
			{console.log(userId)}
		</>
	);
}

Rating.propTypes = {
	userId : PropTypes.string
};