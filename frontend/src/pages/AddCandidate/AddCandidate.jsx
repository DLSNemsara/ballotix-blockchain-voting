import axios from "axios";
import { useContext, useState, useRef } from "react";
import { useUserValidation } from "../../components/hooks/user-validation";
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";
import web3 from "../../ethereum/web3";
import AuthContext from "../../store/auth-context";
import Electioneth from "../../ethereum/election";
import {
  MdOutlineDriveFileRenameOutline,
  MdOutlineDescription,
} from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoCloseCircle } from "react-icons/io5";

const AddCandidate = () => {
  const { election, validAccount, notify } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pic, setPic] = useState();
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  useUserValidation(true);

  const addCandidateHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validAccount) {
      notify("You are using wrong ethereum account", "error");
      setLoading(false);
      return;
    }

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("image", pic);
      const resource = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const url = resource.data.file;
      setLink(url);

      if (!url) {
        notify("Error uploading image", "error");
        setLoading(false);
        return;
      }

      // Add candidate to smart contract
      const Election = Electioneth(election);
      const accounts = await web3.eth.getAccounts();

      await Election.methods.addCandidate(name, description, url).send({
        from: accounts[0],
      });

      notify("Candidate added successfully", "success");
      navigate("/election");
    } catch (err) {
      notify(err.message, "error");
    }
    setLoading(false);
  };

  // Handle file input and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    setPic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setPic(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {!loading && (
        <div className="flex justify-center items-center px-2 py-8 min-h-screen bg-gray-50 sm:px-4">
          <div className="p-8 mx-auto space-y-8 w-full max-w-lg bg-white rounded-3xl shadow-2xl sm:p-10">
            <div>
              <h2 className="mb-2 text-3xl font-extrabold text-center text-gray-900">
                Add a Candidate
              </h2>
              <p className="text-sm text-center text-gray-500">
                Fill in the details below to add a new candidate.
              </p>
            </div>
            <form
              className="space-y-6"
              onSubmit={addCandidateHandler}
              autoComplete="off"
            >
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <MdOutlineDriveFileRenameOutline className="w-5 h-5 text-indigo-400" />
                  </span>
                  <input
                    name="name"
                    id="name"
                    className="block py-2 pr-3 pl-10 w-full placeholder-gray-400 rounded-lg border border-gray-200 shadow-sm transition-all duration-150 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    value={name}
                    placeholder="Enter candidate's name"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Description
                </label>
                <div className="relative">
                  <span className="flex absolute left-0 top-2 items-center pl-3 pointer-events-none">
                    <MdOutlineDescription className="w-5 h-5 text-indigo-400" />
                  </span>
                  <textarea
                    rows="5"
                    name="description"
                    id="description"
                    className="block py-2 pr-3 pl-10 w-full placeholder-gray-400 rounded-lg border border-gray-200 shadow-sm transition-all duration-150 resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    placeholder="Add candidate's description. Max: 150 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="150"
                    required
                  />
                </div>
                <div className="mt-1 text-xs text-right text-gray-400">
                  {description.length}/150
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label
                  htmlFor="image"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Upload image
                </label>
                <div
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                    preview
                      ? "bg-indigo-50 border-indigo-400"
                      : "bg-gray-50 border-gray-200 hover:border-indigo-300"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  style={{ cursor: "pointer" }}
                >
                  {!preview ? (
                    <>
                      <AiOutlineCloudUpload className="mb-2 w-10 h-10 text-indigo-400" />
                      <p className="mb-1 text-sm text-gray-500">
                        Drag & drop or{" "}
                        <span className="text-indigo-600 underline">
                          browse
                        </span>{" "}
                        to upload
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG or JPG, max 2MB
                      </p>
                    </>
                  ) : (
                    <div className="relative mb-2 w-32 h-32">
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover w-full h-full rounded-lg shadow"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow transition hover:bg-red-100"
                        tabIndex={-1}
                      >
                        <IoCloseCircle className="w-6 h-6 text-red-500" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                    name="image"
                    id="image"
                    ref={fileInputRef}
                    className="hidden"
                    required={!preview}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-2.5 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && <Loading />}
    </>
  );
};

export default AddCandidate;
