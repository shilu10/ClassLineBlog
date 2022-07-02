import './singlepost.css';
import imageUrlBuilder from '@sanity/image-url';
import SyntaxHighlighter from 'react-syntax-highlighter';
import BlockContent from '@sanity/block-content-to-react';
import client from '../../Assets/sanityClient';

const SinglePost = ({ singleBlog }) => {
  console.log(singleBlog, "singlepage nbolo");
  const builder = imageUrlBuilder(client);
  let blogDate = new Date(singleBlog.createdAt).toDateString();
  const serializers = {
    types: {
        code: ({node = {}}) => {
            const { code, language } = node
            if (!code){
                return null
            }
             return <SyntaxHighlighter language={language ||'text'} >
            {code}
          </SyntaxHighlighter>
        }}};

  function urlFor(source) {
    return builder.image(source)
  }

  return (
    <div className='single-post'>

        <div className='single-post-wrapper'>
          <img className='single-post-img'
            src={ singleBlog.mainImage.asset.url }
            alt="post-image"
            />
            <h1>{singleBlog.slug.current}</h1>    
        </div>

        <div className="single-post-edit">
              <i class="trash fa-solid fa-trash-can"></i>
              <i class="edit fa-solid fa-pen-to-square" ></i>
        </div>
        <div className="paragraph">
        <p >
        <BlockContent blocks={singleBlog.body} serializers={serializers} />
        </p>
        <p>
          {blogDate}
        </p>
        <p>
          {singleBlog.name}
        </p>
      </div>
    </div>
  )
}

export default SinglePost;