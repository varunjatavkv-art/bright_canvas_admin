import AddWorkFrom from "./AddWorkFrom";
import LatestWork from "./LatestWork";



const AddBlogLayer = () => {
  return (
    <div className="row gy-4">
      {/* Form */}
      <AddWorkFrom/>

      {/* Sidebar  */}
      <div className="col-lg-4">
      <LatestWork tu />
      </div>
    </div>
  );
};

export default AddBlogLayer;
