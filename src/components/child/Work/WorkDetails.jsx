import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LatestWork from "./LatestWork";
import Breadcrumb from "../../Breadcrumb";
import Category from "../../common/CaTEGORY.JSX";
import Tags from "../../common/Tags";

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
                    <h6 className="text-lg mb-0 my-new-class font-gilroy">John Doe</h6>
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
                    {singleWork.created_at?.split("T")[0]}
                  </div>
                </div>
              </div>
              <h3 className="mb-16 font-gilroy">{singleWork.title} </h3>
              <div className="font-gilroy" dangerouslySetInnerHTML={{ __html: singleWork.description }}></div>
              <h3  className="mb-16 font-gilroy">Your Services</h3>
              <div className="font-gilroy" dangerouslySetInnerHTML={{ __html: singleWork.service }}></div>
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
          <Category link={"/blog"}/>
          {/* Tags */}
         <Tags link={"/blog"}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default WorkDetails;
