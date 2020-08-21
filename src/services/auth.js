//	Importing api to communicate to backend
import api from "./api";

//	Exporting resource to routes.js
export default {
	auth: () => {
		const userId = sessionStorage.getItem("userId");
		
		if(userId) {
			return true;
		} else {
			return false;
		}
	},
	admin: () => {
		const userId = sessionStorage.getItem("userId");

		api.get("user/" + userId)
			.then((response) => {
				if(response && response.data && response.data.userType === 2) {
					return true;
				} else {
					return false;
				}
			});
	},
	manager: () => {
		const userId = sessionStorage.getItem("userId");

		api.get("user/" + userId)
			.then((response) => {
				if(response && response.data && (response.data.userType === 1 || response.data.userType === 2)) {
					return true;
				} else {
					return false;
				}
			});
	}
};