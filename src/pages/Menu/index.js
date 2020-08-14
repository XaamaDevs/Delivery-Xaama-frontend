//	Importing React main module and its features
import React, { useState, useEffect } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing api to communicate to backend
import api from "../../services/api";

//	Exporting resource to routes.js
export default function Menu() {
	const [productsByType, setProductsByType] = useState({});

	//	Defining history to jump through pages
	const history = useHistory();

	//	Loading current user contacts
	useEffect(() => {
		api.get("product")
			.then((response) => {
				const products = response.data;

				api.get("productTypes")
					.then((types) => {
						if(types.data && types.data.length) {
							var prodsByType = {};
							for(var type of types.data) {
								var prods = [];

								for(var product of products) {
									if(product.type == type) {
										prods.push(product);
									}
								}
								
								prodsByType[type] = prods;
							}

							setProductsByType(prodsByType);
						} else {
							alert("Não há tipos de produtos cadastrados");
						}
					}).catch((error) => {
						if (error.response) {
							alert(error.response.data);
						} else {
							alert(error);
						}
					});
			}).catch((error) => {
				if (error.response) {
					alert(error.response.data);
				} else {
					alert(error);
				}

				history.push("/");
			});
	}, [history]);

	return (
		<div>
			{Object.entries(productsByType).map(([type, products]) => (
				type
			))}
		</div>
	);
	/*
	return (
		<div className="product-container">
			{productsByType.map((type) => (
				type.map((products) => (
					<ul key="">
						{products ?
							products.map((product) => (
								<div key={product._id}>
									<li>{product.name}</li>
									<li>
										Ingredientes:
										{product.ingredients.map((ingredient) => (
											<li key="">{ingredient}</li>
										))}
									</li>
									<li>
										{product.prices.length == 1 ?
											<div>
												Preço:
												<li>{product.prices}</li>
											</div>
											:
											<div>
												Preços:
												{product.prices.map((price) => (
													<li key="">{price}</li>
												))}
											</div>
										}
									</li>
									<li>{product.type}</li>
								</div>
							))
							:
							null
						}
					</ul>
				))
			))}
		</div>
	);
	*/
	
}