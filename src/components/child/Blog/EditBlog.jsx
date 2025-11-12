import Breadcrumb from "../../Breadcrumb.jsx";
import EditBlogForm from "./EditBlogForm.jsx";
import LatestBlogs from "./LatestBlogs.jsx";

const EditBlog = () => {
  return (
    <>
    <Breadcrumb title={"Edit Blogs"}/>
    <div className="row gy-4">
      {/* Form */}
      <EditBlogForm />

      {/* Sidebar  */}
      <div className="col-lg-4">
      <LatestBlogs />
      </div>
    </div>
    </>
  );
};

export default EditBlog;
