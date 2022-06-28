import './settings.css';
import Topbar from '../../Components/topbar/Topbar';
import './settings.css'
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import toast,{ Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { pictureActions } from '../../Components/store/store';

const Settings = () => {   
    const profilePicture = useSelector((state)=>state.pictureReducer.profilePicture);
    const dispatch = useDispatch();
    var access_token = sessionStorage.getItem("accessToken");
    var userId = null;
    var realUsername = '';
    
    console.log(profilePicture, "in setting")
    var email = null;
    var isUser = false;

    if(access_token){
        var decoded = jwt_decode(access_token);
        if(decoded._doc){
        decoded = decoded._doc;
        }
        userId = decoded._id;
        realUsername = decoded.username;
        email = decoded.email;
        isUser = true;
    };
    const [updatedUsername, setUsername] = useState(realUsername);
    const [password, setPassword] = useState("");
    const [imageFile, setImageFile] = useState("");

    const imageUpdate = (e) => {
        console.log(e)
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
          }
          console.log(img, "from client")
          setImageFile(img);
    };

    const submitUpdate = async(e) => {
        e.preventDefault();
        //isUser && (realUsername !== updatedUsername || password)
        if(isUser){
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
                
                // image upload 
                if(imageFile){
                    let formData = new FormData();
                    console.log(imageFile.data, "form data")
                    formData.append('file', imageFile.data);
                    const config = {
                        headers: {
                            "content-type": 'multipart/form-data'
                        },
                    }
                    const url = `http://localhost:8000/upload/images/uploadProfile/${userId}`
                    try{
                        const response = await axios.put(url, formData, config);
                        function toBase64(arr) {
                            arr = new Uint8Array(arr) 
                            return btoa(
                               arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
                            );
                         } ;
                          const profilePictureUrl = `data:image/png;base64,${toBase64(response.data.image.data.data)}`;
                          console.log("called")
                          dispatch(pictureActions.setProfilePicture(profilePictureUrl));
                    } 
                    catch(err){
                        console.log(err)
                    }
                }
                sessionStorage.setItem("accessToken", response.data.access_token);

                toast.success("Credentials Updated Successfully!!", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                window.location.reload();
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
            <Topbar isUser={realUsername?true:false} profilePicture={profilePicture}/>
            <Toaster/>
            <div className='form-setting-wrapper'>
                <div className='form-setting'>
                    
                    <h2>Profile</h2>
                    <img src={profilePicture} alt='' className='profilePicture'
                    />
                    <label htmlFor="inputFile">
                        <i className='settingicons fa fa-upload'></i>
                    </label>
                    <input type="file" name="file" id="inputFile" style={{display: "none"}} onChange={imageUpdate}/>

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