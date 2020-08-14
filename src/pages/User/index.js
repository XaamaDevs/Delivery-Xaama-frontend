//	Importing React main module and its features
import React, { useState } from "react";

//	Importing React Router features
import { Link, useHistory } from "react-router-dom";

//	Importing React features
import Image from 'react-bootstrap/Image';
import { Container, Card, ListGroup, Col, Row, Button } from "react-bootstrap";

import image from "../../assets/background2.jpg";

//	Exporting resource to routes.js
export default function User() {
	return (
		<div className="user-container h-100">
      <div className="d-flex flex-row flex-wrap h-100">
        <div className="d-flex col-sm-1 flex-column m-auto p-3">
         <Image src={image} fluid />
        </div>
        <div className="col-sm-4 m-auto p-3">
          <Card style={{ width: "18rem" }}>
            <Card.Header>Diego</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>diego.t.queiroz@gmail.com</ListGroup.Item>
              <ListGroup.Item>(32) 9 9948-2731</ListGroup.Item>
              <ListGroup.Item>Rua padre Serafim - 128</ListGroup.Item>
            </ListGroup>
          </Card>
        </div>
      </div>
      <Button variant="outline-warning">Editar perfil</Button>{" "}
      <Button variant="outline-danger">Apagar perfil</Button>
    </div>
	);
}