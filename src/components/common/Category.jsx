import React from 'react'
import { Link } from "react-router-dom";
const Category = ({link}) => {
  
  return (
    <div className="card">
            <div className="card-header border-bottom">
              <h6 className="text-xl mb-0">Tags</h6>
            </div>
            <div className="card-body p-24">
              <ul>
                <li className="w-100 d-flex align-items-center justify-content-between flex-wrap gap-8 border-bottom border-dashed pb-12 mb-12">
                  <Link
                    to={`${link}`}
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
                     to={`${link}`}
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
                     to={`${link}`}
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
                     to={`${link}`}
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
                     to={`${link}`}
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
  )
}

export default Category