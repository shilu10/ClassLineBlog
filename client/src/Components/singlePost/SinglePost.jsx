import './singlepost.css';

const SinglePost = ({ blog }) => {
  return (
    <div className='single-post'>

        <div className='single-post-wrapper'>
          <img className='single-post-img'
            src={blog.photos}
            alt="post-image"
            />
            <h1>{blog.title}</h1>    
        </div>

        <div className="single-post-edit">
              <i class="trash fa-solid fa-trash-can"></i>
              <i class="edit fa-solid fa-pen-to-square" ></i>
        </div>
        <div className="paragraph">
        <p >
          {blog.description}
        </p>
        <p>
          {blog.updatedAt}
        </p>
        <p>
          {blog.username}
        </p>
      </div>
    </div>
  )
}

export default SinglePost;