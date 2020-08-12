//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

// Importing styles
import "./styles.css";

//	Exporting resource to routes.js
export default function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  function handleSubmit() {

  }

	return (
    <div className="container">
      <div className="col-md-4 px-0">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input type="text" className="form-control" id="name" placeholder="Seu nome"
              required value={name} onChange={event => setName(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Seu email" 
              required value={email} onChange={event => setEmail(event.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" className="form-control" id="password" placeholder="Senha" 
              required value={password} onChange={event => setPassword(event.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="passwordC">Confirmar Senha</label>
            <input type="password" className="form-control" id="passwordC" placeholder="Confirme sua senha"
              required value={passwordC} onChange={event => setPasswordC(event.target.value)}/>
          </div>
          <button type="submit" className="btn mt-2">Cadastrar</button>
        </form>
      </div>
    </div>
	);
}