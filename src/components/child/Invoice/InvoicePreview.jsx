import { Icon } from "@iconify/react/dist/iconify.js";
import {Link, useParams} from "react-router-dom";
import Breadcrumb from "../../Breadcrumb";
import { useEffect, useState } from "react";
import LoadingComponent from "../../common/LoadingComponent";
import axios from "axios";
import { formatCurrency, formatDate } from "../../../commonFunctions/common.functions";

const InvoicePreview = () => {
  const { invoiceId } = useParams();
  const [singleInvoice, setSingleInvoice] = useState({});
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchSingleInvoice = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/invoice/single/" + invoiceId
        );
        if (res.status === 200) {
          setSingleInvoice(res.data);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.error("Error fetch single Invoice :", error.message);
        setError(true);
      }
    };

    fetchSingleInvoice();
  }, [invoiceId]);

  if (Loading) {
    return <LoadingComponent />;
  }
  if (error) {
    return <NotFound />;
  }
  return (
    <>
    <Breadcrumb title={"Invoice Preview"} />
    <div className='card'>
      <div className='card-header'>
        <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
          <Link
            to='#'
            className='btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1'
          >
            <Icon icon='pepicons-pencil:paper-plane' className='text-xl' />
            Send Invoice
          </Link>
          <Link
            to='#'
            className='btn btn-sm btn-warning radius-8 d-inline-flex align-items-center gap-1'
          >
            <Icon icon='solar:download-linear' className='text-xl' />
            Download
          </Link>
          <Link
            to='#'
            className='btn btn-sm btn-success radius-8 d-inline-flex align-items-center gap-1'
          >
            <Icon icon='uil:edit' className='text-xl' />
            Edit
          </Link>
          <button
            type='button'
            className='btn btn-sm btn-danger radius-8 d-inline-flex align-items-center gap-1'
          >
            <Icon icon='basil:printer-outline' className='text-xl' />
            Print
          </button>
        </div>
      </div>
      <div className="card-body py-40">
          <div className="row justify-content-center" id="invoice">
            <div className="col-lg-8">
              <div className="shadow-4 border radius-8">
                <div className="p-20 border-bottom">
                  <div className="row justify-content-between g-3">
                    <div className="col-sm-4">
                      <h3 className="text-xl">
                        Invoice #{singleInvoice?.data?.metadata.invoiceNumber}
                      </h3>
                      <p className="mb-1 text-sm">
                        Date Issued:{" "}
                        <span className="editable text-decoration-underline">
                          {formatDate(singleInvoice?.data?.metadata.issueDate)}
                        </span>{" "}
                      </p>
                      <p className="mb-0 text-sm">
                        Date Due:{" "}
                        <span className="editable text-decoration-underline">
                          {formatDate(singleInvoice?.data?.metadata.dueDate)}
                        </span>{" "}
                      </p>
                    </div>
                    <div className="col-sm-4">
                      <img
                        src="assets/images/logo.png"
                        alt="image_icon"
                        className="mb-8"
                      />
                      <p className="mb-1 text-sm">Bright Canvas</p>
                      <p className="mb-0 text-sm">
                        bright.canvas@gmail.com, +1 543 2198
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-28 px-20">
                  <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
                    <div>
                      <h6 className="text-md">Issus For:</h6>
                      <table className="text-sm text-secondary-light">
                        <tbody>
                          <tr>
                            <td>Name</td>
                            <td className="ps-8">
                              :{" "}
                              <span> {singleInvoice?.data?.customer?.name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Address</td>
                            <td className="ps-8">
                              :{" "}
                              <span>
                                {" "}
                                {singleInvoice?.data?.customer?.address}
                              </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td>Phone number</td>
                            <td className="ps-8">
                              :{" "}
                              <span className="editable text-decoration-underline">
                                {" "}
                                {singleInvoice?.data?.customer?.phone}
                              </span>{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table className="text-sm text-secondary-light">
                        <tbody>
                          <tr>
                            <td>Status</td>
                            <td className="ps-8">
                              {singleInvoice?.data?.summary?.status == "0"
                                ? "Pending"
                                : "Paid"}
                            </td>
                          </tr>
                          <tr>
                            <td>Order ID</td>
                            <td className="ps-8">
                              :#{singleInvoice?.data?.metadata.orderID}
                            </td>
                          </tr>
                          <tr>
                            <td>Shipment ID</td>
                            <td className="ps-8">
                              :#{singleInvoice?.data?.metadata.shipmentID}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-24">
                    <div className="table-responsive scroll-sm">
                      <table
                        className="table bordered-table text-sm"
                        id="invoice-table"
                      >
                        <thead>
                          <tr>
                            <th scope="col" className="text-sm">
                              SL.
                            </th>
                            <th scope="col" className="text-sm">
                              Items
                            </th>
                            <th scope="col" className="text-sm">
                              Qty
                            </th>
                            <th scope="col" className="text-sm">
                              Units
                            </th>
                            <th scope="col" className="text-sm">
                              Unit Price
                            </th>
                            <th scope="col" className="text-sm">
                              Price
                            </th>
                            <th scope="col" className="text-center text-sm">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {singleInvoice?.data?.items.map((item) => {
                            let unit;
                            if(item.unit == "0"){
                                unit = "PC";
                            }else if(item.unit == "1"){
                                unit = "KG"
                            }else{
                                unit = "HR"
                            }
                            return (
                              <tr key={item._id}>
                                <td>01</td>
                                <td>{item.description}</td>
                                <td>{item.qty}</td>
                                <td>{unit}</td>
                                <td>{formatCurrency(item.unitPrice)}</td>
                                <td>{formatCurrency(item.qty * item.unitPrice)}</td>
                                <td className="text-center">
                                  <button type="button" className="remove-row">
                                    <Icon
                                      icon="ic:twotone-close"
                                      className="text-danger-main text-xl"
                                    />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                 
                    <div className="d-flex flex-wrap justify-content-between gap-3 mt-24">
                      <div>
                        <p className="text-sm mb-0">
                          <span className="text-primary-light fw-semibold">
                            Sales By:
                          </span>{" "}
                          Siddhartha
                        </p>
                        <p className="text-sm mb-0">Thanks for your business</p>
                      </div>
                      <div>
                        <table className="text-sm">
                          <tbody>
                            <tr>
                              <td className="pe-64">Subtotal:</td>
                              <td className="pe-16">
                                <span className="text-primary-light fw-semibold">
                                 {formatCurrency(singleInvoice?.data?.summary?.subtotal)}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64">Discoun (0%):</td>
                              <td className="pe-16">
                                <span className="text-primary-light fw-semibold">
                                  $0.00
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64 border-bottom pb-4">Tax (18%):</td>
                              <td className="pe-16 border-bottom pb-4">
                                <span className="text-primary-light fw-semibold">
                                {formatCurrency(singleInvoice?.data?.summary?.tax)}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64 pt-4">
                                <span className="text-primary-light fw-semibold">
                                  Total:
                                </span>
                              </td>
                              <td className="pe-16 pt-4">
                                <span className="text-primary-light fw-semibold">
                                {formatCurrency(singleInvoice?.data?.summary?.total)}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="mt-64">
                    <p className="text-center text-secondary-light text-sm fw-semibold">
                      Thank you for your purchase!
                    </p>
                  </div>
                  <div className="d-flex flex-wrap justify-content-between align-items-end mt-64">
                    <div className="text-sm border-top d-inline-block px-12">
                      Signature of Customer
                    </div>
                    <div className="text-sm border-top d-inline-block px-12">
                      Signature of Authorized
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default InvoicePreview;
