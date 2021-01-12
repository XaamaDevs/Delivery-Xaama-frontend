//	Importing axios main module to connect frontend to backend
import axios from "axios";

//	Exporting connection to CEP API
export default axios.create({
	baseURL: "https://viacep.com.br/ws/"
});