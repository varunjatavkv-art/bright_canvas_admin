import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LatestWork from "./LatestWork";
import Breadcrumb from "../../Breadcrumb";


const WorkDetails = () => {
  const { workId } = useParams();
  const [singleWork, setSingleWork] = useState({});
  
  const [work, setWork] = useState([]);

  useEffect(() => {
    // ... fetchBlogs function remains the same ...
    const fetchWork = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + "api/work");
        setWork(res.data.data);
      } catch (error) {
        console.log("error is fetching work", error);
      }
    };
    fetchWork();
  }, []);

  useEffect(() => {
    const fetchSingleWork = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API + `api/work/${workId}`
        );
        setSingleWork(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleWork();
  }, [workId]);

  return (
    <>
    <Breadcrumb title={"Work Details"} />
    <div className="row gy-4">
      <div className="col-lg-8">
        <div className="card p-0 radius-12 overflow-hidden">
          <div className="card-body p-0">
            <img
               src={singleWork.image_path?.startsWith("http")
                        ? singleWork.image_path
                        : import.meta.env.VITE_API + `/${singleWork.image_path}`}
              alt=""
              className="w-100 h-100 object-fit-cover"
            />
           { console.log(import.meta.env.VITE_API + `/${singleWork.image_path}`)}
            <div className="p-32">
              <div className="d-flex align-items-center gap-16 justify-content-between flex-wrap mb-24">
                <div className="d-flex align-items-center gap-8">
                  <img
                    src={singleWork.image_path?.startsWith("http")
                        ? singleWork.image_path
                        : import.meta.env.VITE_API + `/${singleWork.image_path}`
                    }
                    alt=""
                    className="w-48-px h-48-px rounded-circle object-fit-cover"
                  />
                  <div className="d-flex flex-column">
                    <h6 className="text-lg mb-0">John Doe</h6>
                    <span className="text-sm text-neutral-500">1 day ago</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-md-3 gap-2 flex-wrap">
                  <div className="d-flex align-items-center gap-8 text-neutral-500 text-lg fw-medium">
                    <i className="ri-chat-3-line" />
                    10 Comments
                  </div>
                  <div className="d-flex align-items-center gap-8 text-neutral-500 text-lg fw-medium">
                    <i className="ri-calendar-2-line" />
                    {singleWork.created_at?.split("T")[0]}
                  </div>
                </div>
              </div>
              <h3 className="mb-16">{singleWork.title} </h3>
              <div dangerouslySetInnerHTML={{ __html: singleWork.description }}></div>
              <h3  className="mb-16">Your Services</h3>
              <div dangerouslySetInnerHTML={{ __html: singleWork.service }}></div>
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
         
         <LatestWork/>
          {/* Category */}
          <div className="card">
            <div className="card-header border-bottom">
              <h6 className="text-xl mb-0">Tags</h6>
            </div>
            <div className="card-body p-24">
              <ul>
                <li className="w-100 d-flex align-items-center justify-content-between flex-wrap gap-8 border-bottom border-dashed pb-12 mb-12">
                  <Link
                    to="/blog"
                    className="text-hover-primary-600 transition-2"
                  >
                    {" "}
                    Techbology{" "}
                  </Link>
                  <span className="text-neutral-500 w-28-px h-28-px rounded-circle bg-neutral-100 d-flex justify-content-center align-items-center transition-2 text-xs fw-semibold">
                    01{" "}
                  </span>
                </li>
                <li className="w-100 d-flex align-items-center justify-content-between flex-wrap gap-8 border-bottom border-dashed pb-12 mb-12">
                  <Link
                    to="/blog"
                    className="text-hover-primary-600 transition-2"
                  >
                    {" "}
                    Business{" "}
                  </Link>
                  <span className="text-neutral-500 w-28-px h-28-px rounded-circle bg-neutral-100 d-flex justify-content-center align-items-center transition-2 text-xs fw-semibold">
                    01{" "}
                  </span>
                </li>
                <li className="w-100 d-flex align-items-center justify-content-between flex-wrap gap-8 border-bottom border-dashed pb-12 mb-12">
                  <Link
                    to="/blog"
                    className="text-hover-primary-600 transition-2"
                  >
                    {" "}
                    Consulting{" "}
                  </Link>
                  <span className="text-neutral-500 w-28-px h-28-px rounded-circle bg-neutral-100 d-flex justify-content-center align-items-center transition-2 text-xs fw-semibold">
                    01{" "}
                  </span>
                </li>
                <li className="w-100 d-flex align-items-center justify-content-between flex-wrap gap-8 border-bottom border-dashed pb-12 mb-12">
                  <Link
                    to="/blog"
                    className="text-hover-primary-600 transition-2"
                  >
                    {" "}
                    Course{" "}
                  </Link>
                  <span className="text-neutral-500 w-28-px h-28-px rounded-circle bg-neutral-100 d-flex justify-content-center align-items-center transition-2 text-xs fw-semibold">
                    01{" "}
                  </span>
                </li>
                <li className="w-100 d-flex align-items-center justify-content-between flex-wrap gap-8">
                  <Link
                    to="/blog"
                    className="text-hover-primary-600 transition-2"
                  >
                    {" "}
                    Real Estate{" "}
                  </Link>
                  <span className="text-neutral-500 w-28-px h-28-px rounded-circle bg-neutral-100 d-flex justify-content-center align-items-center transition-2 text-xs fw-semibold">
                    01{" "}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          {/* Tags */}
          <div className="card">
            <div className="card-header border-bottom">
              <h6 className="text-xl mb-0">Tags</h6>
            </div>
            <div className="card-body p-24">
              <div className="d-flex align-items-center flex-wrap gap-8">
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  Development{" "}
                </Link>
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  Design{" "}
                </Link>
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  Technology{" "}
                </Link>
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  Popular{" "}
                </Link>
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  Codignator{" "}
                </Link>
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  Javascript{" "}
                </Link>
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  Bootstrap{" "}
                </Link>
                <Link
                  to="/blog"
                  className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
                >
                  PHP{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default WorkDetails;
