//	Importing React main module
import React, {useState, useEffect} from "react";

//	Importing Route features to manage app routes
import { BrowserRouter, Route, Switch } from "react-router-dom";

//	Importing all app pages
import HomePage from "./pages/Website/Home";
import NotFoundPage from "./pages/Website/NotFound";
import About from "./pages/Website/About";
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

	//	Order state variable
	const [order, setOrder] = useState({});

	//	Company info state variable
	const [companyInfo, setCompanyInfo] = useState({});

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
					});
			}

			await api.get("company")
				.then((response) => {
					if(response && response.data) {
						setCompanyInfo(response.data);
					}
				});

			setLoading(false);
		}

		fetchData();
	}, [userId]);

	function adminAuth() {
		return (user && (user.userType === 2));
	}

	function managerAuth() {
		return (user && (user.userType === 1 || user.userType === 2));
	}

	function userAuth() {
		return (user && userId);
	}
	
	function userAndAdmin() {
		return (user && ((user._id == userId) || user.userType === 1 || user.userType === 2));
	}

	if(isLoading) {
		return (<Loading />);
	}

	return (
		<BrowserRouter>
			<Navbar 
				userId={userId} 
				setUserId={setUserId} 
				user={user} 
				setUser={setUser} 
				setOrder={setOrder}
				companyInfo ={companyInfo}
			/>
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/about" render={() => <About companyInfo={companyInfo} />} />
				<Route 
					exact path="/order" 
					render={() => {
						return userAuth() ? 
							<Order 
								userId={userId} 
								user={user} 
								order={order}
								setOrder={setOrder} 
							/> : <Auth />;
					}}
				/>
				<Route 
					exact path="/login" 
					render={() => !userAuth() ? <Login setUserId={setUserId} /> : <Logged />}
				/>
				<Route 
					exact path="/signup" 
					render={() => !userAuth() ? <Signup setUserId={setUserId} setUser={setUser} /> : <Logged />}
				/>
				<Route 
					exact path="/menu" 
					render={() => <Menu userId={userId} user={user} order={order} setOrder={setOrder} />} 
				/>
				<Route 
					exact path="/user" 
					render={() => {
						return userAuth() ? 
							<User 
								userId={userId} 
								setUserId={setUserId} 
								user={user} 
								setUser={setUser}
								companyInfo={companyInfo} 
							/> : <Auth />;
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
					render={() => userId ? (managerAuth() ? <AllOrders userId={userId} /> : <Autho />) : <Auth />}
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