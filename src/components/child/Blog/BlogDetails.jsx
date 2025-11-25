import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Latest from "./LatestBlogs";
import Breadcrumb from "../../Breadcrumb";
import Category from "../../common/CaTEGORY.JSX";
import Tags from "../../common/Tags";

const BlogDetailsLayer = () => {
  const { blogId } = useParams();
  const [singleBlog, setSingleBlog] = useState({});
  const [blog, setBlog] = useState([]);


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + "api/blogs");
        setBlog(res.data.data);
      } catch (error) {
        console.log("error is fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);


  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API+ `api/blogs/${blogId}`
        );
        setSingleBlog(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleBlog();
  }, [blogId]);


  return (
    <>
    <Breadcrumb title={"Blog Details"}/>
    <div className="row gy-4 font-gilroy">
      <div className="col-lg-8">
        <div className="card p-0 radius-12 overflow-hidden">
          <div className="card-body p-0">
            <img
              src={
                singleBlog.image_path?.startsWith("http")
                  ? singleBlog.image_path
                  : import.meta.env.VITE_API+`${singleBlog.image_path}`
              }
              alt=""
              className="w-100 h-100 object-fit-cover"
            />
            <div className="p-32">
              <div className="d-flex align-items-center gap-16 justify-content-between flex-wrap mb-24">
                <div className="d-flex align-items-center gap-8">
                  <img
                    src={
                      singleBlog.image_path?.startsWith("http")
                        ? singleBlog.image_path
                        : import.meta.env.VITE_API+`${singleBlog.image_path}`
                    }
                    alt=""
                    className="w-48-px h-48-px rounded-circle object-fit-cover"
                  />
                  <div className="d-flex flex-column">
                    <h6 className="text-lg mb-0 font-gilroy">John Doe</h6>
                    <span className="text-sm text-neutral-500 font-gilroy">1 day ago</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-md-3 gap-2 flex-wrap">
                  <div className="d-flex align-items-center gap-8 text-neutral-500 text-lg fw-medium font-gilroy">
                    <i className="ri-chat-3-line" />
                    10 Comments
                  </div>
                  <div className="d-flex align-items-center gap-8 text-neutral-500 text-lg fw-medium font-gilroy">
                    <i className="ri-calendar-2-line" />
                    {singleBlog.created_at?.split("T")[0]}
                  </div>
                </div>
              </div>
              <h3 className="mb-16">{singleBlog.title} </h3>
              <div
              className="font-gilroy"
                dangerouslySetInnerHTML={{ __html: singleBlog.description }}
              ></div>
            </div>
          </div>
        </div>
       
      </div>
      {/* Sidebar Start */}
      <div className="col-lg-4">
        <div className="d-flex flex-column gap-24">
          {/* Search */}
          <div className="card">
            <div className="card-header border-bottom">
              <h6 className="text-xl mb-0">Search Here</h6>
            </div>
            <div className="card-body p-24">
              <form className="position-relative">
                <input
                  type="text"
                  className="form-control border border-neutral-200 radius-8 ps-40"
                  name="search"
                  placeholder="Search"
                />
                <iconify-icon
                  icon="ion:search-outline"
                  className="icon position-absolute positioned-icon top-50 translate-middle-y"
                />
              </form>
            </div>
          </div>

          <Latest data={blog} title={"Latest Blog"}/>
          {/* Category */}
          <Category link={"/blog"}/>
          {/* Tags */}
         <Tags link={"/blog"}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogDetailsLayer;
