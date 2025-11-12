import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../global.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//? Blog
import Blog from "./components/Blog.jsx";
import AddBlog from "./components/child/Blog/AddBlog.jsx";
import BlogDetailsLayer from "./components/child/Blog/BlogDetails.jsx";
import BlogLayer from "./components/child/Blog/BlogLayer.jsx";

//? Works
import Work from "./components/Work.jsx";
import AddWork from "./components/child/Work/AddWork.jsx";
import WorkDetails from "./components/child/Work/WorkDetails.jsx";
import WorkLayer from "./components/child/Work/WorkLayer.jsx";

//? Invoice
import Invoice from "./components/Invoice.jsx";
import AddInvoice from "./components/child/Invoice/AddInvoice.jsx";
import InvoiceList from "./components/child/Invoice/InvoiceList.jsx";
import InvoicePreview from "./components/child/Invoice/InvoicePreview.jsx";
import EditInvoice from "./components/child/Invoice/EditInvoice.jsx";
import NotFound from "./components/common/NotFound.jsx";
import EditBlog from "./components/child/Blog/EditBlog.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BlogLayer />} />
          <Route path="blog" element={<Blog />}>
            <Route index element={<BlogLayer />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="blog-details/:blogId" element={<BlogDetailsLayer />} />
            <Route path="blog-edit/:blogId" element={<EditBlog />} />
          </Route>
          <Route path="work" element={<Work />}>
            <Route index element={<WorkLayer />} />
            <Route path="add-work" element={<AddWork />} />
            <Route path="work-details/:workId" element={<WorkDetails />} />
            <Route path="work-edit/:workId" element={<WorkDetails />} />
          </Route>
          <Route path="invoice" element={<Invoice />}>
            <Route index element={<InvoiceList />} />
            <Route path="invoice-add" element={<AddInvoice />} />
            <Route path="invoice-preview/:invoiceId" element={<InvoicePreview />} />
            <Route path="invoice-edit/:invoiceId" element={<EditInvoice />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
