//	Importing React main module and its features
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Importing backend api
import api from "../../../services/api";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing React features
import { Button, Row, Col, Spinner, Container, Image, Card, CardDeck } from "react-bootstrap";

//	Importing Material-ui features
import Rating from "@material-ui/lab/Rating";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";

//	Exporting resource to routes.js
export default function Ratings({ userId, user }) {
	const [ratings, setRatings] = useState([]);

	//	Modal settings
	const [isLoading, setIsLoading] = useState(true);

	const customIcons = {
		1: {
			icon: <SentimentVeryDissatisfiedIcon />,
			label: "Very Dissatisfied",
		},
		2: {
			icon: <SentimentDissatisfiedIcon />,
			label: "Dissatisfied",
		},
		3: {
			icon: <SentimentSatisfiedIcon />,
			label: "Neutral",
		},
		4: {
			icon: <SentimentSatisfiedAltIcon />,
			label: "Satisfied",
		},
		5: {
			icon: <SentimentVerySatisfiedIcon />,
			label: "Very Satisfied",
		},
	};

	function IconContainer(props) {
		const { value, ...other } = props;
		return <span {...other}>{customIcons[value].icon}</span>;
	}

	IconContainer.propTypes = {
		value: PropTypes.number.isRequired,
	};

	useEffect(() => {
		async function fetchData() {
			await api.get("ratingAll", {}).then((response) => {
				if(response.status === 200) {
					setRatings(response.data);
				}
			});
			setIsLoading(false);
		}

		fetchData();
	}, []);

	return (
		<>
			{isLoading ?
				<Container className="d-flex h-100">
					<Spinner
						className="my-5 mx-auto"
						style={{width: "5rem", height: "5rem"}}
						animation="grow"
						variant="warning"
					/>
				</Container>
				:
				<CardDeck className="mx-3">
					<Row xs={1} sm={2} md={3} className="d-flex justify-content-around m-auto w-100" >
						{ratings.map(rating => (
							<Col key={rating._id} className="my-2">
								<Card text="white" bg="dark">
									<Card.Header>
										<Row>
											<Col className="d-flex flex-wrap align-items-center" sm="3">
												<Image
													className="w-100"
													style={{ borderRadius: "50%" }}
													src={rating.thumbnail ? process.env.REACT_APP_API_URL + rating.thumbnail_url: camera }
													alt="thumbnail"
													fluid
												/>
												{console.log(rating.thumbnail_url)}
											</Col>
											<Col className="ml-3">
												<Row>
													<strong>{rating.name ? rating.name : ""}</strong>
												</Row>
												<Row className="my-1">
													<Rating
														name="customized-icons"
														value={rating.stars ? rating.stars : 0}
														getLabelText={(value) => customIcons[value].label}
														IconContainerComponent={IconContainer}
													/>
												</Row>
											</Col>
										</Row>
									</Card.Header>
									<Card.Body>
										<Card.Text>
											{rating.feedback ? rating.feedback : ""}
										</Card.Text>

										{userId && userId.length && user && user.userType != 0 ?
											<Row className="d-flex justify-content-around flex-wrap mx-auto">
												<Button
													className="my-1"
													variant="warning"
													size="sm"
													//onClick ={() => {  }}
												>
													Aprovar
												</Button>
											
												<Button
													className="my-1"
													variant="danger"
													size="sm"
													//onClick={() => {  }}
												>
													Deletar
												</Button>
											</Row>
											:
											null
										}
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</CardDeck>
			}
		</>
	);
}

Ratings.propTypes = {
	userId : PropTypes.string,
	user : PropTypes.object
};