"use client";
import React from "react";
import { Icon } from "@iconify/react";
import {Link} from "react-router-dom";
const Breadcrumb = ({ title }) => {
  return (
    <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
      <h6 className='font-gilroy fw-semibold mb-0'>Dashboard</h6>
      <ul className='d-flex align-items-center gap-2'>
        <li className='fw-medium'>
          <Link
            to='/'
            className='d-flex align-items-center gap-1 hover-text-primary'
          >
            <Icon
              icon='solar:home-smile-angle-outline'
              className='icon text-lg font-gilroy'
            />
            Dashboard
          </Link>
        </li>
        <li> - </li>
        <li className='font-gilroy fw-medium'>{title}</li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
