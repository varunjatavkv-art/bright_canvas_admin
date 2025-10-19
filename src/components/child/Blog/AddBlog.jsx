import AddBlogForm from "./AddBlogForm";
import LatestBlogs from "./LatestBlogs";

const AddBlogLayer = () => {
  return (
    <div className="row gy-4">
      {/* Form */}
      <AddBlogForm />

      {/* Sidebar  */}
      <div className="col-lg-4">
      <LatestBlogs />
      </div>
    </div>
  );
};

export default AddBlogLayer;
