import { Icon } from "@iconify/react/dist/iconify.js";
import Breadcrumb from "../../Breadcrumb";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  formatCurrency,
  // Removed unused formatDate here, assuming it's used elsewhere in the file
} from "../../../commonFunctions/common.functions";
import LoadingComponent from "../../common/LoadingComponent";
import NotFound from "../../common/NotFound";

// Helper function to format date for HTML date input (YYYY-MM-DD)
const formatInputDate = (isoDate) => {
    if (!isoDate) return "";
    try {
        // Ensure we handle potentially null/undefined issueDate and dueDate
        return new Date(isoDate).toISOString().substring(0, 10);
    } catch (e) {
        console.error("Invalid date format:", isoDate);
        return "";
    }
};

const EditInvoice = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  // --- Core States ---
  const [singleInvoice, setSingleInvoice] = useState({});
  // Renamed to lowercase 'loading' for convention
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(false);

  // --- States for Editable Fields ---
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [orderID, setOrderID] = useState("");
  const [shipmentID, setShipmentID] = useState("");
  const [subTotal, setSubTotal] = useState(0); 
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
// const [set] = useState(0);
  // --- THE FIXED, CONSOLIDATED ITEM STATE ---
  const [invoiceItems, setInvoiceItems] = useState([]);



  // ------------------------------------------
  // Fetch Data and Initialize States
  // ------------------------------------------
  useEffect(() => {
    setLoading(true);
    const fetchSingleInvoice = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/invoice/single/" + invoiceId
        );
        
        if (res.status === 200) {
          const data = res?.data?.data;

          setSingleInvoice(res?.data);
          
          setCustomerName(data?.customer?.name || "");
          setCustomerAddress(data?.customer?.address || "");
          setCustomerPhone(data?.customer?.phone || "");
          setStatus(data?.summary?.status || "");
          
          // FIX: Use formatInputDate and correctly access metadata
          setIssueDate(formatInputDate(data?.metadata?.issueDate));
          setDueDate(formatInputDate(data?.metadata?.dueDate));
          
          setInvoiceNumber(data?.metadata?.invoiceNumber || "");
          setOrderID(data?.metadata?.orderID || "");
          setShipmentID(data?.metadata?.shipmentID || "");
          
          // Use default numeric values
          setSubTotal(data?.summary?.subtotal || 0);
          setTax(data?.summary?.tax || 0);
          setTotal(data?.summary?.total || 0);
          
          // FIX: Initialize the single source of truth
          setInvoiceItems(data?.items || []); 
          
          // The console log below is to show that `res.data.data.items` is available 
          // console.log(res.data.data.items);
          
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

console.log(invoiceItems);

  // ------------------------------------------
  // Item Management Handlers (FIXED)
  // ------------------------------------------

  // FIX: handleRemoveRow now operates on invoiceItems
  const handleRemoveRow = (idToRemove) => {
    setInvoiceItems((prevItems) => {
      const updatedItems = prevItems
        // Use the combined identifier (Mongo _id or temporary id)
        .filter((item) => (item._id || item.id) !== idToRemove) 
        // Recalculate serial numbers
        .map((item, index) => ({ ...item, serial: index + 1 }));
      return updatedItems;
    });
  };

// New `handleItemChange` to handle both `id` and `_id`
const handleItemChange = (itemId, field, value) => {
  setInvoiceItems((prevItems) =>
    prevItems.map((item) => {
      // Use the database ID (_id) if present, otherwise fall back to the client ID (id)
      const itemIdentifier = item._id || item.id; 

      if (itemIdentifier === itemId) {
        // Convert numeric fields to numbers, handling potential NaN
        let updatedValue = value;
        if (field === "qty" || field === "unitPrice") {
          // Use parseFloat to handle price (which might have decimals) and default to 0
          updatedValue = parseFloat(value) || 0;
          // Ensure negative numbers are not accepted for qty/price
          updatedValue = updatedValue < 0 ? 0 : updatedValue;
        }
        
        return { 
          ...item, 
          [field]: updatedValue 
        };
      }
      return item;
    })
  );
};
  // ------------------------------------------
  // Update Handler
  // ------------------------------------------
  const handleInvoiceUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedInvoice = {
      metadata: {
        invoiceNumber: invoiceNumber,
        orderID: orderID,
        shipmentID: shipmentID,
        issueDate: new Date(issueDate).toISOString(),
        dueDate: new Date(dueDate).toISOString(),
      },
      customer: {
        name: customerName,
        address: customerAddress,
        phone: customerPhone,
      },
     
      items: invoiceItems,
      summary: {
        subtotal: subTotal,
        total: total,
        tax: tax,
        status: status
      },
    };

    try {
      const res = await axios.put(
        `http://localhost:8000/api/invoice/update/${invoiceId}`,
        updatedInvoice
      );

      if (res.status === 200) {
        alert("Invoice updated successfully!");
        // Only navigate, no need to clear all states manually
        setInvoiceItems([]);
        navigate("/invoice"); 

      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("Failed to update invoice. Check console for details.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     // Using reduce to calculate the sum of (qty * unitPrice) for all items
     const newSubTotal = invoiceItems.reduce((sum, item) => {
      // Ensure qty and unitPrice are treated as numbers, defaulting to 0 if invalid
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      
      return sum + (qty * unitPrice);
     }, 0);
     
     // Assuming a fixed 18% tax rate as indicated in the summary section
     const TAX_RATE = 0.18; 
     const newTax = newSubTotal * TAX_RATE;
     
     const newTotal = newSubTotal + newTax;
    
     // Update the state for subtotal, tax, and total
     // Using Math.round and dividing by 100 to handle floating-point precision issues
     // when dealing with currency, ensuring two decimal places.
     setSubTotal(Math.round(newSubTotal * 100) / 100);
     setTax(Math.round(newTax * 100) / 100);
     setTotal(Math.round(newTotal * 100) / 100);
    
     }, [invoiceItems]);
  
  // ------------------------------------------
  // Render Logic
  // ------------------------------------------

  if (loading) {
    return <LoadingComponent />;
  }
  if (error) {
    return <NotFound />;
  }
  
  const invoiceData = singleInvoice?.data;

  return (
    <>
      <Breadcrumb title={"Edit Invoice"} />

      <form className="card" onSubmit={handleInvoiceUpdate}>
        <div className="card-header">
          <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
            <button
              type="submit"
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
                      <h3 className="text-xl">
                        Invoice #{invoiceData?.metadata.invoiceNumber}
                      </h3>
                      <p className="mb-1 text-sm">
                        Date Issued:{" "}
                        <input
                          type="date"
                          id="date_issue"
                          name="date_issue"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          required
                        />
                      </p>
                      <p className="mb-0 text-sm">
                        Date Due:{" "}
                        <input
                          type="date"
                          id="date_due"
                          name="date_due"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          required
                        />
                      </p>
                    </div>
                    {/* ... (Logo and Business Info section remains the same) ... */}
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
                    {/* Customer Data Section */}
                    <div>
                      <h6 className="text-md">Issue For:</h6>
                      <table className="text-sm text-secondary-light">
                        <tbody>
                          <tr>
                            <td>Name</td>
                            <td className="ps-8">
                              :{" "}
                              <input
                                type="text"
                                className="p-2"
                                placeholder="Please enter name"
                                required
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Address</td>
                            <td className="ps-8">
                              :{" "}
                              <input
                                type="text"
                                className="p-2"
                                placeholder="Please enter address"
                                required
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Phone number</td>
                            <td className="ps-8">
                              :{" "}
                              <input
                                type="text"
                                maxLength="10"
                                className="p-2"
                                placeholder="Please enter contact"
                                required
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Invoice Metadata Section */}
                    <div>
                      <table className="text-sm text-secondary-light">
                        <tbody>
                          <tr>
                            <td>Status</td>
                            <td className="ps-8">
                              <select
                                name="status"
                                id="status"
                                onChange={(e) => setStatus(e.target.value)}
                                value={status}
                              >
                                <option value="-1">Select</option>
                                <option value="0">Pending</option>
                                <option value="1">Paid</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td>Order ID</td>
                            <td className="ps-8">
                              : #{invoiceData?.metadata.orderID}
                            </td>
                          </tr>
                          <tr>
                            <td>Shipment ID</td>
                            <td className="ps-8">
                              : #{invoiceData?.metadata.shipmentID}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Items Table Section */}
                  <div className="mt-24">
                    <div className="table-responsive scroll-sm">
                      <table
                        className="table bordered-table text-sm"
                        id="invoice-table"
                      >
                        <thead>
                          <tr>
                            <th scope="col" className="text-sm">SL.</th>
                            <th scope="col" className="text-sm">Items</th>
                            <th scope="col" className="text-sm">Qty</th>
                            <th scope="col" className="text-sm">Units</th>
                            <th scope="col" className="text-sm">Unit Price</th>
                            <th scope="col" className="text-sm">Price</th>
                            <th scope="col" className="text-center text-sm">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceItems.map((item) => {
                            // Use the combined key for uniqueness
                            const itemKey = item._id || item.id; 
                            return (
                              <tr key={itemKey}>
                                <td>{String(item.serial).padStart(2, "0")}</td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Type item name here"
                                    value={item.description}
                                    onChange={(e) =>
                                      handleItemChange(itemKey, "description", e.target.value)
                                    }
                                    className="w-full border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.qty}
                                    onChange={(e) =>
                                      handleItemChange(itemKey, "qty", e.target.value)
                                    }
                                    className="w-full text-center border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                  />
                                </td>
                                <td>
                                  <select
                                    value={item.unit}
                                    onChange={(e) =>
                                      handleItemChange(itemKey, "unit", e.target.value)
                                    }
                                    className="w-full border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                  >
                                    <option value="-1">Units</option>
                                    <option value="0">PC</option>
                                    <option value="1">KG</option>
                                    <option value="2">HR</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Price"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      handleItemChange(itemKey, "unitPrice", e.target.value)
                                    }
                                    className="w-full text-center border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                  />
                                </td>
                                <td>
                                  {formatCurrency(item.qty * item.unitPrice)}
                                </td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveRow(itemKey)}
                                    className="text-red-500 hover:text-red-700 transition duration-150 p-1 rounded-full hover:bg-red-50"
                                  >
                                    <Icon
                                      icon="ic:twotone-close"
                                      className="w-5 h-5"
                                    />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                   
                    {/* Summary Section */}
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
                                  {formatCurrency(subTotal)}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64">Discount (0%):</td>
                              <td className="pe-16">
                                <span className="text-primary-light fw-semibold">
                                  $0.00
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64 border-bottom pb-4">
                                Tax (18%):
                              </td>
                              <td className="pe-16 border-bottom pb-4">
                                <span className="text-primary-light fw-semibold">
                                  {formatCurrency(tax)}
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
                                  {formatCurrency(total)}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* Signature Section */}
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

export default EditInvoice;