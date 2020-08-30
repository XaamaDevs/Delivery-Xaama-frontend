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
import Logged from "./pages/Website/Authentication/Logged";

//	Importing api to communicate to backend
import api from "./services/api";

//	Exporting Routes do App.js
export default function Routes() {
	//	User state variables
	const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
	const [user, setUser] = useState({});

	//	Order state variables
	const [order, setOrder] = useState({});

	//	Loading state variable
	const [isLoading, setLoading] = useState(true);

	//	Fetching current user data
	useEffect(() => {
		async function fetchData() {
			if(userId) {
				await api.get("user/" + userId)
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
		return (user && (user.userType === 2));
	}

	function managerAuth() {
		return (user && (user.userType === 1 || user.userType === 2));
	}

	if(isLoading) {
		return (<Loading />);
	}

	return (
		<BrowserRouter>
			<Navbar userId={userId} setUserId={setUserId} user={user} setUser={setUser} />
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route 
					exact path="/order" 
					render={() => <Order userId={userId} user={user} />} 
				/>
				<Route 
					exact path="/login" 
					render={() => !userId ? <Login setUserId={setUserId} /> : <Logged />}
				/>
				<Route 
					exact path="/signup" 
					render={() => !userId ? <Signup setUserId={setUserId} setUser={setUser} /> : <Logged />}
				/>
				<Route 
					exact path="/menu" 
					render={() => <Menu userId={userId} user={user} order={order} setOrder={setOrder} />} 
				/>
				<Route 
					exact path="/user" 
					render={() => {
						return userId ? 
							<User userId={userId} setUserId={setUserId} user={user} setUser={setUser} /> : <Auth />;
					}}
				/>
				<Route 
					exact path="/additions" 
					render={() => {
						return userId ? (managerAuth() ? <Additions userId={userId} /> : <Autho />) : <Auth />;
					}}
				/>
				<Route 
					exact path="/allorders" 
					render={() => userId ? (<AllOrders userId={userId} userType={user.userType} />) : <Auth />}
				/>
				<Route 
					exact path="/allusers" 
					render={() => userId ? (adminAuth() ? <AllUsers userId={userId} /> : <Autho />) : <Auth />}
				/>
				<Route path="*" component={NotFoundPage} />
			</Switch>
		</BrowserRouter>
	);
}