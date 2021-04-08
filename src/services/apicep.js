//	Importing axios main module to connect frontend to CEP API
import axios from "axios";

//	Exporting connection to CEP API
export default axios.create({
	"baseURL": "https://viacep.com.br/ws/"
});
