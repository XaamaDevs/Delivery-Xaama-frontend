//	Importing React main module
import React from "react";

//	Importing Route features to manage app routes
import { BrowserRouter, Route, Switch } from "react-router-dom";

//	Importing all app pages
import HomePage from "./pages/Website/Home";
import NotFoundPage from "./pages/Website/NotFound";
import Navbar from "./pages/Website/Navbar";
import User from "./pages/User";
import AllUsers from "./pages/User/All";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Additions from "./pages/Additions";
import Order from "./pages/Order";
import AllOrders from "./pages/Order/All";
import Menu from "./pages/Menu";

//	Exporting Routes do App.js
export default function Routes() {
	return (
		<BrowserRouter>
			<Navbar />
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/user" component={User} />
				<Route exact path="/allusers" component={AllUsers} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/order" component={Order} />
				<Route exact path="/menu" component={Menu} />
				<Route exact path="/allorders" component={AllOrders} />
				<Route exact path="/additionals" component={Additions} />
				<Route path="*" component={NotFoundPage} />
			</Switch>
		</BrowserRouter>
	);
}