import Breadcrumb from "../../Breadcrumb";
import AddWorkFrom from "./AddWorkFrom";
import LatestWork from "./LatestWork";



const AddBlogLayer = () => {
  return (
    <>
    <Breadcrumb title={"Add Work"} />
    <div className="row gy-4">
      {/* Form */}
      <AddWorkFrom/>

      {/* Sidebar  */}
      <div className="col-lg-4">
      <LatestWork />
      </div>
    </div>
    </>
  );
};

export default AddBlogLayer;
