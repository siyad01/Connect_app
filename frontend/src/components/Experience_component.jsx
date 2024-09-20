/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/userContext";
import Modal from "./Modal";

const Experience_component = ({ user }) => {
  const navigate = useNavigate();
  const { updateUser, addData } = UserData(); // Assuming you have a deleteData function

  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [addExperience, setAddExperience] = useState(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // Open modal with selected experience data
  const handleOpenEditExperience = (experience, index) => {
    setSelectedExperienceIndex(index);
    setTitle(experience.title);
    setCompany(experience.company);
    setStartDate(experience.startDate.split('T')[0]); // Extract date part only
    setEndDate(experience.endDate ? experience.endDate.split('T')[0] : ""); // Extract date part only
    setDescription(experience.description);
    setIsExperienceModalOpen(true);
  };

  const editHandler = async (e) => {
    e.preventDefault();

    const updatedExperience = {
      title,
      company,
      startDate,
      endDate,
      description,
    };

    const updatedExperiences = [...user.experience];
    updatedExperiences[selectedExperienceIndex] = updatedExperience;

    const formData = new FormData();
    formData.append("experience", JSON.stringify(updatedExperiences));

    await updateUser(formData, navigate);
    setIsExperienceModalOpen(false);
  };

  const addExperienceHandler = async (e) => {
    e.preventDefault();

    if (!title || !company || !startDate) {
      alert("Please fill out all required fields (Title, Company, Start Date)");
      return;
    }

    const formData = new FormData();
    formData.append("experience", JSON.stringify({
      title,
      company,
      startDate,
      endDate,
      description,
    }));
  

    await addData(formData, navigate);
    setAddExperience(false);
    // Clear the input fields
    setTitle("");
    setCompany("");
    setStartDate("");
    setEndDate("");
    setDescription("");
  };

  const handleDeleteExperience = async (index) => {
    const updatedExperiences = user.experience.filter((_, i) => i !== index);

    const formData = new FormData();
    formData.append("experience", JSON.stringify(updatedExperiences));

    await updateUser(formData, navigate);
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 space-x-2 sm:space-x-4">
          <button
            className="text-gray-800 hover:text-[#FFA904]"
            onClick={() => setAddExperience(true)}
          >
            <FaPlus />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Experience</h2>
        <div className="mt-4 space-y-4">
          {user.experience.length === 0
            ? "No experience added"
            : user.experience.map((exp, index) => (
                <div
                  key={index}
                  className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-md font-semibold">
                      {exp.title} {" | "} {exp.company}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {new Date(exp.startDate).toLocaleDateString()} -{" "}
                      {exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString()
                        : "Present"}{" "}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {exp.description}
                    </p>
                  </div>
                  <div className="mt-2 sm:-mt-16 flex space-x-2 absolute sm:relative top-2 right-2 sm:top-4 sm:right-4">
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Edit Experience"
                      onClick={() => handleOpenEditExperience(exp, index)}
                    >
                      <FaEdit className=" w-4 max-sm:w-3"/>
                    </button>
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Delete Experience"
                      onClick={() => handleDeleteExperience(index)}
                    >
                      <FaTrash className=" h-4 max-sm:h-3"/>
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Add Experience Modal */}
      {addExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Experience</h2>
              <button
                className="text-2xl text-gray-600 hover:text-gray-800"
                onClick={() => setAddExperience(false)}
              >
                &times; {/* Close button */}
              </button>
            </div>
            <div className="mt-4">
              <form onSubmit={addExperienceHandler}>
                {/* Position */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    Position
                  </label>
                  <input
                    type="text"
                    className="border w-full p-2 rounded-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Company */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold">Company</label>
                  <input
                    type="text"
                    className="border w-full p-2 rounded-lg"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
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

      {/* Edit Experience Modal */}
      <Modal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        title="Edit Experience"
      >
        <form onSubmit={editHandler}>
          {/* Position */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Position</label>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Company */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Company</label>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
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

export default Experience_component;
