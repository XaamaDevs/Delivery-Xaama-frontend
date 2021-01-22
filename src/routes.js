//	Importing React main module
import React, {useState, useEffect} from "react";

//	Importing Route features to manage app routes
import { BrowserRouter, Route, Switch } from "react-router-dom";

//	Importing all app pages
import HomePage from "./pages/Website/Home";
import NotFoundPage from "./pages/Website/NotFound";
import About from "./pages/Website/About";
import User from "./pages/User";
import AllUsers from "./pages/User/All";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Additions from "./pages/Additions";
import Order from "./pages/Order";
import FinishOrder from "./pages/Order/Finish";
import AllOrders from "./pages/Order/All";
import Ratings from "./pages/Order/Rating";
import Menu from "./pages/Menu";
import Cards from "./pages/Cards";
import Coupons from "./pages/Coupons";

//	Importing all app components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Auth from "./components/Authentication";
import Autho from "./components/Authentication/Authorization";
import Logged from "./components/Authentication/Logged";

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
	const [companySystemOpenByHour, setCompanySystemOpenByHour] = useState();

	//	Loading state variable
	const [isLoading, setIsLoading] = useState(true);

	//  Defining constant for manipulating the time
	const [data, setData] = useState(new Date());

	// Aux Variables
	const [noCards, setNoCards] = useState(true);

	//  Update system time every 25 minutes
	function currentTime() {
		setData(new Date());
	}
	setTimeout(currentTime, 1500000);

	//	Fetching current user data
	useEffect(() => {
		async function fetchData() {
			if(userId) {
				await api.get("user", {
					headers : {
						"x-access-token": userId
					}
				}).then((response) => {
					if(response.status === 200) {
						setUser(response.data);
					}
				}).catch(() => {
					setUser({});
					setUserId("");
				});
			}

			await api.get("company")
				.then((response) => {
					if(response.status === 200) {
						setCompanyInfo(response.data);
					}
				}).catch(() => {
					setCompanyInfo({});
				});

			setIsLoading(false);
		}

		fetchData();
	}, [userId]);

	useEffect(() => {
		if(companyInfo && companyInfo.cards) {
			companyInfo.cards.map((card) => (
				card.available ? setNoCards(false) : null
			));
		}
	}, [companyInfo]);

	function adminAuth() {
		return (user && (user.userType === 2));
	}

	function managerAuth() {
		return (user && (user.userType === 1 || user.userType === 2));
	}

	function userAuth() {
		return userId;
	}

	function orderAuth() {
		return userId && order && order.products;
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
				order={order}
				setOrder={setOrder}
				companyInfo ={companyInfo}
				companySystemOpenByHour={companySystemOpenByHour}
				setCompanySystemOpenByHour={setCompanySystemOpenByHour}
				data={data}
				setData={setData}
				noCards={noCards}
			/>
			<Switch>
				<Route exact path="/" render={() => <HomePage companyInfo={companyInfo} />} />
				<Route exact path="/about" render={() => <About companyInfo={companyInfo} />} />
				<Route
					exact path="/login"
					render={() => !userAuth() ? <Login setUserId={setUserId} setUser={setUser} /> : <Logged />}
				/>
				<Route
					exact path="/signup"
					render={() => !userAuth() ? <Signup setUserId={setUserId} setUser={setUser} /> : <Logged />}
				/>
				<Route
					exact path="/menu"
					render={() =>
						<Menu
							userId={userId}
							user={user}
							order={order}
							setOrder={setOrder}
							companyInfo={companyInfo}
							companySystemOpenByHour={companySystemOpenByHour}
						/>
					}
				/>
				<Route
					exact path="/order"
					render={() => { return userAuth() ? <Order userId={userId} companyInfo={companyInfo} /> : <Auth />; }}
				/>
				<Route
					exact path="/finishOrder"
					render={() => {
						return orderAuth() ?
							<FinishOrder
								userId={userId}
								setUserId={setUserId}
								user={user}
								setUser={setUser}
								order={order}
								setOrder={setOrder}
								companyInfo={companyInfo}
								companySystemOpenByHour={companySystemOpenByHour}
								noCards={noCards}
							/>
							: <Autho />;
					}}
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
								setCompanyInfo={setCompanyInfo}
								noCards={noCards}
							/> : <Auth />;
					}}
				/>
				<Route
					exact path="/cards"
					render={() => userId ? (adminAuth() ? <Cards companyInfo={companyInfo} userId={userId} /> : <Autho />) : <Auth />}
				/>
				<Route
					exact path="/coupons"
					render={() => userId ? (adminAuth() ? <Coupons companyInfo={companyInfo} userId={userId} /> : <Autho />) : <Auth />}
				/>
				<Route
					exact path="/additions"
					render={() => {
						return userId ? (managerAuth() ? <Additions userId={userId} /> : <Autho />) : <Auth />;
					}}
				/>
				<Route
					exact path="/allorders"
					render={() => userId ? (managerAuth() ? <AllOrders userId={userId} companyInfo={companyInfo} /> : <Autho />) : <Auth />}
				/>
				<Route
					exact path="/allusers"
					render={() => userId ? (adminAuth() ? <AllUsers userId={userId} /> : <Autho />) : <Auth />}
				/>
				<Route exact path="/rating" render={() => <Ratings userId={userId} user={user} />} />
				<Route path="*" component={NotFoundPage} />
			</Switch>
			<Footer />
		</BrowserRouter>
	);
}