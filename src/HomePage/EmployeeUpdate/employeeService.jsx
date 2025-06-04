import axios from "axios";
import url from "../../UniversalApi";
 
const BASE_URL = `${url}/api/v1/employeeManager`;
 
export const getEmployeeDetails = async (id) => {
  console.log("Id", id);
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/employees/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Tenant-ID": localStorage.getItem("company"),
      },
    });
 
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Error fetching employee data: ${response.statusText}`);
    }
 
    // Parse the response body as JSON
    const data = await response.json();
    console.log(data);
 
    // Return the parsed data
    return data;
  } catch (error) {
    throw error;
  }
};
 
export const updateEmployeeDetails = async (id, employeeData) => {
  console.log("emp", employeeData);
  try {
    const token = localStorage.getItem("token");
 
    const response = await axios.put(
      `${BASE_URL}/update/${employeeData.id}`,
      employeeData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": localStorage.getItem("company"),
        },
      }
    );
 
    console.log(response);
    window.location.href = '/';
  } catch (error) {
    console.error("Error in PUT request:", error);
    throw error; // Rethrow error after logging it
  }
};