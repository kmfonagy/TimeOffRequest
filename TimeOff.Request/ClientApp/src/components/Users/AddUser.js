import React, { useState } from 'react';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

const AddUser = (props) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    supervisorId: null,
    role: '',
    password: '',
    disabled: false
  })

  const handleChange = (e) => {
    setUser({ user: {[e.target.name]: e.target.value }})
  }

  const handleSubmit = () => {
    console.log(this.state.user)
  }

  return (
    <Form>
      <FormGroup row>
        <Label for="email" sm={2}>Email</Label>
        <Col sm={10}>
          <Input 
            type="email"
            name="email"
            id="email"
            onChange={ handleChange }
            placeholder="Email address" />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="password" sm={2}>Password</Label>
        <Col sm={10}>
          <Input 
            type="password"
            name="password"
            id="password"
            onChange={ handleChange }
            placeholder="Password" />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="role" sm={2}>Select Role</Label>
        <Col sm={10}>
          <Input 
            type="select"
            name="role"
            id="role" 
            onChange={ handleChange }
            single>
            <option>User</option>
            <option>Administrator</option>
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={{ size: 10 }}>
          <FormGroup check>
            <Label check>
              <Input 
                type="checkbox" 
                id="disabled" 
                onChange={ handleChange }
                name= "disabled"/>{' '}
              Disabled
            </Label>
          </FormGroup>
        </Col>
      </FormGroup>
      <FormGroup check row>
        <Col sm={{ size: 10, offset: 2 }}>
          <Button onClick={ handleSubmit }>Submit</Button>
        </Col>
      </FormGroup>
    </Form>
  );
}

export default AddUser;