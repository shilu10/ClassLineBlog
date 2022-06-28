import { useState } from "react";
import './comment.css';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const CommentForm = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",
}) => {
  var access_token = sessionStorage.getItem("accessToken");
 
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text.length === 0;
  const commentNavigator = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text);
    setText("");
  };

  const isLoggedIn = () => {
    if(!access_token){
      return true
    }
    return false
  }

  return (
    <div>
      <Toaster />
      <form onSubmit={onSubmit}>
        <textarea
          className="comment-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoggedIn()}
          onClick={()=>{
            if(!access_token){
              toast('Please Login to Make an comment',
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
                    }}
                    
                );
                commentNavigator('/login')}
              
          }}
        />
        <button className="comment-form-button" disabled={isTextareaDisabled}>
          {submitLabel}
        </button>
        {hasCancelButton && (
          <button
            type="button"
            className="comment-form-button comment-form-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default CommentForm;