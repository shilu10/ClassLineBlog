import { GoogleLogin } from 'react-google-login';
import './loginbutton.css';

const clientId = "418020920930-a54a5d5a26c9guqk0eh4cucrqd057gda.apps.googleusercontent.com";

const onSuccess = (res) =>{
    console.log("succes", res.profileObj, res)
}

const onFailure = (err) =>{
    console.log("err", err)
}

const LoginButton = () => {
    return(
        <div className='login-button'>
            <GoogleLogin 
                client_id={clientId}
                onSuccess={onSuccess}
                buttonText="Continue with Google"
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                style={{style: "none"}}
                className="login-button-oauth"
            />
        </div>
    )
}
export default LoginButton;