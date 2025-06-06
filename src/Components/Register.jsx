import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../SharedCSS/SharedCss.css';
import axios from "axios";
import Loader from "../Assets/Loader"; // Ensure Loader is correctly imported
import url from '../UniversalApi';

const Register = () => {
    const [employee_name, setEmployeename] = useState("");
    const [last_name, setLastName] = useState("");
    const [employeeNameError, setEmployeeNameError] = useState("");
    const [lastNameError, setLastNameError] = useState(""); // Added specific error state for last name
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [company, setCompany] = useState("");
    const [companyError, setCompanyError] = useState("");
    
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [userInput, setUserInput] = useState("");
    const [userInputError, setUserInputError]=useState();


    const navigate = useNavigate();

    const generateCaptcha = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let captcha = "";
        for (let i = 0; i < 5; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    };

    useEffect(() => {
        document.title = 'Register: Create an Account';
        setCaptcha(generateCaptcha());
        return () => {
            document.title = 'Access HR';
        };
    }, []);

    const validateInput = () => {
        let isValid = true;
        const namePattern = /^[a-zA-Z\s]*$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@middlewaretalents\.com$/; // Restrict to middlewaretalents.com

        if (!employee_name) {
            setEmployeeNameError("* Please fill in the employee name.");
            isValid = false;
        } else if (!namePattern.test(employee_name)) {
            setEmployeeNameError("Name must not contain numbers or special characters.");
            isValid = false;
        } else {
            setEmployeeNameError("");
        }

        if (!last_name) {
            setLastNameError("* Please fill in the last name.");
            isValid = false;
        } else if (!namePattern.test(last_name)) {
            setLastNameError("Last name must not contain numbers or special characters.");
            isValid = false;
        } else {
            setLastNameError("");
        }

        if (!email) {
            setEmailError("* Please fill in the email.");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            setEmailError("* Email must end with @middlewaretalents.com.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!company) {
            setCompanyError("* Please fill in the company.");
            isValid = false;
        } else {
            setCompanyError("");
        }



        if (!password) {
            setPasswordError("* Please fill in the password.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!confirmPassword || password !== confirmPassword) {
            setConfirmPasswordError("Confirm password must match the password.");
            isValid = false;
        } else {
            setPasswordError("");
        }
        if (!userInput || userInput!==captcha){
            setUserInputError("Captcha does not match. Try again.");
            setCaptcha(generateCaptcha());
            isValid = false;
        }
        else {
            setPasswordError("");
        }

        return isValid;
    };

    async function save(event) {
        event.preventDefault();

        if (!validateInput()) {
            return;
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;
        if (!passwordPattern.test(password)) {
            setPasswordError("* Password must be at least 7 characters long, contain at least one special character, and have one number.");
            return;
        } else {
            setPasswordError("");
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("firstName", employee_name);
        formData.append("lastName", last_name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("task", true);
        formData.append("timeSheet", true);
        formData.append("organizationChart", true);
        formData.append("leaveManagement", true);


        try {
            console.log("Sending registration request to API"); // Debug message
            const response = await axios.post(`${url}/api/v1/employeeManager/register/${company}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                navigate(`/${company}/login`);
            }
        } catch (err) {
            if (err.response) {
                if (err.response.data.message === "Email already exists.") {
                    setEmailExistsError("* This email is already registered.");
                } else {
                    alert(err.response.data.message || "An error occurred during registration.");
                }
            } else {
                alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="container">
                <main className="signup-container">
                    <h1 className="heading-primary">Sign up<span className="span-blue">.</span></h1>
                    <p className="text-mute">Create an Account to get complete access.</p>
                    <form className="signup-form" onSubmit={save}>
                        <label className="inp">
                            <input type="text" className="input-text" placeholder="&nbsp;"
                                value={employee_name}
                                onChange={(e) => setEmployeename(e.target.value)} />
                            <span className="label">First Name</span>
                            <span className="input-icon"></span>
                        </label>
                        {employeeNameError && <p className="error-message">{employeeNameError}</p>}

                        <label className="inp">
                            <input type="text" className="input-text" placeholder="&nbsp;"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)} />
                            <span className="label">Last Name</span>
                            <span className="input-icon"></span>
                        </label>
                        {lastNameError && <p className="error-message">{lastNameError}</p>}

                        <label className="inp">
                            <input type="email" className="input-text" placeholder="&nbsp;"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                            <span className="label">Email</span>
                            <span className="input-icon"></span>
                        </label>
                        {emailError && <p className="error-message">{emailError}</p>}
                        {emailExistsError && <p className="error-message">{emailExistsError}</p>}

                        <label className="inp">
                            <input type="text" className="input-text" placeholder="&nbsp;"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)} />
                            <span className="label">Company</span>
                            <span className="input-icon"></span>
                        </label>
                        {companyError && <p className="error-message">{companyError}</p>}

                        {/* <label className="inp">
                            <input type="text" className="input-text" placeholder="&nbsp;"
                                   value={employeeId}
                                   onChange={(e) => setEmployeeId(e.target.value)} />
                            <span className="label">Employee Id</span>
                            <span className="input-icon"></span>
                        </label> */}
                        {/* {employeeIdError && <p className="error-message">{employeeIdError}</p>} */}

                        <label className="inp">
                            <input type="password" className="input-text" placeholder="&nbsp;"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <span className="label">Password</span>
                            <span className="input-icon input-icon-password"></span>
                        </label>
                        {passwordError && <p className="error-message">{passwordError}</p>}

                        <label className="inp">
                            <input type="password" className="input-text" placeholder="&nbsp;"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                            <span className="label">Confirm Password</span>
                            <span className="input-icon input-icon-password"></span>
                        </label>
                        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                        <div style={{ marginTop: 10 }}>
                            <strong>Captcha:</strong>
                            <div
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    display: "inline-block",
                                    padding: "8px 16px",
                                    marginLeft: 10,
                                    fontFamily: "monospace",
                                    fontSize: "20px",
                                    letterSpacing: "2px",
                                    border: "1px solid #ccc"
                                }}
                            >
                                {captcha}
                            </div>
                            <button type="button" onClick={() => setCaptcha(generateCaptcha())} style={{ marginLeft: 10 }}>
                                Refresh
                            </button>
                        </div>

                        <label className="inp">
                            <input type="text" className="input-text" placeholder="&nbsp;"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)} />
                            <span className="label">Enter Captcha</span>
                            <span className="input-icon"></span>
                        </label>
                        { userInputError&& <p className="error-message">{userInputError}</p>}

                        <button className="btn btn-login" type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Register →"}
                        </button>

                        {loading && <Loader />}

                        <label className="privacy_policy">
                            By clicking the Register button, you agree to our
                            <span> Terms & Conditions</span> and
                            <span> Privacy Policy</span>.
                        </label>
                    </form>

                    <p className="text-mute">Already a member? <Link to="/login">Login</Link></p>
                </main>
                <div className="welcome-container">
                    <h1 className="heading-secondary">Welcome to <span className="lg">MT Buddy!</span></h1>
                </div>
            </div>
        </>
    );
};

export default Register;
