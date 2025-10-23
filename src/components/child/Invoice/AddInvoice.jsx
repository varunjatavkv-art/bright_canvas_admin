import { Icon } from "@iconify/react/dist/iconify.js";
import Breadcrumb from "../../Breadcrumb";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { formatCurrency } from "../../../commonFunctions/common.functions";
import { useNavigate } from "react-router-dom";

const AddInvoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [orderID, setOrderID] = useState("");
  const [shipmentID, setShipmentID] = useState("");

  const [issueDate, setIssueDate] = useState();
  const [dueDate, setDueDate] = useState();

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [status, setStatus] = useState("-1");


  const navigate = useNavigate();

  const createNewItem = (serial) => ({
    id: uuidv4(), // Unique identifier for React key and state updates
    serial: serial,
    description: "",
    qty: 1,
    unit: "-1",
    unitPrice: 0,
  });
  const [items, setItems] = useState([createNewItem(1)]);

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
    };

    const generateShipmentID = () => {
      const newShipmentID = uuidv4();
      const formatedID = `${newShipmentID
        .replace(/-/g, "")
        .toUpperCase()
        .substring(7, 11)}`;
      setShipmentID(formatedID);
    };

    generateInvoiceNumber();
    generateOrderID();
    generateShipmentID();
  }, []);

  const handleAddItem = () => {
    const newSerial = items.length + 1;
    setItems((prevItems) => [...prevItems, createNewItem(newSerial)]);
  };

  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // Convert numeric fields to numbers, handling potential NaN
          if (field === "qty" || field === "unitPrice") {
            const numValue = parseFloat(value) || 0;
            return { ...item, [field]: numValue < 0 ? 0 : numValue };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleRemoveRow = (idToRemove) => {
    setItems((prevItems) => {
      const updatedItems = prevItems
        .filter((item) => item.id !== idToRemove)
        // Recalculate serial numbers
        .map((item, index) => ({ ...item, serial: index + 1 }));
      return updatedItems;
    });
  };

  // --- Invoice Totals Calculation ---
  const { subtotal, total, tax } = useMemo(() => {
    const calculatedSubtotal = items.reduce(
      (acc, item) => acc + item.qty * item.unitPrice,
      0
    );

    // For simplicity, using static values from your original component
    const discountAmount = 0; // Could be dynamic state
    const taxRate = 18; // Could be dynamic state
    const taxAmount = Math.round((calculatedSubtotal * taxRate) / 100);
    // taxAmount = Math.round(taxAmount);

    const calculatedTotal = calculatedSubtotal - discountAmount + taxAmount;

    return {
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      tax: taxAmount,
    };
  }, [items]);

  // submit form

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted. Preventing page reload.");

    // --- Accessing All State Data ---
    const invoiceData = {
      metadata: {
        invoiceNumber,
        orderID,
        shipmentID,
        issueDate,
        dueDate,
      },
      customer: {
        name: customerName,
        address: customerAddress,
        phone: customerPhone,
      },
      items: items,
      summary: {
        subtotal: subtotal,
        total: total,
        tax: tax,
        status: status
      },
    };

    console.log(invoiceData);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/invoice`,
        invoiceData
      );
      console.log(res);
      setInvoiceNumber("");
      setOrderID("");
      setShipmentID("");
      setIssueDate("");
      // setItems("");
      setCustomerAddress("");
      setCustomerName("");
      setCustomerPhone("");
      setDueDate("");
      setStatus("");
      navigate('invoice');
    } catch (error) {
      console.error("Error in post request :", error);
    }
  };

  return (
    <>
      <Breadcrumb title={"Add Invoice"} />
      <form className="card" onSubmit={handleSubmit}>
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
                      <h3 className="text-xl">Invoice #{invoiceNumber}</h3>
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
                    <div className="col-sm-4">
                      <img
                        src="../../../assets/images/logo.png"
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
                                onChange={(e) =>
                                  setCustomerName(e.target.value)
                                }
                              />
                              {/* <span className="text-success-main">
                                <Icon icon="mage:edit" />
                              </span> */}
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
                                onChange={(e) =>
                                  setCustomerAddress(e.target.value)
                                }
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
                                onChange={(e) =>
                                  setCustomerPhone(e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table className="text-sm text-secondary-light">
                        <tbody>
                          <tr>
                            <td>Status :</td>
                            <td className="ps-8 px-2">
                              <select name="status" id="status" onChange={(e) => setStatus(e.target.value)}>
                              <option value="-1">Select</option>
                                <option value="0">Pending</option>
                                <option value="1">Paid</option>
                              </select>
                            </td>
                          </tr>
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
                          {items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b hover:bg-gray-50 transition duration-100"
                            >
                              <td className="px-3 py-3 text-center">
                                {String(item.serial).padStart(2, "0")}
                              </td>
                              <td className="px-6 py-3">
                                <input
                                  type="text"
                                  placeholder="Type item name here"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                />
                              </td>
                              <td className="px-6 py-3">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.qty}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "qty",
                                      e.target.value
                                    )
                                  }
                                  className="w-16 text-center border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                />
                              </td>
                              <td className="px-6 py-3">
                                <select
                                  value={item.unit}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                >
                                  <option value="-1">Units</option>
                                  <option value="0">PC</option>
                                  <option value="1">KG</option>
                                  <option value="2">HR</option>
                                </select>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="flex items-center justify-end">
                                  <span>₹</span>
                                  <input
                                    type="text"
                                    placeholder="Price"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      handleItemChange(
                                        item.id,
                                        "unitPrice",
                                        e.target.value
                                      )
                                    }
                                    className="w-20 text-right border-b border-gray-200 p-1 focus:outline-none focus:border-blue-400"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right font-semibold text-gray-700">
                                {formatCurrency(item.qty * item.unitPrice)}
                              </td>
                              <td className="text-center px-3 py-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRow(item.id)}
                                  className="text-red-500 hover:text-red-700 transition duration-150 p-1 rounded-full hover:bg-red-50"
                                >
                                  <Icon
                                    icon="ic:twotone-close"
                                    className="w-5 h-5"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <button
                        type="button"
                        id="addRow"
                        className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                        onClick={handleAddItem}
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
                                  {formatCurrency(subtotal)}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="pe-64">Discount (0%):</td>
                              <td className="pe-16">
                                <span className="text-primary-light fw-semibold">
                                  {formatCurrency(0)}
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
