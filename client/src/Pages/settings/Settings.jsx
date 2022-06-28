import './settings.css';
import Topbar from '../../Components/topbar/Topbar';
import './settings.css'
import { useState } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import toast,{ Toaster } from 'react-hot-toast';


const Settings = () => {   
    
    var access_token = sessionStorage.getItem("accessToken")
    var userId = null;
    var realUsername = '';
    var profilePicture = null;
    var email = null;
    var isUser = false;
   
    if(access_token){
        var decoded = jwt_decode(access_token);
        if(decoded._doc){
        decoded = decoded._doc;
        }
        userId = decoded._id;
        realUsername = decoded.username;
        profilePicture = decoded.profilePicture;
        email = decoded.email;
        isUser = true;
    };
    const [updatedUsername, setUsername] = useState(realUsername);
    const [password, setPassword] = useState("");

    const submitUpdate = async() => {
        if(isUser && (realUsername !== updatedUsername || password)){
            try{
                var body = null;
                if(password){
                    body = {
                        username: updatedUsername,
                        password: password,
                    }
                }
                else{
                    body = {
                        username: updatedUsername,
                    }}
            
                const response = await axios.put(`http://localhost:8000/api/user/${userId}`, body, {withCredentials:true});
                sessionStorage.setItem("accessToken", response.data.access_token);
                toast.success("Credentials Updated Successfully!!", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            catch(err){
                toast.error("Problem while updating the credentials", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        }}
        else{
            toast.error("Please do register or if registered, try to update something", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
        
    return(
        <div className="setting" >
            <Topbar profilePicture={profilePicture} isUser={realUsername?true:false}/>
            <Toaster/>
            <div className='form-setting-wrapper'>
                <div className='form-setting'>
                    <h2>Profile</h2>
                    <img src="" alt='' className='profilePicture'
                    />
                    <label htmlFor="inputFile">
                        <i className='settingicons fa fa-upload'></i>
                    </label>
                    <input type="file" id="inputFile" style={{display: "none"}}/>
                    <input className='setting-input' value={email} readOnly
                        placeholder='Email'
                    />
                    <input className='setting-input' value={updatedUsername} 
                        onChange={e=>{setUsername(e.target.value)}}
                        placeholder="Username"
                    />
                    <input className='setting-password' value={password} 
                        onChange={e=>{setPassword(e.target.value)}} 
                        placeholder="password"
                    /> 
                    <button className='setting-button' 
                        onClick={submitUpdate}
                        >
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
    
}


export default Settings 