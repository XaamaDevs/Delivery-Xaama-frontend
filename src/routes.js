//	Importing React main module
import React from "react";

//	Importing Route features to manage app routes
import { BrowserRouter, Route, Switch } from "react-router-dom";

//	Importing all app pages
import HomePage from "./pages/Website/Home";
import NotFoundPage from "./pages/Website/NotFound";
import Navbar from "./pages/Website/Navbar";
import User from "./pages/User";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";

//	Exporting Routes do App.js
export default function Routes() {
	return (
		<BrowserRouter>
			<Navbar />
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/404" component={NotFoundPage} />
				<Route exact path="/user" component={User} />
				<Route exact path="/user/login" component={Login} />
				<Route exact path="/user/signup" component={Signup} />
				<Route path="*" component={NotFoundPage} />
			</Switch>
		</BrowserRouter>
	);
}