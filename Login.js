import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Button, Form } from "react-bootstrap";
import { Auth, API} from "aws-amplify";
import { Spinner } from '@chakra-ui/react'
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'
import OtpInput from 'react-otp-input';

const checkLogin = async () => {
    
    try {
      const data = await Auth.currentAuthenticatedUser()
      .then((res) => {
        console.log(res)
        setIsAuthenticated(true);
      })
    } catch {
      // User not logged in
      setIsAuthenticated(false)
      
    }
  }
  useEffect(()=>{
    checkLogin();
  })
  

const Login = (props) => {
  const [validate, setValidate] = useState(false);
  const [user, setUser] = useState({})
  return (
    (!validate ? 
      <SignIn setAuth={setValidate} user={user} setUser={setUser}/>
      :
      <Validate setIsAuthenticated={props.setIsAuthenticated} setAuth={setValidate} user={user} setUser={setUser}/>
    )
  )
}


const SignIn = (props) => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
      console.log(e.target.value.toString())
      console.log(error);
    }
  
    const handleSubmit = async (e) => {
        setIsLoading(true);
      e.preventDefault();
  
      try {
        // const promise = await Auth.signIn(email)

        const promise = await Auth.signUp({
            username: email,
            password: Date.now().toString()
          })
        .then((res) =>{
            console.log(res);
            props.setAuth(true);
            props.setUser(res);
            
        })
      } catch(e) {
        console.log(e);
        try{
            const trust = await Auth.signIn(email)
            .then((res) =>{
                console.log(res);
                props.setAuth(true);
                props.setUser(res);
            })
        }catch(e){
            console.log(e)
        }
      }

    };
  
    return (
      <Container style={{ maxWidth: 800, alignItems:"center" }} className="mt-5">
        <h2 className="text-center display-4 fw-bold pb-2">Sign In</h2>
        <Form>
          <FloatingLabel
            controlId="floatingInput"
            label="Enter Email Address"
            className="text-secondary"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"25%", width:"50%"}}
          >
            <Form.Control
              placeholder="Enter Email Address"
              onChange={handleEmailChange}
            />
          </FloatingLabel>
  
          <Button
            disabled={isLoading}
            size="lg"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"25%", width:"50%"}}
            className="mt-2 btn-success"
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner size="lg"/> : "Sign In" }
          </Button>
        </Form>
        
      </Container>
    );
  };


const Validate = (props) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [code, setCode] = useState(0);
  const [error, setError] = useState(false);


  const handleCodeChange = (e) => {
    setCode(e);
    console.log(e);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (var i = 0; i < 3; i ++){
      try {
        const cognitoUser = await Auth.sendCustomChallengeAnswer(props.user, code)
        .then((res) => {
          console.log(res);
          setIsLoading(true);
          props.setIsAuthenticated(true);
        })
      } catch(e) {
        console.log(e);
        setIsLoading(false);
        setError("Invalid OTP Code")
        setTimeout(() => {  props.setAuth(false) }, 2000);
        // Handle 3 error thrown for 3 incorrect attempts. 
      }    
    }
    
  };

  return (
    <Container style={{ maxWidth: 800, alignItems:"center" }} className="mt-5">
        <h2 className="text-center display-4 fw-bold pb-2">Sign In</h2>
        <h5 className="text-center">Enter the OTP Code sent to your email</h5>
        <OtpInput
        value={code}
        onChange={handleCodeChange}
        numInputs={6}
        isInputNum={true}
        separator={<span>-</span>}
        containerStyle = {{marginTop:"20px", marginBottom:"10px", marginLeft:"38%", width:"50%"}}
        inputStyle = {{fontSize: "25px"}}
      />
  
          <Button
            disabled={isLoading}
            size="lg"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"25%", width:"50%"}}
            className="mt-2 btn-success"
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner size="lg"/> : "Sign In" }
          </Button>
        {error && <div className="text-center text-danger ">{error}</div>}
    </Container>
  );
};



export default Login;