import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NoDataFound from "../../common/NoDataFound";
import Breadcrumb from "../../Breadcrumb";
import NotFound from "../../common/NotFound";

const BlogLayer = () => {
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/blogs");
        if (res.data) {
          setLoading(false);
        }
        setBlog(res.data);
        setError(false);
      } catch (error) {
        console.log("error is fetching blogs", error);
        setError(true);
      }
    };
    fetchBlogs();
  }, []);

  const getTruncatedText = (html, maxLength) => {
    if (!html) return "";

    // 1. Strip HTML tags to get plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    // 2. Truncate the plain text
    if (plainText.length > maxLength) {
      return plainText.slice(0, maxLength) + "...";
    }
    return plainText;
  };

  const deletePost = async (id) => {
    try {
      let res = await axios.delete("http://localhost:8000/api/blogs/" + id);
      if (res.status == 200) {
        alert(res.data.message);
        setBlog((prevBlog) => prevBlog.filter((post) => post._id !== id));
      }
    } catch (error) {
      console.log("Unexpected Error: ", error);
    }
  };
  if (blog.length === 0 && !error) {
    return <NoDataFound text={"No Blogs Found!"} />;
  }

  if (loading && !error) {
    return <Icon icon="mdi:loading" />;
  }
  if (error) {
    return <NotFound />;
  }

  return (
    <>
    <Breadcrumb title={"Blog"} />
    <div className="row gy-4">
      {blog?.map((data, idx) => {
        // 🚨 NEW: Use the helper function to get safe, truncated text
        const truncatedText = getTruncatedText(data.description, 100);
        return (
          <div className="col-xxl-3 col-lg-4 col-sm-6 " key={idx}>
            <div className="card h-100 p-0 radius-12 overflow-hidden">
              <div className="card-body p-24">
                <Link
                  to={"/blog/blog-details/" + data._id}
                  className="w-100 max-h-194-px radius-8 overflow-hidden"
                >
                  <img
                    src={
                      data.image_path?.startsWith("http")
                        ? data.image_path
                        : `http://localhost:8000/${data.image_path}`
                    }
                    alt={data.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                </Link>
                <div className="mt-20">
                  <div className="d-flex align-items-center gap-6 justify-content-between flex-wrap mb-16">
                    <Link
                      to="blog-details"
                      className="px-20 py-6 bg-neutral-100 rounded-pill bg-hover-neutral-300 text-neutral-600 fw-medium"
                    >
                      Blog
                    </Link>
                    <div className="d-flex align-items-center gap-8 text-neutral-500 fw-medium">
                      <i className="ri-calendar-2-line" />
                      {data.created_at.split("T")[0]}
                    </div>
                  </div>
                  <h6 className="mb-16">
                    <Link
                      to={"/blog/blog-details/" + data._id}
                      className="text-line-2 text-hover-primary-600 text-xl transition-2"
                    >
                      {data.title}
                    </Link>
                  </h6>

                  <div
                    dangerouslySetInnerHTML={{ __html: truncatedText }}
                  ></div>
                  <Link
                    to={"/blog/blog-details/" + data._id}
                    className="d-flex align-items-center gap-8 fw-semibold text-neutral-900 text-hover-primary-600 transition-2"
                  >
                    Read More
                    <i className="ri-arrow-right-double-line text-xl d-flex line-height-1" />
                  </Link>

                  <button
                    className="bg-red text-black py-2 px-2 rounded-lg"
                    onClick={() => deletePost(data._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        );
      })}
    </div>
    </>
  );
};

export default BlogLayer;
