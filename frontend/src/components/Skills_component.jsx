/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/userContext";
import Modal from "./Modal";

const Skills_component = ({ user }) => {
  const navigate = useNavigate();
  const { updateUser, addSkillData } = UserData();

  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [addSkill, setAddSkill] = useState(false);

  //const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("");

  const handleOpenEditSkill = (skill, index) => {
    setSelectedSkillIndex(index);
    setSkillName(skill.skillName);
    setSkillLevel(skill.skillLevel);
    setIsSkillsModalOpen(true);
  };

  const editHandler = async (e) => {
    e.preventDefault();

    const updatedSkill = {
      skillName,
      skillLevel,
    };

    const updatedSkills = [...user.skills];
    updatedSkills[selectedSkillIndex] = updatedSkill;

    const formData = new FormData();
    formData.append("skills", JSON.stringify(updatedSkills));
    await updateUser(formData, navigate);
    setIsSkillsModalOpen(false);
  };

  const addSkillHandler = async (e) => {
    e.preventDefault();

    if (!skillName || !skillLevel) {
      alert("Please fill out all required fields (Skill Name, Skill Level)");
      return;
    }

    await addSkillData( skillName, skillLevel , navigate);
    setAddSkill(false);

    setSkillName("");
    setSkillLevel("");
  };

  const handleDeleteSkill = async (index) => {
    const updatedSkills = user.skills.filter((_, i) => i !== index);

    const formData = new FormData();
    formData.append("skills", JSON.stringify(updatedSkills));

    await updateUser(formData, navigate);
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 space-x-2 sm:space-x-4">
          <button
            className="text-gray-800 hover:text-[#FFA904]"
            onClick={() => setAddSkill(true)}
          >
            <FaPlus />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="mt-4 space-y-4">
          {user.skills.length === 0
            ? "No skills added"
            : user.skills.map((skill, index) => (
                <div
                  key={index}
                  className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-md font-semibold">{skill.skillName}</h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {skill.skillLevel}
                    </p>
                  </div>
                  <div className="mt-2 sm:-mt-16 flex space-x-2 absolute sm:relative top-2 right-2 sm:top-4 sm:right-4">
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Edit Skill"
                      onClick={() => handleOpenEditSkill(skill, index)}
                    >
                      <FaEdit className="w-4 max-sm:w-3" />
                    </button>
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Delete Skill"
                      onClick={() => handleDeleteSkill(index)}
                    >
                      <FaTrash className="h-4 max-sm:h-3" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {addSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Skill</h2>
              <button
                className="text-2xl text-gray-600 hover:text-gray-800"
                onClick={() => setAddSkill(false)}
              >
                &times;
              </button>
            </div>
            <div className="mt-4">
              <form onSubmit={addSkillHandler}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    className="border w-full p-2 rounded-lg"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    Skill Level
                  </label>
                  <select
                    className="border w-full p-2 rounded-lg"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    <option>Select Your Level</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

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

      <Modal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        title="Edit Skill"
      >
        <form onSubmit={editHandler}>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Skill Name</label>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Skill Level</label>
            <select
              className="border w-full p-2 rounded-lg"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option>Select Your Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

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

export default Skills_component;
