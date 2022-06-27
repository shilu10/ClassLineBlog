import './logout.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Logout() {
  const accessToken = sessionStorage.getItem("accessToken");
  const logoutNavigator = useNavigate();

  useEffect(()=>{
    if(accessToken){
      sessionStorage.removeItem("accessToken");
      logoutNavigator('/');
    }
  });
  
  return (
    <div>
    </div>
  )
}
