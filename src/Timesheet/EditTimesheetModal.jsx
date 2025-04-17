import React, { useState } from "react";
import axios from "axios";
import url from "../UniversalApi.jsx";
import { IoCloseCircleOutline } from "react-icons/io5";   

const EditTimesheetModal = ({ submission, onClose }) => {
  const [editedTimesheet, setEditedTimesheet] = useState({ ...submission });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    // Reset errors  

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  
    if (name === "onCallSupport") {
      let boolVal = value === "true" ? true : value === "false" ? false : "selectOption";
      setEditedTimesheet((prev) => ({
        ...prev,
        [name]: boolVal,
      }));
    } else if (type === "number") {
      if (value === "" || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
        setEditedTimesheet((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setEditedTimesheet((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleSave = async () => {
    // Basic validation
    let validationErrors = {};

    if (!editedTimesheet.startDate) {
      validationErrors.startDate = "Start Date is required";
    }
    if (!editedTimesheet.endDate) {
      validationErrors.endDate = "End Date is required";
    }
    if (!editedTimesheet.numberOfHours) {
      validationErrors.numberOfHours = "Number of Hours is required";
    }
    if (!editedTimesheet.clientName) {
      validationErrors.clientName = "Client Name is required";
    }
    if (!editedTimesheet.projectName) {
      validationErrors.projectName = "Project Name is required";
    }
    if (
      editedTimesheet.taskType === "selectOption" ||
      !editedTimesheet.taskType
    ) {
      validationErrors.taskType = "Task Type is required";
    }
    if (
      editedTimesheet.workLocation === "selectOption" ||
      !editedTimesheet.workLocation
    ) {
      validationErrors.workLocation = "Work Location is required";
    }
    if (
      editedTimesheet.onCallSupport === "selectOption" ||
      editedTimesheet.onCallSupport === undefined ||
      editedTimesheet.onCallSupport === null
    ) {
      validationErrors.onCallSupport = "On-Call Support is required";
    }
    

    setErrors(validationErrors);
    // If no errors, proceed with the save
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
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

        const token =localStorage.getItem("token");
        await axios.post(`${url}/apis/employees/notifications`,{
          "notificationType":"TimesheetManage",
          "notification":editedTimesheet.employeeName+" has submitted updated timesheet, tap to see details",
          "notificationTo":editedTimesheet.managerId,
          "isRead":false
        }
        , {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        onClose(); // Close the modal after saving
      } catch (error) {
        console.error("Error saving timesheet:", error);
      } finally{
        setLoading(false);
      }
      
    }
  };

  const taskTypes = [
    "Select Option",
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
    "Select Option",
    "office",
    "home",
    "client",
    "field",
    "hybrid",
    "on-Site",
    "temporary Location",
  ];

  const onCallOptions = [
    { value: "selectOption", label: "Select Option" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between text-2xl font-semibold mb-6 bg-gray-100 p-2 rounded-t-sm">
          Edit Timesheet
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoCloseCircleOutline className="h-8 w-8" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              Start Date <span className="text-red-500 text-2xl">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={editedTimesheet.startDate}
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md "
            />
            {errors.startDate && (
              <div className="text-red-500 text-lg mt-1">
                {errors.startDate}
              </div>
            )}
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              End Date <span className="text-red-500 text-2xl">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={editedTimesheet.endDate}
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
            />
            {errors.endDate && (
              <div className="text-red-500 text-lg mt-1">{errors.endDate}</div>
            )}
          </div>

          {/* Number of Hours */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              Number of Hours <span className="text-red-500 text-2xl">*</span>
            </label>
            <input
              type="number"
              name="numberOfHours"
              value={editedTimesheet.numberOfHours}
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
            />
            {errors.numberOfHours && (
              <div className="text-red-500 text-lg mt-1">
                {errors.numberOfHours}
              </div>
            )}
          </div>

          {/* Extra Hours */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              Extra Hours
            </label>
            <input
              type="number"
              name="extraHours"
              value={editedTimesheet.extraHours}
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Client Name */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              Client Name <span className="text-red-500 text-2xl">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={editedTimesheet.clientName}
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
            />
            {errors.clientName && (
              <div className="text-red-500 text-lg mt-1">
                {errors.clientName}
              </div>
            )}
          </div>

          {/* Project Name */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              Project Name <span className="text-red-500 text-2xl">*</span>
            </label>
            <input
              type="text"
              name="projectName"
              value={editedTimesheet.projectName}
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
            />
            {errors.projectName && (
              <div className="text-red-500 text-lg mt-1">
                {errors.projectName}
              </div>
            )}
          </div>

          {/* Task Type */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              Task Type <span className="text-red-500 text-2xl">*</span>
            </label>
            <select
              name="taskType"
              value={editedTimesheet.taskType }
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
            >
              {taskTypes.map((type, index) => (
                <option
                  key={index}
                  value={type === "Select Option" ? "" : type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  {type}
                </option>
              ))}
            </select>
            {errors.taskType && (
              <div className="text-red-500 text-lg mt-1">{errors.taskType}</div>
            )}
          </div>

          {/* Work Location */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              Work Mode <span className="text-red-500 text-2xl">*</span>
            </label>
            <select name="workLocation" value={editedTimesheet.workLocation} onChange={handleChange} className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md" >
              {workLocations.map((location, index) => (
                <option key={index} value={location}  
                label={location.charAt(0).toUpperCase() + location.slice(1)}
                 >
                  {location} </option> ))}
            </select>
            {errors.workLocation && (
              <div className="text-red-500 text-lg mt-1"> {errors.workLocation} </div> )}
          </div>

          {/* On-Call Support */}
          <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-1 text-xl py-2 text-black-700">
              On-Call Support <span className="text-red-500 text-2xl">*</span>
            </label>
            <select
  name="onCallSupport"
  value={
    editedTimesheet.onCallSupport === true
      ? "true"
      : editedTimesheet.onCallSupport === false
      ? "false"
      : "selectOption"
  }
  onChange={handleChange}
  className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
>
  {onCallOptions.map((option, index) => (
    <option key={index} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
            {errors.onCallSupport && (
              <div className="text-red-500 text-lg mt-1">
                {errors.onCallSupport}
              </div>
            )}
          </div>

           {/* Task Description */}
           <div className="mb-4">
            <label className="flex flex-row min-w-40 gap-5 text-xl py-2 text-black-700">
              Task Description
            </label>
            <textarea
              name="taskDescription"
              value={editedTimesheet.taskDescription}
              onChange={handleChange}
              className="mt-1 p-2 text-xl block w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Updating..." : "Update Timesheet"}
        </button>
      </div>
    </div>
  );
};

export default EditTimesheetModal;
