import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";

// Use Quill directly (avoid react-quill which calls findDOMNode)
import Quill from "quill";
import "quill/dist/quill.snow.css";

import "highlight.js/styles/github.css";
import { useNavigate, useParams } from "react-router-dom";

const EditWorkForm = () => {
  const { workId } = useParams();
  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  const [value, setValue] = useState(null);
  const [service, setService] = useState(null);
  const [title, setTitle] = useState("");

  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const quillRef = useRef(null);
  const serviceQuillRef = useRef(null);
  const editorContainerRef = useRef(null);
  const serviceContainerRef = useRef(null);
  // capture initial value at mount to avoid effect dependencies
  const initialValueRef = useRef(value);
  const initialServiceRef = useRef(service);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSingleWork = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API + `api/work/${workId}`
        );

        if (response.status === 200) {
          const workData = response.data;
          setTitle(workData?.title || "");

          // ⭐️ Set initial Quill content and update ref for Quill init useEffect
          const descriptionHtml = workData?.description || "";
          const serviceHtml = workData?.service || "";
          setValue(descriptionHtml); // for state tracking
          setService(serviceHtml);
          initialValueRef.current = descriptionHtml; // ⭐️ This is used by the Quill useEffect
          initialServiceRef.current = serviceHtml;
          // ⭐️ Set existing image URL
          if (workData?.image) {
            // Assuming your backend returns a partial path, construct the full URL
            const imageUrl = import.meta.env.VITE_API + workData.image;
            setImagePreview(imageUrl);
            setExistingImageUrl(workData.image); // Store server path
          }

          // ⭐️ If Quill is already initialized, manually set the content now that we have it
          const editor = quillRef.current?.getEditor?.();
          const serviceEditor = serviceQuillRef.current?.getEditor?.();
          if (editor && serviceEditor) {
             editor.root.innerHTML = descriptionHtml;
             serviceEditor.root.innerHTML = serviceHtml;
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchSingleWork();
  }, [workId]);


  useEffect(() => {
    if (!editorContainerRef.current) return;
    // prevent double initialization
    if (editorContainerRef.current.__quill) return;
    // register whitelists
    const Font = Quill.import("formats/font");
    Font.whitelist = ["sans-serif", "serif", "monospace", "roboto"];
    Quill.register(Font, true);

    const Size = Quill.import("attributors/style/size");
    Size.whitelist = ["12px", "14px", "18px", "24px"];
    Quill.register(Size, true);

    const localModules = { toolbar: { container: "#toolbar-container" } };

    // Populate toolbar select options (when toolbar DOM exists, Quill won't auto-fill these)
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

    // set initial content (captured at mount)
    if (initialValueRef.current) q.root.innerHTML = initialValueRef.current;

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
      // destroy quill DOM and listeners if needed
    };
  }, []);

  useEffect(() => {
    if (!serviceContainerRef.current) return;
    // prevent double initialization
    if (serviceContainerRef.current.__quill) return;
    // register whitelists
    const ServiceFont = Quill.import("formats/font");
    ServiceFont.whitelist = ["sans-serif", "serif", "monospace", "roboto"];
    Quill.register(ServiceFont, true);

    const ServiceSize = Quill.import("attributors/style/size");
    ServiceSize.whitelist = ["12px", "14px", "18px", "24px"];
    Quill.register(ServiceSize, true);

    const serviceLocalModules = {
      toolbar: { container: "#toolbar-container-service" },
    };

    // Populate toolbar select options (when toolbar DOM exists, Quill won't auto-fill these)
    const ServiceToolbarEl = document.getElementById(
      "toolbar-container-service"
    );
    if (ServiceToolbarEl) {
      const sizeSelect = ServiceToolbarEl.querySelector(".ql-size");
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

      const fontSelect = ServiceToolbarEl.querySelector(".ql-font-service");
      if (fontSelect && fontSelect.options.length === 0) {
        ["sans-serif", "serif", "monospace", "roboto"].forEach((f) => {
          const opt = document.createElement("option");
          opt.value = f;
          opt.innerText = f;
          fontSelect.appendChild(opt);
        });
      }
    }

    const q2 = new Quill(serviceContainerRef.current, {
      modules: serviceLocalModules,
      theme: "snow",
      placeholder: "Compose an epic...",
    });

    // set initial content (captured at mount)
    if (initialServiceRef.current)
      q2.root.innerHTML = initialServiceRef.current;

    q2.on("text-change", () => {
      setService(q2.root.innerHTML);
    });

    // expose similar API as react-quill's ref.getEditor()
    serviceQuillRef.current = {
      getEditor: () => q2,
    };

    // mark as initialized
    serviceContainerRef.current.__quill = q2;

    return () => {
      q2.off("text-change");
      // destroy quill DOM and listeners if needed
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // revoke previous preview
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const src = URL.createObjectURL(file);
    setImagePreview(src);
    setImageFile(file); // store actual File for upload
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
  };
  // inside your component

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // get the Quill instance safely (from quillRef or the DOM-stored instance)
    const editor =
      quillRef.current?.getEditor?.() || editorContainerRef.current?.__quill;

    // get the Service Quill instance safely
    const serviceEditor =
      serviceQuillRef.current?.getEditor?.() ||
      serviceContainerRef.current?.__quill;

    // extract HTML content
    const descriptionHtml = editor?.root?.innerHTML ?? "";

    const serviceHtml = serviceEditor?.root?.innerHTML ?? "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", descriptionHtml);
    formData.append("service", serviceHtml);
    if (imageFile) formData.append("image", imageFile);
    try {
      const res = await axios.put(
        import.meta.env.VITE_API + "api/work/update/" + workId,
        formData
      );
      if (res.status === 200) {
        alert("Work edited successfully!");
        setTitle("");
        setValue("");
        setService("");
        handleRemoveImage();
        if (editor) editor.root.innerHTML = "";
        navigate("/work");
      } else {
        console.warn("Unexpected response:", res.status, res.data);
      }
    } catch (err) {
      if (err.status == 400) {
        alert(err.response.data.message);
      } else {
        console.error("Upload error:", err.message);
        alert(err);
      }
    }
  };
  return (
    <div className="col-lg-8">
      <div className="card mt-24">
        <div className="card-header border-bottom">
          <h6 className="text-xl mb-0">Edit Work</h6>
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
                Works Title:{" "}
              </label>
              <input
                type="text"
                className="form-control border border-neutral-200 radius-8"
                id="title"
                placeholder="Enter Work Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label fw-bold text-neutral-900">
                Work Description
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
                Service Description
              </label>
              <div className="border border-neutral-200 radius-8 overflow-hidden">
                <div className="height-200">
                  {/* Toolbar */}
                  <div id="toolbar-container-service">
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
                    ref={serviceContainerRef}
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
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWorkForm;
