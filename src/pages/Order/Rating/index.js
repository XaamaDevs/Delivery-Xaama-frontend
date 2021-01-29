//	Importing React main module and its features
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

//	Importing React features
import { Button, Row, Col, Modal, Image, Card, CardDeck } from "react-bootstrap";

//	Importing website utils
import Alert from "../../../components/Alert";
import Push from "../../../components/Push";
import Loading from "../../../components/Loading";

// Importing backend api
import api from "../../../services/api";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Importing Material-ui features
import Rating from "@material-ui/lab/Rating";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";

//	Exporting resource to routes.js
export default function Ratings({ userId, user }) {
	// Ratings variables
	const [ratings, setRatings] = useState([]);
	const [ratingId, setRatingId] = useState("");

	//	Modal settings
	const [isLoading, setIsLoading] = useState(true);
	const [toastShow, setToastShow] = useState(false);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [modalApprovedRating, setModalApprovedRating] = useState(false);
	const [modalDeleteRating, setModalDeleteRating] = useState(false);
	const [modalAlert, setModalAlert] = useState(false);

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
		async function verifyRatingThumbnail(response) {
			var data = [];

			for(var rating of response.data) {
				await fetch(process.env.REACT_APP_API_URL + rating.thumbnail_url).then((response) => {
					if(response && response.status && response.status === 200) {
						data.push(rating);
					} else if(response && response.status && response.status === 404) {
						rating.thumbnail = "";
						rating.thumbnail_url = "";
						data.push(rating);
					}
				}).catch(() => {
					rating.thumbnail = "";
					rating.thumbnail_url = "";
					data.push(rating);
				});
			}
			setRatings(data);
			setIsLoading(false);
		}

		async function fetchData() {
			await api.get("ratingAll")
				.then((response) => {
					if(response.status === 200) {
						verifyRatingThumbnail(response);
					}
				}).catch((error) => {
					setTitle("Erro!");
					if(error.response && error.response.status === 400) {
						setMessage(error.response.data);
						setToastShow(true);
					} else if(error.response && error.response.status === 404) {
						setRatings([]);
					} else if(error.response && error.response.status === 500) {
						setMessage(error.message);
						setToastShow(true);
					} else {
						setMessage("Algo deu errado :(");
						setToastShow(true);
					}
				});
		}

		fetchData();
	}, []);

	async function handleApprovedRating(event) {
		event.preventDefault();

		await api.put("rating/" + ratingId, {}, {
			headers : {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 200) {
				setModalApprovedRating(false);
				setTitle("Aprovação de avaliação");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	async function handleDeleteRating(event) {
		event.preventDefault();

		await api.delete("rating/" + ratingId, {
			headers : {
				"x-access-token": userId
			}
		}).then((response) => {
			if(response.status === 200) {
				setModalDeleteRating(false);
				setTitle("Remoção de avaliação");
				setMessage(response.data);
				setModalAlert(true);
			}
		}).catch((error) => {
			setTitle("Erro!");
			if(error.response && error.response.status === 400) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 404) {
				setMessage(error.response.data);
			} else if(error.response && error.response.status === 500) {
				setMessage(error.message);
			} else {
				setMessage("Algo deu errado :(");
			}
			setToastShow(true);
		});
	}

	return (
		<>
			{isLoading ?
				<Loading animation="grow" />
				:
				<CardDeck className="mx-3">
					<Row xs={1} sm={2} md={3} className="d-flex justify-content-around m-auto w-100" >
						{ratings && ratings.length ?
							ratings.map(rating => (
								(!userId && rating.approved) ||
								(userId && userId.length && user && (user.userType === 0) && rating.approved) ||
								(userId && userId.length && user && ((user.userType === 1) || user.userType === 2)) ?
									<Col key={rating._id} className="my-2" >
										<Card text="white" bg="dark">
											<Card.Header>
												<Row>
													<Col className="d-flex flex-wrap align-items-center" sm="3">
														<Image
															className="w-100"
															style={{ borderRadius: "50%" }}
															alt="thumbnail"
															src={rating.thumbnail_url ? process.env.REACT_APP_API_URL + rating.thumbnail_url : camera}
															fluid
														/>
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
														{!rating.approved ?
															<Button
																className="my-1"
																variant="warning"
																size="sm"
																onClick ={() => { setRatingId(rating._id); setModalApprovedRating(true); }}
															>
																Aprovar
															</Button>
															:
															null
														}

														<Button
															className="my-1"
															variant="danger"
															size="sm"
															onClick={() => { setRatingId(rating._id); setModalDeleteRating(true); }}
														>
															Apagar
														</Button>
													</Row>
													:
													null
												}
											</Card.Body>
										</Card>
									</Col>
									:
									null
							))
							:
							<h1 className="display-4 text-center text-white m-auto p-3 w-100">
								Nenhuma avaliação no momento!
							</h1>
						}
					</Row>
				</CardDeck>
			}

			<Modal
				show={modalApprovedRating}
				onHide={() => {
					setRatingId("");
					setModalApprovedRating(false);
					setToastShow(false);
				}}
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Aprovar avaliação</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Você tem certeza que deseja aprovar esta avalição?
				</Modal.Body>
				<Modal.Footer>
					<Button
						className="my-1"
						variant="light"
						id="btn-custom"
						onClick={() => {
							setRatingId("");
							setModalApprovedRating(false);
							setToastShow(false);
						}}
					>
						Voltar
					</Button>
					<Button variant="warning" onClick={handleApprovedRating}>
						Aprovar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={modalDeleteRating}
				onHide={() => {
					setRatingId("");
					setModalDeleteRating(false);
					setToastShow(false);
				}}
			>
				<Push toastShow={toastShow} setToastShow={setToastShow} title={title} message={message} />
				<Modal.Header closeButton>
					<Modal.Title>Remover avaliação</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Você tem certeza que deseja remover esta avalição?
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="warning"
						onClick={() => {
							setRatingId("");
							setModalDeleteRating(false);
							setToastShow(false);
						}}
					>
						Voltar
					</Button>
					<Button variant="danger" onClick={handleDeleteRating}>
						Remover
					</Button>
				</Modal.Footer>
			</Modal>

			<Alert.Refresh modalAlert={modalAlert} title={title} message={message} />
		</>
	);
}

Ratings.propTypes = {
	userId : PropTypes.string,
	user : PropTypes.object
};