import { GoogleLogout } from "react-google-login";

const clientId = "418020920930-a54a5d5a26c9guqk0eh4cucrqd057gda.apps.googleusercontent.com";

const onLogoutSuccess = () => {
    console.log("logout success")
}

const Logout = () =>{
    return(
        <div className="logout-button">
            <GoogleLogout
                client_id={clientId}
                buttonText="Logout"
                onLogoutSuccess={onLogoutSuccess}
            />
        </div>
    )

}

export default Logout;