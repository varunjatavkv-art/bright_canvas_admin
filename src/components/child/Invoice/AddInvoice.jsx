import { Icon } from "@iconify/react/dist/iconify.js";
import Breadcrumb from "../../Breadcrumb";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

const AddInvoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [orderID, setOrderID] = useState("");
  const [shipmentID, setShipmentID] = useState("");

  const [issueDate, setIssueDate] = useState();
  const [dueDate, setDueDate] = useState();

  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);

  

  useEffect(() => {
    const generateInvoiceNumber = () => {
      const newInvoiceNumber = uuidv4();
      const formatedNumber = `INV-${newInvoiceNumber
        .replace(/-/g, "")
        .toUpperCase()
        .substring(0, 4)}`;
      setInvoiceNumber(formatedNumber);
    };

    const generateOrderID = () => {
      const newOrderID = uuidv4();
      const formatedOrderID = `${newOrderID
        .replace(/-/g, "")
        .toUpperCase()
        .substring(4, 8)}`;
        setOrderID(formatedOrderID);
    }

    const generateShipmentID = () => {
      const newShipmentID = uuidv4();
      const formatedID = `${newShipmentID
        .replace(/-/g, "")
        .toUpperCase()
        .substring(7, 11)}`;
        setShipmentID(formatedID);
    }

    generateInvoiceNumber();
    generateOrderID();
    generateShipmentID();
  }, []);

  const addNew = () => {
    console.log("add new");
    
  }
  return (
    <>
      <Breadcrumb title={"Add Invoice"} />
      <form className="card">
        <div className="card-header">
          <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
            >
              <Icon icon="simple-line-icons:check" className="text-xl" />
              Save
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
                      <h3 className="text-xl">Invoice #{invoiceNumber}</h3>
                      <p className="mb-1 text-sm">
                        Date Issued:{" "}
                        <input
                          type="date"
                          id="date_issue"
                          name="date_issue"
                          value={issueDate}
                          min="2018-01-01"
                          max="2018-12-31"
                          onChange={() => setIssueDate(e.target.value)}
                        />
                       
                       
                      </p>
                      <p className="mb-0 text-sm">
                        Date Due:{" "}
                        <input
                          type="date"
                          id="date_due"
                          name="date_due"
                          // value="2018-07-22"
                          min="2018-01-01"
                          max="2018-12-31"
                          value={dueDate}
                          onChange={() =>setDueDate(e.target.value)}
                        />
                       
                      </p>
                    </div>
                    <div className="col-sm-4">
                      <img
                        src="../../../assets/images/logo.png"
                        alt="image_icon"
                        className="mb-8"
                      />
                      <p className="mb-1 text-sm">
                        Bright Canvas
                      </p>
                      <p className="mb-0 text-sm">
                        bright.canvas@gmail.com, +1 543 2198
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-28 px-20">
                  <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
                    <div>
                      <h6 className="text-md">Issue For:</h6>
                      <table className="text-sm text-secondary-light">
                        <tbody>
                          <tr>
                            <td>Name</td>
                            <td className="ps-8">
                              :{" "}
                             
                              <input type="text" className="p-2" placeholder="Please enter name" required/>
                              {/* <span className="text-success-main">
                                <Icon icon="mage:edit" />
                              </span> */}
                            </td>
                          </tr>
                          <tr>
                            <td>Address</td>
                            <td className="ps-8">
                              :{" "}
                              <input type="text" className="p-2" placeholder="Please enter address" required />
                            </td>
                          </tr>
                          <tr>
                            <td>Phone number</td>
                            <td className="ps-8">
                              :{" "}
                              <input type="text" max={10} className="p-2" placeholder="Please enter contact" required/>
                              
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table className="text-sm text-secondary-light">
                        <tbody>
                          {/* <tr>
                            <td>Issue Date</td>
                           
                        <input
                          type="date"
                          id="issue_date"
                          name="issue_date"
                          value="2018-07-22"
                          min="2018-01-01"
                          max="2018-12-31"
                        />
                      
                          </tr> */}
                          <tr>
                            <td>Order ID</td>
                            <td className="ps-8">: #{orderID}</td>
                          </tr>
                          <tr>
                            <td>Shipment ID</td>
                            <td className="ps-8">: #{shipmentID}</td>
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
                          <tr>
                            <td>01</td>
                            <td>
                              <input type="text" name="items[]" id="item" placeholder="Type item name here" />
                            </td>
                            <td>
                              <input type="number" name="qty[]" id="qty" className="w-[30px]" value={qty} onChange={(e) => setQty(e.target.value)}/>
                            </td>
                            <td>
                              <select name="units[]" id="unit">
                                <option value="-1">units</option>
                                <option value="0">PC</option>
                                <option value="1">KG</option>
                              </select>
                            </td>
                            <td>
                            ₹ <input type="number" name="price[]" id="price" placeholder="Price" className="w-[50px]" value={price} onChange={(e) => setPrice(e.target.value)}/>
                            </td>
                            <td>₹ {price * qty}</td>
                            <td className="text-center">
                              <button type="button" className="remove-row">
                                <Icon
                                  icon="ic:twotone-close"
                                  className="text-danger-main text-xl"
                                />
                              </button>
                            </td>
                          </tr>
                        
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <button
                        type="button"
                        id="addRow"
                        className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                        onClick={addNew}
                      >
                        <Icon
                          icon="simple-line-icons:plus"
                          className="text-xl"
                        />
                        Add New
                      </button>
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
                                  $4000.00
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64">Discount:</td>
                              <td className="pe-16">
                                <span className="text-primary-light fw-semibold">
                                  $0.00
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64 border-bottom pb-4">Tax:</td>
                              <td className="pe-16 border-bottom pb-4">
                                <span className="text-primary-light fw-semibold">
                                  0.00
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
                                  $1690
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
      </form>
    </>
  );
};

export default AddInvoice;
