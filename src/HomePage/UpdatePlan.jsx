import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url from '../UniversalApi';

export const UpdatePlan = () => {
    const [clientDetails, setClientDetails] = useState(null);
    const [price, setPrice] = useState(null);
    const [plan, setPlan] = useState(null);
    const [noOfEmployes, setNoOfEmployes] = useState(null);
    const [noOfMonthsUsed, setNoOfMonthsUsed] = useState(null);
    const [remainingMonths, setRemainingMonths] = useState(null);
    const [priceDifference, setPriceDifference] = useState(null);
    const [neededAmount, setNeededAmount] = useState(null);
    const navigate=useNavigate("");

    useEffect(() => {
        const fetchClientDetails = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${url}/api/clientDetails/getBySchema/${localStorage.getItem("company")}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-Tenant-ID": localStorage.getItem("company"),
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setClientDetails(response.data);
            } catch (error) {
                console.error("Error", error);
            }
        };
        fetchClientDetails();
    }, []);

    useEffect(() => {
        if (clientDetails !== null && plan !== null && price !== null) {
            const startDate = new Date(clientDetails.starDate);
            const endDate = new Date();

            let months =
                (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                (endDate.getMonth() - startDate.getMonth());

            if (endDate.getDate() < startDate.getDate()) {
                months--;
            }

            setNoOfMonthsUsed(months);

            const currentPricePerMonth = clientDetails.price / 12;
            const newPricePerMonth = price / 12;
            const remaining = 12 - months;

            const difference = newPricePerMonth - currentPricePerMonth;
            const amount = remaining * difference;

            setRemainingMonths(remaining);
            setPriceDifference(difference);
            setNeededAmount(amount);
            console.log(neededAmount)
        setClientDetails(prev => ({
            ...prev,
            price: amount.toFixed(2)*100,
            plan:plan,
            noOfEmployees:noOfEmployes
        }));
        }

        console.log("hello")
    }, [price]);

    const planDetails = (selectedPlan, selectedPrice, empLimit) => {
        setPlan(selectedPlan);
        setPrice(selectedPrice);
        setNoOfEmployes(empLimit);
        
    };

    const plans = [
        {
            name: "Starter",
            employees: 10,
            price: 250,
        },
        {
            name: "Premium",
            employees: 20,
            price: 300,
        },
        {
            name: "Premium Plus",
            employees: 50,
            price: 350,
        }
    ];

    const handelSubmit = async() => {
        
        console.log("client details",clientDetails);
        console.log(noOfEmployes)
        const response=await axios.post(`${url}/api/payment/create-checkout-session`,clientDetails);
        console.log(response);
        window.location.href=response.data.url;
        
        
    }

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen flex flex-col align-middle">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Upgrade Your Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((p, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left transition-all duration-300 border-2 ${plan === p.name ? "border-blue-600" : "border-transparent"
                            }`}
                    >
                        <h3 className="text-3xl font-bold mb-2 text-gray-800">{p.name} Plan</h3>
                        <p className="text-2xl font-bold mb-2">Plan: <span className="font-medium">{p.name}</span></p>
                        <p className="text-2xl font-bold mb-2">Employees: <span className="text-green-600 font-semibold">{p.employees}</span></p>
                        <p className="text-2xl font-bold mb-4">Price: <span className="text-green-700 font-semibold">£{p.price}/year</span></p>
                        <button
                            onClick={() => planDetails(p.name, p.price, p.employees)}
                            className="mt-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                            {plan === p.name ? "Selected" : "Select"}
                        </button>
                    </div>
                ))}
            </div>

            {clientDetails && plan && (
                <div className="mt-12 bg-white rounded-2xl shadow-md p-6 w-full max-w-screen-xl mx-auto flex flex-col align-middle justify-start">
                    <h4 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Current Plan Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-2xl text-gray-900">
                        <p><strong>Current Plan:</strong> {clientDetails.plan}</p>
                        <p><strong>Price:</strong> £{clientDetails.price}</p>
                        <p><strong>Months Used:</strong> {noOfMonthsUsed}</p>
                        <p><strong>Remaining Months:</strong> {remainingMonths}</p>
                        <p><strong>Selected Plan:</strong> {plan}</p>
                        <p><strong>Selected Price:</strong> £{price}</p>
                        <p><strong>Extra Amount to Pay:</strong> <span className="text-blue-700 font-semibold">£{neededAmount?.toFixed(2)}</span></p>
                    </div>
                    <button onClick={handelSubmit} className="w-32 self-center mt-4 px-5 align-middle py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">Pay</button>
                </div>
            )}







        </div>
    );
};
