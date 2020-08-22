//	Importing React main module
import React, {useState, useEffect} from "react";

//	Importing Route features to manage app routes
import { BrowserRouter, Route, Switch } from "react-router-dom";

//	Importing all app pages
import HomePage from "./pages/Website/Home";
import NotFoundPage from "./pages/Website/NotFound";
import Navbar from "./pages/Website/Navbar";
import Loading from "./pages/Website/Loading";
import User from "./pages/User";
import AllUsers from "./pages/User/All";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Additions from "./pages/Additions";
import Order from "./pages/Order";
import AllOrders from "./pages/Order/All";
import Menu from "./pages/Menu";
import Auth from "./pages/Website/Authentication";
import Autho from "./pages/Website/Authentication/Authorization";

//	Importing api to communicate to backend
import api from "./services/api";

//	Exporting Routes do App.js
export default function Routes() {
	//	User state variables
	const userId = sessionStorage.getItem("userId");
	const [user, setUser] = useState({});

	//	Loading state variable
	const [isLoading, setLoading] = useState(true);

	//	Fetching current user data
	useEffect(() => {
		async function fetchData() {
			if(userId) {
				api.get("user/" + userId)
					.then((response) => {
						if(response && response.data) {
							setUser(response.data);
						}
						setLoading(false);
					});
			} else {
				setLoading(false);
			}
		}

		fetchData();
	}, [userId]);

	function adminAuth() {
		return (user && (user.userType === 1));
	}

	function managerAuth() {
		return (user && (user.userType === 1 || user.userType === 2));
	}

	if(isLoading) {
		return (<Loading />);
	}

	return (
		<BrowserRouter>
			<Navbar />
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/order" component={Order} />
				<Route exact path="/menu" component={Menu} />
				<Route 
					exact path="/user" 
					render={() => userId ? <User /> : <Auth />}
				/>
				<Route 
					exact path="/additions" 
					render={() => userId ? (managerAuth() ? <Additions /> : <Autho />) : <Auth />}
				/>
				<Route 
					exact path="/allorders" 
					render={() => userId ? (managerAuth() ? <AllOrders /> : <Autho />) : <Auth />}
				/>
				<Route 
					exact path="/allusers" 
					render={() => userId ? (adminAuth() ? <AllUsers /> : <Autho />) : <Auth />}
				/>
				<Route path="*" component={NotFoundPage} />
			</Switch>
		</BrowserRouter>
	);
}