import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../global.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//? Blog
import Blog from "./components/Blog.jsx";
import AddBlog from "./components/child/Blog/AddBlog.jsx";
import BlogDetailsLayer from "./components/child/Blog/BlogDetails.jsx";
import BlogLayer from "./components/child/Blog/BlogLayer.jsx";

//? Works
import Work from "./components/Work.jsx";
import AddWork from "./components/child/Work/AddWork.jsx";
import WorkDetails from "./components/child/Work/WorkDetails.jsx";
import WorkLayer from "./components/child/Work/WorkLayer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BlogLayer />} />
          <Route path="blog" element={<Blog />}>
            <Route index element={<BlogLayer />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="blog-details/:blogId" element={<BlogDetailsLayer />} />
          </Route>
          <Route path="work" element={<Work />}>
            <Route index element={<WorkLayer />} />
            <Route path="add-work" element={<AddWork />} />
            <Route path="work-details" element={<WorkDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
