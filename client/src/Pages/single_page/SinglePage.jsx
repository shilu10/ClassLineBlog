import React from 'react'
import Sidebar from '../../Components/sidebar/Sidebar';
import { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SinglePost from '../../Components/singlePost/SinglePost';
import './singlepage.css';
import Topbar from '../../Components/topbar/Topbar';
import Comments from '../../Components/comments/Comments';
import jwt_decode from "jwt-decode";
import { current } from '@reduxjs/toolkit';

export default function SinglePage() {
  var access_token = sessionStorage.getItem("accessToken");
  var currentUsername = null;
  var profilePicture = null;

  if(access_token){
    var decoded = jwt_decode(access_token);
    console.log(decoded, "from comments")
    if(decoded._doc){
      decoded = decoded._doc;
    }
    else{
      decoded = jwt_decode(access_token);
    }
    var currentUsername = decoded.username;
    var profilePicture = decoded.profilePicture;
  }

  const id = useParams().id;
  const [blog, setBlog] = useState({});
  useEffect(() => {
    const fetch = async() => {
      try{
        const response = await axios.get(`http://localhost:8000/api/blogs/${id}`);
        setBlog(response.data);
      }
      catch(err){
        console.log(err)
      }
    }
    fetch();
  }, []);

  return (
    <div className='single-page-container'>
      <div className='single-page'>
          <Topbar profilePicture={profilePicture} isUser={currentUsername?true:false}/>
          <SinglePost blog={blog} />
          <Comments blogId={id} />
      </div>
    </div>
  )
}
