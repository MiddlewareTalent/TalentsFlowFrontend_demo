import React, { useState } from "react";
import axios from "axios";
import url from "../UniversalApi.jsx";

const EditTimesheetModal = ({ submission, onClose }) => {
  const [editedTimesheet, setEditedTimesheet] = useState({ ...submission });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      if (value === "" || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
        setEditedTimesheet((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (type === "date") {
      setEditedTimesheet((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setEditedTimesheet((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${url}/api/timesheets/update/${editedTimesheet.id}`,
        editedTimesheet,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving timesheet:", error);
    }
  };

  // Options for dropdowns (Same options from TimesheetManagement.jsx)
  const taskTypes = [
    "development",
    "design",
    "testing",
    "documentation",
    "research",
    "administration",
    "training",
    "support",
    "consulting",
    "maintenance",
    "meeting",
    "other",
  ];

  const workLocations = [
    "office",
    "home",
    "client",
    "co-working Space",
    "field",
    "hybrid",
    "on-Site",
    "temporary Location",
  ];

  const onCallOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="flex justify-between text-2xl font-semibold mb-6 bg-gray-100 p-2 rounded-t-sm">Edit Timesheet</h2>
        
        {/* Form container with flexbox for responsive layout */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          
          {/* Start Date */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={editedTimesheet.startDate}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={editedTimesheet.endDate}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Number of Hours */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Number of Hours</label>
            <input
              type="number"
              name="numberOfHours"
              value={editedTimesheet.numberOfHours}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Extra Hours */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Extra Hours</label>
            <input
              type="number"
              name="extraHours"
              value={editedTimesheet.extraHours}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Client Name */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={editedTimesheet.clientName}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Project Name */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={editedTimesheet.projectName}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Task Type */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Task Type</label>
            <select
              name="taskType"
              value={editedTimesheet.taskType}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            >
              {taskTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Work Location */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Work Location</label>
            <select
              name="workLocation"
              value={editedTimesheet.workLocation}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            >
              {workLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location.charAt(0).toUpperCase() + location.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* On-Call Support */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">On-Call Support</label>
            <select
              name="onCallSupport"
              value={editedTimesheet.onCallSupport}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            >
              {onCallOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Task Description */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-gray-700">Task Description</label>
            <textarea
              name="taskDescription"
              value={editedTimesheet.taskDescription}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTimesheetModal;
