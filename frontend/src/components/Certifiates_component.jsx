import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/userContext";
import Modal from "./Modal";

const Certification_component = ({ user }) => {
  const navigate = useNavigate();
  const { updateUser, addCertificationData } = UserData();

  const [isCertificationsModalOpen, setIsCertificationsModalOpen] = useState(false);
  const [addCertification, setAddCertification] = useState(false);
  const [selectedCertIndex, setSelectedCertIndex] = useState(null);
  const [certName, setCertName] = useState("");
  const [issuedDate, setIssuedDate] = useState("");

  const handleOpenEditCertification = (cert, index) => {
    setSelectedCertIndex(index);
    setCertName(cert.certName);
    setIssuedDate(cert.issuedDate);
    setIsCertificationsModalOpen(true);
  };

  const editHandler = async (e) => {
    e.preventDefault();

    const updatedCert = {
      certName,
      issuedDate,
    };

    const updatedCertifications = [...user.certifications];
    updatedCertifications[selectedCertIndex] = updatedCert;

    const formData = new FormData();
    formData.append("certifications", JSON.stringify(updatedCertifications));
    await updateUser(formData, navigate);
    setIsCertificationsModalOpen(false);
  };

  const addCertificationHandler = async (e) => {
    e.preventDefault();

    if (!certName || !issuedDate) {
      alert("Please fill out all required fields (Certification Name, Date Issued)");
      return;
    }

    await addCertificationData(certName, issuedDate, navigate);
    setAddCertification(false);
    setCertName("");
    setIssuedDate("");
  };

  const handleDeleteCertification = async (index) => {
    const updatedCertifications = user.certifications.filter((_, i) => i !== index);

    const formData = new FormData();
    formData.append("certifications", JSON.stringify(updatedCertifications));

    await updateUser(formData, navigate);
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 space-x-2 sm:space-x-4">
          <button
            className="text-gray-800 hover:text-[#FFA904]"
            onClick={() => setAddCertification(true)}
          >
            <FaPlus />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Licenses & Certifications</h2>
        <div className="mt-4 space-y-4">
          {user.certifications.length === 0
            ? "No certifications added"
            : user.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-md font-semibold">{cert.certName}</h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Issued on {cert.issuedDate.split("T")[0]}
                    </p>
                  </div>
                  <div className="mt-2 sm:-mt-16 flex space-x-2 absolute sm:relative top-2 right-2 sm:top-4 sm:right-4">
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Edit Certification"
                      onClick={() => handleOpenEditCertification(cert, index)}
                    >
                      <FaEdit className="w-4 max-sm:w-3" />
                    </button>
                    <button
                      className="text-gray-800 hover:text-[#FFA904]"
                      title="Delete Certification"
                      onClick={() => handleDeleteCertification(index)}
                    >
                      <FaTrash className="h-4 max-sm:h-3" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {addCertification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Certification</h2>
              <button
                className="text-2xl text-gray-600 hover:text-gray-800"
                onClick={() => setAddCertification(false)}
              >
                &times;
              </button>
            </div>
            <div className="mt-4">
              <form onSubmit={addCertificationHandler}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    className="border w-full p-2 rounded-lg"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold">Date Issued</label>
                  <input
                    type="date"
                    className="border w-full p-2 rounded-lg"
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                  />
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
        isOpen={isCertificationsModalOpen}
        onClose={() => setIsCertificationsModalOpen(false)}
        title="Edit Certification"
      >
        <form onSubmit={editHandler}>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Certification Name</label>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Date Issued</label>
            <input
              type="date"
              className="border w-full p-2 rounded-lg"
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
            />
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

export default Certification_component;
