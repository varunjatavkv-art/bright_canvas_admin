import Breadcrumb from "../../Breadcrumb";
import EditWorkForm from "./EditWorkForm";
import LatestWork from "./LatestWork";



const EditWork = () => {
  return (
    <>
    <Breadcrumb title={"Edit Work"} />
    <div className="row gy-4">
      {/* Form */}
      <EditWorkForm/>

      {/* Sidebar  */}
      <div className="col-lg-4">
      <LatestWork />
      </div>
    </div>
    </>
  );
};

export default EditWork;
