import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";



const LatestBlogs = () => {
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    // ... fetchBlogs function remains the same ...
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/blogs");
        setBlog(res.data.slice(0,7));
      } catch (error) {
        console.log("error is fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  
  return (
    
      <div className="d-flex flex-column gap-24">
        {/* Latest Blog */}
        <div className="card">
          <div className="card-header border-bottom">
            <h6 className="text-xl mb-0">Latest Blogs</h6>
          </div>
          <div className="card-body d-flex flex-column gap-24 p-24">
            {blog.map((data, idx) => {
              const MAX_LENGTH = 150; 
              
              

              const imgSrc = data.image_path?.startsWith("http")
                ? data.image_path
                : `http://localhost:8000/${data.image_path}`;
               
              return (
                <div className="d-flex flex-wrap" key={idx}>
                  <Link
                    to={"/blog/blog-details/" + data._id}
                    className="blog__thumb w-100 radius-12 overflow-hidden"
                  >
                    <img
                      src={`${imgSrc}`}
                      alt=""
                      className="w-100 h-[80px] object-fit-cover"
                    />
                  </Link>
                  <div className="blog__content">
                    <h6 className="mb-8">
                      <Link
                       to={"/blog/blog-details/" + data._id}
                        className="text-line-2 text-hover-primary-600 text-md transition-2"
                      >
                        {data.title.length > 70 ? data.title.slice(0,70) + "..." : data.title}
                      </Link>
                    </h6>
                   
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    
  );
};
export default LatestBlogs;