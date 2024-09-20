import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/userContext";
import Modal from "./Modal";

const Education_component = ({ user }) => {
  const navigate = useNavigate();
  const { updateUser, addData, deleteData } = UserData(); // Assuming you have a deleteData function

  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [addEducation, setAddEducation] = useState(false);
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(null);
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // Open modal with selected education data
  const handleOpenEditEducation = (education, index) => {
    setSelectedEducationIndex(index);
    setSchool(education.school);
    setDegree(education.degree);
    setStartDate(education.startDate.split("T")[0]); // Extract date part only
    setEndDate(education.endDate ? education.endDate.split("T")[0] : ""); // Extract date part only
    setDescription(education.description);
    setIsEducationModalOpen(true);
  };

  const editHandler = async (e) => {
    e.preventDefault();

    const updatedEducation = {
      school,
      degree,
      startDate,
      endDate,
      description,
    };
    const updatedEducations = [...user.education];
    updatedEducations[selectedEducationIndex] = updatedEducation;

    const formData = new FormData();
    formData.append("education", JSON.stringify(updatedEducations));

    await updateUser(formData, navigate);
    setIsEducationModalOpen(false);
  };

  const addEducationHandler = async (e) => {
    e.preventDefault();

    if (!school || !degree || !startDate) {
      alert("Please fill out all required fields (School, Degree, Start Date)");
      return;
    }

    const formData = new FormData();
    formData.append(
      "education",
      JSON.stringify({
        school,
        degree,
        startDate,
        endDate,
        description,
      })
    );

    await addData(formData, navigate);
    setAddEducation(false);
    // Clear the input fields
    setSchool("");
    setDegree("");
    setStartDate("");
    setEndDate("");
    setDescription("");
  };

  const handleDeleteEducation = async (index) => {
    const updatedEducations = user.education.filter((_, i) => i !== index);

    const formData = new FormData();
    formData.append("education", JSON.stringify(updatedEducations));

    await updateUser(formData, navigate);
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 space-x-2 sm:space-x-4">
          <button
            className="text-gray-800 hover:text-[#FFA904]"
            onClick={() => setAddEducation(true)}
          >
            <FaPlus />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Education</h2>
        <div className="mt-4 space-y-4">
          {user.education.length === 0
            ? "No education added"
            : user.education.map((edu, index) => (
                <div
                  key={index}
                  className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-md font-semibold">
                      {edu.degree} {" | "} {edu.school}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {new Date(edu.startDate).toLocaleDateString()} -{" "}
                      {edu.endDate
                        ? new Date(edu.endDate).toLocaleDateString()
                        : "Present"}{" "}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {edu.description}
                    </p>
                  </div>
                  <div className="mt-2 sm:-mt-16 flex space-x-2 absolute sm:relative top-2 right-2 sm:top-4 sm:right-4">
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Edit Education"
                      onClick={() => handleOpenEditEducation(edu, index)}
                    >
                      <FaEdit className=" w-4 max-sm:w-3" />
                    </button>
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Delete Education"
                      onClick={() => handleDeleteEducation(index)}
                    >
                      <FaTrash className=" h-4 max-sm:h-3" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Add Education Modal */}
      {addEducation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Education</h2>
              <button
                className="text-2xl text-gray-600 hover:text-gray-800"
                onClick={() => setAddEducation(false)}
              >
                &times; {/* Close button */}
              </button>
            </div>
            <div className="mt-4">
              <form onSubmit={addEducationHandler}>
                {/* School */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold">School</label>
                  <input
                    type="text"
                    className="border w-full p-2 rounded-lg"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  />
                </div>

                {/* Degree */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold">Degree</label>
                  <input
                    type="text"
                    className="border w-full p-2 rounded-lg"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="border w-full p-2 rounded-lg"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border w-full p-2 rounded-lg"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    className="border w-full p-2 rounded-lg"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="bg-[#FFA904] text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Education Modal */}
      <Modal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        title="Edit Education"
      >
        <form onSubmit={editHandler}>
          {/* School */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">School</label>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>

          {/* Degree */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Degree</label>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Start Date</label>
            <input
              type="date"
              className="border w-full p-2 rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">End Date</label>
            <input
              type="date"
              className="border w-full p-2 rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              rows="4"
              className="border w-full p-2 rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-[#FFA904] text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Education_component;
