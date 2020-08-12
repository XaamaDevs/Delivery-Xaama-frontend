//	Importing React main module and its features
import React, { useState, useMemo} from "react";

// Importing backend api
import api from '../../../services/api';

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import { Modal } from "react-bootstrap";

// Importing styles
import "./styles.css";

// Importing image from camera
import camera from "../../../assets/camera.svg";

//	Exporting resource to routes.js
export default function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  const history = useHistory();

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData();
    const user_id = localStorage.getItem('userId');

    data.append('name', name);
    data.append('email', email);
    data.append('password', password);
    data.append('passwordC', passwordC);
    data.append('thumbnail', thumbnail);

    try {
      const response = await api.post('/user', data);
      sessionStorage.setItem("userId", response.data._id);
      history.push('/menu');
    } catch(error) {
      alert(error);
    }
  }

  if(!sessionStorage.getItem("userId")) {
    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="group">
          <div className="divA">
            <span>Foto de perfil</span>
            <label
              id="thumbnail"
              style={{ backgroundImage: `url(${preview})` }}
              className={thumbnail ? 'has-thumbnail' : ''}
            >
              <input
                type="file"
                onChange={event => setThumbnail(event.target.files[0])}
              />
              <img src={camera} alt="Selecione sua imagem" />
            </label>
          </div>

          <div className="divLateral" >
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input 
                type="text"
                className="form-control" 
                id="name" 
                placeholder="Seu nome"
                value={name} 
                onChange={event => setName(event.target.value)}
                required
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
          </div>
          </div>
        </form>
      </div>
    );
  } else {
    return (
			<Modal show={true}>
				<Modal.Header>
					<Modal.Title>Aviso</Modal.Title>
				</Modal.Header>
				<Modal.Body>Você já está logado!</Modal.Body>
				<Modal.Footer>
					<Link className="btn btn-primary" to="/">
						<small>Fechar</small>
					</Link>
				</Modal.Footer>
			</Modal>
		);
  }
}