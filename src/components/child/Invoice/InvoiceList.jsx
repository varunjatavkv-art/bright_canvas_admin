import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Breadcrumb";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  formatDate,
  formatCurrency,
} from "../../../commonFunctions/common.functions";
import LoadingComponent from "../../common/LoadingComponent";
import NotFound from "../../common/NotFound";

const InvoiceList = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // setLoading(true);
    const fetchInvoices = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/invoice");
        console.log(res.data);
        setInvoiceList(res.data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error(error.message);
        setError(true);
      }
    };
    fetchInvoices();
  }, []);

  if(Loading){
    return <LoadingComponent/>
  }
  if(error){
    return <NotFound />
  }
  return (
    <>
      <Breadcrumb title={"Invoice List"} />
      <div className="card">
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span>Show</span>
              <select
                className="form-select form-select-sm w-auto"
                defaultValue="Select Number"
              >
                <option value="Select Number" disabled>
                  Select Number
                </option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
            <div className="icon-field">
              <input
                type="text"
                name="#0"
                className="form-control form-control-sm w-auto"
                placeholder="Search"
              />
              <span className="icon">
                <Icon icon="ion:search-outline" />
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3">
            <select
              className="form-select form-select-sm w-auto"
              defaultValue="Select Status"
            >
              <option value="Select Status" disabled>
                Select Status
              </option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <Link to="invoice-add" className="btn btn-sm btn-primary-600">
              <i className="ri-add-line" /> Create Invoice
            </Link>
          </div>
        </div>
        <div className="card-body">
          <table className="table bordered-table mb-0">
            <thead>
              <tr>
                <th scope="col">
                  <div className="form-check style-check d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id="checkAll"
                    />
                    <label className="form-check-label" htmlFor="checkAll">
                      S.L
                    </label>
                  </div>
                </th>
                <th scope="col">Invoice</th>
                <th scope="col">Name</th>
                <th scope="col">Issued Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((invoice, idx) => {
                // Safely access the first item's serial number for the list index column
                const serialNumber = idx + 1;

                return (
                  <tr
                    key={invoice._id}
                    className="hover:bg-indigo-50 transition duration-150"
                  >
                    {/* # (Serial) */}
                    <td>
                      <div className="form-check style-check d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue=""
                          id="check1"
                        />

                        <label className="form-check-label" htmlFor="check1">
                          {serialNumber}
                        </label>
                      </div>
                    </td>

                    {/* Invoice ID */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
                        // Use metadata.invoiceNumber
                      >
                        #{invoice.metadata?.invoiceNumber || "N/A"}
                      </a>
                    </td>

                    {/* Customer Name */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <img
                          // Placeholder image from placehold.co
                          src={`https://placehold.co/32x32/6366f1/ffffff?text=${
                            invoice.customer?.name?.[0] || "U"
                          }`}
                          alt={`Avatar for ${invoice.customer?.name || "User"}`}
                          className="flex-shrink-0 w-8 h-8 rounded-full mr-3 border border-indigo-200"
                        />
                        <span className="font-medium text-gray-700">
                          {/* Use customer.name */}
                          {invoice.customer?.name || "Unknown Customer"}
                        </span>
                      </div>
                    </td>

                    {/* Date Issued (metadata.issueDate) */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {/* Use formatDate utility */}
                      {formatDate(invoice.metadata?.issueDate)}
                    </td>

                    {/* Total Amount (summary.total) */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-bold text-gray-900">
                      {/* Use formatCurrency utility */}
                      {formatCurrency(invoice.summary?.total)}
                    </td>

                    {/* Status (Hardcoded as Paid based on original JSX) */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={ invoice.summary?.status === "0" ? ` bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm`: `bg-success-focus text-red-main px-24 py-4 rounded-pill fw-medium text-sm`}>
                        {invoice.summary?.status === "0" ? "Pending" : "Paid"}
                        {/* Paid */}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <Link
                        to="#"
                        className="w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>

                      <Link
                        to="#"
                        className="w-32-px h-32-px  me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>

                      <Link
                        to="#"
                        className="w-32-px h-32-px  me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="mingcute:delete-2-line" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
            <span>Showing 1 to 10 of 12 entries</span>
            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
              <li className="page-item">
                <Link
                  className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                  to="#"
                >
                  <Icon icon="ep:d-arrow-left" className="text-xl" />
                </Link>
              </li>
              <li className="page-item">
                <Link
                  className="page-link bg-primary-600 text-white fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                  to="#"
                >
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link
                  className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                  to="#"
                >
                  2
                </Link>
              </li>
              <li className="page-item">
                <Link
                  className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                  to="#"
                >
                  3
                </Link>
              </li>
              <li className="page-item">
                <Link
                  className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                  to="#"
                >
                  {" "}
                  <Icon icon="ep:d-arrow-right" className="text-xl" />{" "}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceList;
