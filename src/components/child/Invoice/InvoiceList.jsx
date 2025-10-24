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
import { EmptyData } from "../../common/EmptyData";

const InvoiceList = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  useEffect(() => {
    // setLoading(true);
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/invoice?page=${currentPage}&limit=${limit}&search=${search}&status=${status}`
        );
        setInvoiceList(res.data);
        setLoading(false);
        setError(false);
        setTotalItems(res.data.totalItems);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error.message);
        setError(true);
      }
    };
    fetchInvoices();
  }, [currentPage, search, limit, status]);

  const getPages = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max number of page numbers to show (e.g., 1 ... 3 4 [5] 6 7 ... 10)
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      // Fewer than maxPagesToShow total pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than maxPagesToShow total pages
      const middle = Math.floor(maxPagesToShow / 2);
      if (currentPage <= middle) {
        // Near the start
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + middle >= totalPages) {
        // Near the end
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // In the middle
        startPage = currentPage - middle + (maxPagesToShow % 2 === 0 ? 1 : 0);
        endPage = currentPage + middle;
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // Add the page numbers in the calculated range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return [...new Set(pageNumbers)];
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/invoice/delete/${id}`);
      if (res.status == 200) {
        alert(res.data.message);
        setInvoiceList((prevInvoice) => {
          if (prevInvoice && Array.isArray(prevInvoice.data)) {
            // If it's the full object, filter the 'data' array and return the new object
            const newArray = prevInvoice.data.filter(
              (invoice) => invoice._id !== id
            );
            return {
              ...prevInvoice, // Keep other properties like totalPages, etc.
              data: newArray, // Update only the 'data' property
            };
          }

          // Fallback for when the state IS just the array (e.g., if you changed the fetch logic)
          if (Array.isArray(prevInvoice)) {
            return prevInvoice.filter((invoice) => invoice._id !== id);
          }

          return prevInvoice;
        });
      }
    } catch (error) {
      console.error(error.message);
      setError(true);
    }
  };
  if (invoiceList?.totalItems == 0) {
    return (
      <EmptyData message="Invoice List is Empty !! Please create some invoices" />
    );
  }
  if (Loading) {
    return <LoadingComponent />;
  }
  if (error) {
    return <NotFound />;
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
                onClick={(e) => setLimit(e.target.value)}
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
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="icon">
                <Icon icon="ion:search-outline" />
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3">
            <select
              className="form-select form-select-sm w-auto"
              defaultValue=""
              onClick={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="0">Pending</option>
              <option value="1">Paid</option>
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
              {invoiceList.data?.map((invoice, idx) => {
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
                        <span className="font-medium text-gray-700 px-4">
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
                      <span
                        className={
                          invoice.summary?.status === "0"
                            ? ` bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm`
                            : `bg-success-focus text-red-main px-24 py-4 rounded-pill fw-medium text-sm`
                        }
                      >
                        {invoice.summary?.status === "0" ? "Pending" : "Paid"}
                        {/* Paid */}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <Link
                       to={`/invoice/invoice-preview/${invoice._id}`}
                        className="w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>

                      <Link
                         to={`/invoice/invoice-edit/${invoice._id}`}
                        className="w-32-px h-32-px  me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>

                      <button
                        onClick={() => handleDelete(invoice._id)}
                        className="w-32-px h-32-px  me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="mingcute:delete-2-line" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
            <span>Showing {startItem} to {endItem} of {totalItems} entries</span> */}
          {/* Dynamic Pagination Controls */}
          {!Loading && totalPages > 1 && totalItems > 0 && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
              <span>
                Showing {startItem} to {endItem} of {totalItems} entries
              </span>

              <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                {/* Previous Page Button */}
                <li className="page-item">
                  <button
                    className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo; {/* Icon: Double left arrow */}
                  </button>
                </li>

                {/* Dynamic Page Links */}
                {getPages().map((page, index) => (
                  <li className="page-item" key={index}>
                    {page === "..." ? (
                      <span className="page-link text-gray-500 fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px">
                        ...
                      </span>
                    ) : (
                      <button
                        className={`page-link fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px 
                                ${
                                  currentPage === page
                                    ? "bg-primary-600 text-white"
                                    : "bg-primary-50 text-secondary-light hover:bg-primary-100"
                                }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )}
                  </li>
                ))}

                {/* Next Page Button */}
                <li className="page-item">
                  <button
                    className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &raquo; {/* Icon: Double right arrow */}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default InvoiceList;
