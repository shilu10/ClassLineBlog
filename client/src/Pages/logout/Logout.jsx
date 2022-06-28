import './logout.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { pictureActions } from '../../Components/store/store';

export default function Logout() {
  const dispatch = useDispatch();
  const accessToken = sessionStorage.getItem("accessToken");
  const logoutNavigator = useNavigate();

  useEffect(()=>{
    if(accessToken){
      sessionStorage.removeItem("accessToken");
      dispatch(pictureActions.setProfielPicture(""))
      logoutNavigator('/');
    }
  });
  
  return (
    <div>
    </div>
  )
}
