import { useState, useEffect,  } from 'react';
import './comments.css';
import axios from 'axios';
import Comment from '../comment/Comment';
import CommentForm from '../comment/commentform';
import { useSelector, useDispatch } from 'react-redux';
import { loginActions, userActions } from '../../Components/store/store';
import jwt_decode from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

// we need a whle comment to get the last comment id value, so we can use it for new comments
// blogcomments - holds the current blog's all comments., backendcomments holds all the post commands
export default function Comments({ blogId }){
  const [backendComments, setBackendComments] = useState([]);
  const [blogComments, setBlogComments]  = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const dispatch = useDispatch();
  var access_token = localStorage.getItem("accessToken");
  console.log(access_token, "from comments")
  const axiosInt = axios.create();
  var decoded = jwt_decode(access_token);
  console.log(decoded, "from comments")
  if(decoded._doc){
    decoded = decoded._doc;
  }
  else{
    decoded = jwt_decode(access_token);
  }
  console.log(decoded, "decoded second")
  var currentUsername = decoded.username;
  var expDate = decoded.exp;
  var profilePicture = decoded.profilePicture;
  var email = decoded.email;
  console.log(currentUsername, "from comments")

  const user = {
    username: currentUsername,
    email: email,
    profilePicture: profilePicture,
    isUser: true
  };
  console.log(user, "suer from comments")
  
  userActions.setUser(user);

  const fetchComment = async() =>{
    try{
      const response = await axios.get("http://localhost:8000/api/comments");
      setBackendComments(response.data);
      }
      catch(err){
        console.log(err);
    }};   


  const rootComments = blogComments.filter(comment => (
      comment.parentId === null 
    ));
    
    // all the comments
    useEffect(()=>{
      const currDate = Date.now();
      console.log("access", currDate>expDate*1000, currDate, expDate)
      if(!access_token || (currDate>expDate*1000)){
        const fetchAccessToken = async() => {
            try{
              // Because access token is saved inmemory when user closes the tab it will be deleted.
              // so we are checking whether he has a refresh token which is valid, if then we know, user
              // should haved loggedin so we are generatinga new access token with some logic in the 
              // backend.
              const response = await axios.get('http://localhost:8000/api/auth/refresh_token', {
              withCredentials: true 
              });
              localStorage.setItem("accessToken", response.data.access_token);
            }
            catch(err){
          console.log(err, "while getting");
        }}
        fetchAccessToken();
        
      }  
  }, []);
  
  // for specific blog comments
  useEffect(()=>{
    try{
        const fetchComment = async () =>{
            const response = await axios.get(`http://localhost:8000/api/comments/${blogId}`);
            setBlogComments(response.data);
            }
            fetchComment();
        }   
    catch(err){
        console.log(err);
    }
}, []);
    
  const getReplies = (commentId) =>
       backendComments.filter((backendComment) => backendComment.parentId == commentId)

  axiosInt.interceptors.response.use(async(config) =>{
          const currDate = Date.now();
          if(currDate > expDate*1000){
            console.log("axiosItn", currDate>expDate*1000)
            const response = await axios.get('http://localhost:8000/api/auth/refresh_token', {
                  withCredentials: true 
                  });
                  expDate = jwt_decode(response).exp;
                  localStorage.setItem("accessToken", response.data.access_token)
              }
        
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });
      
  const addComment = async (text) => {
    if(access_token){
      let parentId = activeComment  ? activeComment.id : null;
    // only here we use all the comments, onlyto get the last comment id.
      try{
        const response = await axios.post(`http://localhost:8000/api/comments/${blogId}`,
        {
          username: currentUsername,
          body: text,
          parentId: parentId,
        },
        {
          withCredentials: true,
        });
        toast.success('Comment Posted successfully, Refresh the page to view the comment',
                  {
                    icon: '👏',
                    style: {
                      borderRadius: '10px',
                      background: '#333',
                      color: '#fff',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    }}); }
      catch(err){
        console.log(err)
      }
        setActiveComment(null);
      }};
  
  const updateComment = async (text, commentId) => {
    try{
      const response = await axios.put(`http://localhost:8000/api/comments/${commentId}`,
      {
        body: text,
        accessToken: access_token,
      },
      {
        withCredentials: true,
      },
      );
      toast.success('Comment Updated successfully, Refresh the page to view the comment',
      {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }}); }

    catch(err){
      console.log(err);
    }
      setActiveComment(null);
    }

  const deleteComment = (commentId) => {
      if (window.confirm("Are you sure you want to remove comment?")) {
        try{
          const response = axios.delete(`http://localhost:8000/api/comments//${commentId}`);
          toast.success('Comment deleted successfully, Refresh the page to view the comment',
            {
              icon: '👏',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }});
        }
        catch(err){
          window.alert("Error deleting comment");
        }
      }
    };

    useEffect(()=>{
      fetchComment();
    }, [])

    return (
      <div className='comments-container'>
        <Toaster />
        <div className="comments">
          <h3 className="comments-title">Comments</h3>
          <div className="comment-form-title">Write comment</div>
          <CommentForm submitLabel="Write" handleSubmit={addComment} />
            <div className="comments-container">
              {rootComments.map((rootComment) => (
                <Comment
                  key={rootComment.id}
                  comment={rootComment}
                  replies={getReplies(rootComment.id)}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  addComment={addComment}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
                  currentUsername={currentUsername}
                  getRepliesFunc={getReplies}
                />
              ))}
            </div>
        </div>
    </div>
)}
