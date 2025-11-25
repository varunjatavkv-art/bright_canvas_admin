import React from 'react';
import { Link } from "react-router-dom";

const Tags = ({link}) => {
  return (
    <div className="card">
    <div className="card-header border-bottom">
      <h6 className="text-xl mb-0">Tags</h6>
    </div>
    <div className="card-body p-24">
      <div className="d-flex align-items-center flex-wrap gap-8">
        <Link
          to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          Development{" "}
        </Link>
        <Link
           to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          Design{" "}
        </Link>
        <Link
           to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          Technology{" "}
        </Link>
        <Link
           to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          Popular{" "}
        </Link>
        <Link
           to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          Codignator{" "}
        </Link>
        <Link
           to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          Javascript{" "}
        </Link>
        <Link
           to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          Bootstrap{" "}
        </Link>
        <Link
           to={`${link}`}
          className="btn btn-sm btn-primary-600 bg-primary-50 bg-hover-primary-600 text-primary-600 border-0 d-inline-flex align-items-center gap-1 text-sm px-16 py-6"
        >
          PHP{" "}
        </Link>
      </div>
    </div>
  </div>
  )
}

export default Tags