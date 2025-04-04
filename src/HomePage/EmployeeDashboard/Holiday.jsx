import { useState, useEffect } from "react";
import axios from "axios";
import url from "../../UniversalApi";

const Holiday = () => {
    const [tab, setTab] = useState("View Holiday");
    const [newHoliday, setNewHoliday] = useState("");
    const [date, setDate] = useState("");
    const [AllHolidays, setAllHolidays] = useState([]);
    //const [upcomingHoliday, setUpcomingHoliday] = useState(null);

    // Fetch holidays from the API
    const fetchHolidays = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${url}/api/holiday/getAllHolidays`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Sort holidays by date (ascending order)
            const sortedHolidays = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setAllHolidays(sortedHolidays);
        } catch (error) {
            console.error("Error fetching holidays:", error);
        }
    };

    // This effect will run whenever the AllHolidays state changes
    useEffect(() => {
        const today = new Date();

        // Filter holidays to only show upcoming ones
        const upcomingHolidays = AllHolidays.filter((holiday) => {
            const holidayDate = new Date(holiday.date);
            return holidayDate >= today;
        });

        // Sort holidays by date (earliest first)
        const sortedUpcomingHolidays = upcomingHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Set the first upcoming holiday
        if (sortedUpcomingHolidays.length > 0) {
           // setUpcomingHoliday(sortedUpcomingHolidays[0]);
        } else {
          //  setUpcomingHoliday(null); // No upcoming holidays
        }
    }, [AllHolidays]); // This effect depends on AllHolidays

    // Post a new holiday
    const postHoliday = async () => {
        const token = localStorage.getItem('token');

        // Validate inputs
        if (!newHoliday || !date) {
            alert("Please fill in all fields");
            return;
        }

        // Ensure the date is in the correct format (YYYY-MM-DD)
        const formattedDate = new Date(date).toISOString().split('T')[0]; // "YYYY-MM-DD"

        try {
            const response = await axios.post(
                `${url}/api/holiday/holiday`,
                {
                    name: newHoliday,
                    date: formattedDate,  // Send the formatted date
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Directly update the local state with the newly added holiday
            setAllHolidays(prevHolidays => {
                const updatedHolidays = [response.data, ...prevHolidays];
                return updatedHolidays.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort after adding
            });

            // Reset form fields
            setNewHoliday("");
            setDate("");

            // Change the tab back to 'View Holiday' after posting
            setTab("View Holiday");
            fetchHolidays()

        } catch (error) {
            console.log("Error posting holiday:", error);
            alert("Failed to post holiday");
        }
    };

    // Delete holiday by ID
    const deleteHoliday = async (id) => {
        const token = localStorage.getItem('token');

        try {
            // Send DELETE request to backend to delete the holiday
            await axios.delete(`${url}/api/holiday/deleteHolidayById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            // Remove the deleted holiday from the state and re-sort
            setAllHolidays(prevHolidays => prevHolidays.filter(holiday => holiday.id !== id).sort((a, b) => new Date(a.date) - new Date(b.date)));

            alert("Holiday deleted successfully");

        } catch (error) {
            console.error("Error deleting holiday:", error);
            alert("Failed to delete holiday");
        }
    };

    // Fetch holidays when the component mounts
    useEffect(() => {
        fetchHolidays();
    }, []);

    return (
        <div className="relative lg:row-span-2 p-6" style={{ height: '380px' }}>
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] border border-gray-200"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <h3 className="text-2xl font-semibold text-gray-900 ml-5">Upcoming Holiday</h3>
                <p className="mt-2 text-lg text-gray-700">Stay updated on your upcoming holidays.</p>
                <div className="">
                    {localStorage.getItem("role") !== "employee" && (
                        <div className="col-start-1 col-end-3 mt-5">
                            {tab === "Post Holiday" && (
                                <button
                                    className="mr-5 border border-solid border-black rounded-md w-56 "
                                    onClick={() => { setTab("View Holiday"); }}
                                >
                                    View Holidays
                                </button>
                            )}
                            {tab === "View Holiday" && (
                                <button
                                    className="mr-5 border border-solid border-black rounded-md w-40"
                                    onClick={() => { setTab("Post Holiday"); }}
                                >
                                    Post Holiday
                                </button>
                            )}
                            
                        </div>
                    )}
                </div>

                <hr className="border-gray-300 my-4" />
                    
                {tab === "Post Holiday" && (
                    <div className="p-4">
                        <input
                            value={newHoliday}
                            onChange={(e) => setNewHoliday(e.target.value)}
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Holiday name"
                        />
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type='date'
                        />
                         <button onClick={postHoliday} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4">
                        Post
                    </button>
                         
                    </div>
                )}
                <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 250px)' }}> 
                {localStorage.getItem("role") !== "employee" && (
                    <div>
                {tab === "View Holiday" && (
                    <div className="">
                        {AllHolidays.map((holiday, index) => (
                            <li key={index} className="flex justify-between text-lg text-black-700">
                                {holiday.name} - {new Date(holiday.date).toLocaleDateString()}
                                {localStorage.getItem("role") !== "employee" && (
                                    <button className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2 "
                                    onClick={() => deleteHoliday(holiday.id)}>
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </div>
                )}
                </div>
            )}
            </div>
            {localStorage.getItem("role") === "employee" && (
                    <div>
                {tab === "View Holiday" && (
                    <div className="flex-1 overflow-y-auto " style={{ height: 'calc(100vh - 250px)' }}>
                        {AllHolidays.map((holiday, index) => (
                            <li key={index} className="flex justify-between text-lg text-black-700 mt-7">
                                {holiday.name} - {new Date(holiday.date).toLocaleDateString()}
                               
                            </li>
                        ))}
                    </div>
                )}
                </div>
            )}
            </div>
        </div>
    );
};

export default Holiday;
