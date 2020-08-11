//	Importing React main module
import React from "react";

//	Importing Route features to manage app routes
import { BrowserRouter, Route, Switch } from "react-router-dom";

//	Importing all app pages
import HomePage from "./pages/Website/Home";
import NotFoundPage from "./pages/Website/NotFound";
import Navbar from "./pages/Website/Navbar";
import Footer from "./pages/Website/Footer";
import User from "./pages/User";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Products from "./pages/Products";
import Order from "./pages/Order";

//	Exporting Routes do App.js
export default function Routes() {
	return (
		<BrowserRouter>
			<Navbar />
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/user" component={User} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/products" component={Products} />
				<Route exact path="/order" component={Order} />
				<Route path="*" component={NotFoundPage} />
			</Switch>
		</BrowserRouter>
	);
}