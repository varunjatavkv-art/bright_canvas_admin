import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// Use Quill directly (avoid react-quill which calls findDOMNode)
import Quill from "quill";
import "quill/dist/quill.snow.css";

import "highlight.js/styles/github.css";

const EditBlogForm = () => {
  const { blogId } = useParams();

  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  // State to hold the description HTML (Quill content)
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  // State to hold the existing image URL from the server
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);

  // capture initial value at mount to avoid effect dependencies
  // We'll update this ref in the fetch useEffect
  const initialValueRef = useRef(""); // Initialize as empty string

  // --- 1. FETCH BLOG DATA AND SET INITIAL STATES ---
  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API + `api/blogs/${blogId}`
        );

        if (response.status === 200) {
          const blogData = response.data;
          setTitle(blogData?.title || "");

          // ⭐️ Set initial Quill content and update ref for Quill init useEffect
          const descriptionHtml = blogData?.description || "";
          setValue(descriptionHtml); // for state tracking
          initialValueRef.current = descriptionHtml; // ⭐️ This is used by the Quill useEffect

          // ⭐️ Set existing image URL
          if (blogData?.image) {
            // Assuming your backend returns a partial path, construct the full URL
            const imageUrl = import.meta.env.VITE_API + blogData.image;
            setImagePreview(imageUrl);
            setExistingImageUrl(blogData.image); // Store server path
          }

          // ⭐️ If Quill is already initialized, manually set the content now that we have it
          const editor = quillRef.current?.getEditor?.();
          if (editor) {
             editor.root.innerHTML = descriptionHtml;
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchSingleBlog();
  }, [blogId]);

  // --- 2. INITIALIZE QUILL EDITOR ---
  useEffect(() => {
    if (!editorContainerRef.current) return;
    // prevent double initialization
    if (editorContainerRef.current.__quill) return;

    // Register whitelists and modules (keep existing logic)
    const Font = Quill.import("formats/font");
    Font.whitelist = ["sans-serif", "serif", "monospace", "roboto"];
    Quill.register(Font, true);

    const Size = Quill.import("attributors/style/size");
    Size.whitelist = ["12px", "14px", "18px", "24px"];
    Quill.register(Size, true);

    const localModules = { toolbar: { container: "#toolbar-container" } };

    // Populate toolbar select options (keep existing logic)
    const toolbarEl = document.getElementById("toolbar-container");
    if (toolbarEl) {
      const sizeSelect = toolbarEl.querySelector(".ql-size");
      if (sizeSelect && sizeSelect.options.length === 0) {
        [
          { name: "Small", size: "12px" },
          { name: "Medium", size: "14px" },
          { name: "Large", size: "18px" },
          { name: "Huge", size: "24px" },
        ].forEach((sz) => {
          const opt = document.createElement("option");
          opt.value = sz.size;
          opt.innerText = sz.name;
          sizeSelect.appendChild(opt);
        });
      }

      const fontSelect = toolbarEl.querySelector(".ql-font");
      if (fontSelect && fontSelect.options.length === 0) {
        ["sans-serif", "serif", "monospace", "roboto"].forEach((f) => {
          const opt = document.createElement("option");
          opt.value = f;
          opt.innerText = f;
          fontSelect.appendChild(opt);
        });
      }
    }

    const q = new Quill(editorContainerRef.current, {
      modules: localModules,
      theme: "snow",
      placeholder: "Compose an epic...",
    });

    // ⭐️ Use initialValueRef.current here to set the content
    // This value might be empty on the first render, but the fetch useEffect
    // handles setting it later if the fetch is slow.
    if (initialValueRef.current) {
        q.root.innerHTML = initialValueRef.current;
    }

    q.on("text-change", () => {
      setValue(q.root.innerHTML);
    });

    // expose similar API as react-quill's ref.getEditor()
    quillRef.current = {
      getEditor: () => q,
    };

    // mark as initialized
    editorContainerRef.current.__quill = q;

    return () => {
      q.off("text-change");
      // Clean up if needed
    };
  }, []); // Empty dependency array ensures it runs only once on mount

  // --- 3. HANDLE IMAGE CHANGES ---
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (imagePreview && !existingImageUrl) URL.revokeObjectURL(imagePreview);
    const src = URL.createObjectURL(file);
    setImagePreview(src);
    setImageFile(file);
    setExistingImageUrl(null); // Clear existing URL if a new file is uploaded
  };

  const handleRemoveImage = () => {
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);

    setImagePreview(null);
    setImageFile(null);
    setExistingImageUrl(null); // Set to null to signal to backend to remove the image
  };

  // --- 4. HANDLE FORM SUBMISSION (UPDATE) ---
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const editor = quillRef.current?.getEditor?.();
    const descriptionHtml = editor?.root?.innerHTML ?? "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", descriptionHtml);

    if (imageFile) {
      // New image file selected
      formData.append("image", imageFile);
    } else if (existingImageUrl === null) {
      // Image was removed, but no new one was uploaded.
      // Your backend should check for this key to delete the old image.
      formData.append("image_action", "remove");
    }

    try {
      // ⭐️ Use axios.put for updating the existing blog
      const res = await axios.put(
        import.meta.env.VITE_API + `api/blogs/update/${blogId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        alert("Blog updated successfully!");
        navigate("/blog");
      } else {
        console.warn("Unexpected response:", res.status, res.data);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred during update.";
      console.error("Update error:", err);
      alert(errorMessage);
    }
  };

  // --- 5. RENDER JSX ---
  return (
    <div className="col-lg-8">
      <div className="card mt-24">
        <div className="card-header border-bottom">
          <h6 className="text-xl mb-0">Edit Blog</h6>
        </div>
        <div className="card-body p-24">
          <form
            onSubmit={handleSubmitForm}
            encType="multipart/form-data"
            className="d-flex flex-column gap-20"
          >
            <div>
              <label
                className="form-label fw-bold text-neutral-900"
                htmlFor="title"
              >
                Blog Title:{" "}
              </label>
              <input
                type="text"
                className="form-control border border-neutral-200 radius-8"
                id="title"
                placeholder="Enter Post Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label fw-bold text-neutral-900">
                Blog Description
              </label>
              <div className="border border-neutral-200 radius-8 overflow-hidden">
                <div className="height-200">
                  {/* Toolbar */}
                  <div id="toolbar-container">
                    <span className="ql-formats">
                      <select className="ql-font"></select>
                      <select className="ql-size"></select>
                    </span>
                    <span className="ql-formats">
                      <button className="ql-bold"></button>
                      <button className="ql-italic"></button>
                      <button className="ql-underline"></button>
                      <button className="ql-strike"></button>
                    </span>
                    <span className="ql-formats">
                      <select className="ql-color"></select>
                      <select className="ql-background"></select>
                    </span>
                    <span className="ql-formats">
                      <button className="ql-script" value="sub"></button>
                      <button className="ql-script" value="super"></button>
                    </span>
                    <span className="ql-formats">
                      <button className="ql-header" value="1"></button>
                      <button className="ql-header" value="2"></button>
                      <button className="ql-blockquote"></button>
                      <button className="ql-code-block"></button>
                    </span>
                    <span className="ql-formats">
                      <button className="ql-list" value="ordered"></button>
                      <button className="ql-list" value="bullet"></button>
                      <button className="ql-indent" value="-1"></button>
                      <button className="ql-indent" value="+1"></button>
                    </span>
                    <span className="ql-formats">
                      <button className="ql-direction" value="rtl"></button>
                      <select className="ql-align"></select>
                    </span>
                    <span className="ql-formats">
                      <button className="ql-link"></button>
                      <button className="ql-image"></button>
                      <button className="ql-video"></button>
                      <button className="ql-formula"></button>
                    </span>
                    <span className="ql-formats">
                      <button className="ql-clean"></button>
                    </span>
                  </div>

                  {/* Editor container - Quill will be instantiated into this element */}
                  <div
                    ref={editorContainerRef}
                    className="quill-editor h-100"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="form-label fw-bold text-neutral-900">
                Upload Thumbnail
              </label>
              <div className="upload-image-wrapper">
                {imagePreview ? (
                  <div className="uploaded-img position-relative h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                      aria-label="Remove uploaded image"
                    >
                      <Icon
                        icon="radix-icons:cross-2"
                        className="text-xl text-danger-600"
                      ></Icon>
                    </button>
                    <img
                      id="uploaded-img__preview"
                      className="w-100 h-100 object-fit-cover"
                      src={imagePreview}
                      alt="Uploaded"
                    />
                  </div>
                ) : (
                  <label
                    className="upload-file h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1"
                    htmlFor="upload-file"
                  >
                    <iconify-icon
                      icon="solar:camera-outline"
                      className="text-xl text-secondary-light"
                    ></iconify-icon>
                    <span className="fw-semibold text-secondary-light">
                      Upload
                    </span>
                    <input
                      id="upload-file"
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept=".jpeg, .jpg, .png"
                    />
                  </label>
                )}
              </div>
            </div>
            <button type="submit" className="btn btn-primary-600 radius-8">
              Update Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlogForm;