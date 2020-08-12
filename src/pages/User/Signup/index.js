//	Importing React main module and its features
import React, { useState, useMemo} from "react";

// Importing backend api
import api from '../../../services/api';

//	Importing React Router features
import { useHistory } from "react-router-dom";

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
  
	return (
    <div className="container d-flex h-100">
      <div className="col-md-4 px-0 mt-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
        </form>
      </div>
    </div>
	);
}