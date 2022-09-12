import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import './LoginPage.css'
import axios from 'axios';
import UserModel from '../../model/UserModel';
import { useNavigate } from "react-router-dom";
import configData from "../../config.json";


function LoginPage({ activeUser, onLogin }) {

    const [showInvalidLogin, setShowInvalidLogin] = useState(false);
    const [ form, setForm ] = useState({});
    const [ errors, setErrors ] = useState({});
    const navigate = useNavigate();
  
    
    //Go to next page when user connected
    React.useEffect(() => {
    
    if(activeUser)
      navigate("/", {replace :true});
            
    }, [activeUser]);

  //To update the state of form
  const setField = (field, value) => {
      setForm({
        ...form,
        [field]: value
      })

      // Check and see if errors exist, and remove them from the error object:
      if ( !!errors[field] ) setErrors({
          ...errors,
          [field]: null
      })

    }

    /* Checks the correctness of the form*/
    const findFormErrors = () => {
      const { email, pwd } = form
      const newErrors = {}
      
      // email errors
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(email)) newErrors.email = 'כתובת דוא"ל לא תקנית' 
      
      // password errors
      if ( !pwd || pwd === '' )
         newErrors.pwd = 'שדה חובה'
      else if ( pwd.length < 8 ) 
         newErrors.pwd = 'מינימום 8 תווים'
          
      return newErrors
  }

  /* returns user data from the database*/
   async function CheckValidUserAsync(email, pwd)
   {
    const url = configData.SERVER_URL + `AppUser/GetUser?param1=${email}&param2=${pwd}`;
    const res = await axios.get(url);
    return res;
   }
 
   /*Login event */
    function login(e) {
        e.preventDefault(); 
        
        // get our new errors
        const newErrors = findFormErrors()

        if ( Object.keys(newErrors).length > 0 ) {  // We got errors!
            setErrors(newErrors)
        }
        else 
        {                        
            const { email, pwd } = form
            let activeUser = null;

            CheckValidUserAsync(email, pwd).then((response)=> { 

                    if(response.data.AppUser.length > 0)
                    {
                        const userConnect =  new UserModel(response.data.AppUser[0])
                        activeUser = userConnect;                
                    }
                    
                    if (activeUser) {
                        onLogin(activeUser);
                    } else {
                        setShowInvalidLogin(true);
                    }
                
            }).catch(err => console.log(err), newErrors.network = "בעיות בהתחברות...", console.log(newErrors.network),  setErrors(newErrors));
        }

    }

    return (
      <Container className="p-login">
      <div className="login-container">
          <div className="col-sm-4 signup-vertical-sep"></div>
          <div className="col-sm-4 signup-vertical-sep-text">כניסה </div>
          <div className="col-sm-4 signup-vertical-sep"></div>
          {showInvalidLogin ? <Alert variant="danger">שגיאה בהזנת הנתונים</Alert> : null}
          <Form onSubmit={login}>
              <Form.Group controlId="formBasicEmail">
                  <Form.Label>דוא"ל</Form.Label>
                  <Form.Control type="email" className="dir-ltr-left"
                      onChange={e => {
                          setField('email', e.target.value)
                          setShowInvalidLogin(false)
                  }}
                      isInvalid={ !!errors.email }
                  />
                  <Form.Control.Feedback type='invalid'>
                      { errors.email }
                  </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                  <Form.Label>סיסמה</Form.Label>
                  <Form.Control type="password" className="dir-ltr-left"
                      onChange={e => {
                          setField('pwd', e.target.value)
                          setShowInvalidLogin(false)
                  }}
                      isInvalid={ !!errors.pwd }
                  />
                  <Form.Control.Feedback type='invalid'>
                      { errors.pwd }
                  </Form.Control.Feedback>                            
              </Form.Group><br/>
              <Form.Group controlId="formSubmit">
              <Button type="submit" class="btn btn-primary btn-lg btn-block">כניסה</Button>
              </Form.Group>
            {errors.network} 
          </Form>

      </div>
  </Container>
    );
}

export default LoginPage;