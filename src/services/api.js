//	Importing axios main module to connect frontend to backend
import axios from "axios";

//	Exporting connection to backend
export default axios.create({
	baseURL: "https://delivery-xaama-backend.herokuapp.com/"
});