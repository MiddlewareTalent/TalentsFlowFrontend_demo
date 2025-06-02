import React, { useCallback, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "../utils/getCroppedImg";
//import Cropper from "react-cropper";
//import "cropperjs";
//import ImageCropModal from "../utils/ImageCropModal"; // adjust path as needed
//import getCroppedImg from "../utils/getCroppedImg"; // already used inside modal
import profileLogo from "../Assets/profileLogo.jpg"
 
import {
    UserCircleIcon,
    EnvelopeIcon,
    UserGroupIcon,
    BriefcaseIcon,
    MapPinIcon,
    PaperClipIcon,
    ClockIcon,
    // BuildingOfficeIcon,
    IdentificationIcon,
    CalendarDaysIcon,
    CalendarIcon,
    CreditCardIcon,
    GlobeAmericasIcon,
    PencilIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import Loader from "../Assets/Loader";
import Contacts from "../HomePage/MyContacts/Contacts";
import UpdateEmployeeModal from "../HomePage/EmployeeUpdate/UpdateEmployeeModal";
import url from "../UniversalApi";
 
const Badge = ({ children, variant, className }) => (
    <span className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-medium ${variant === 'outline' ? 'border' : 'bg-gray-100'} ${className}`}>
        {children}
    </span>
);
 
const Button = ({ children, variant, size, ...props }) => (
    <button
        className={`rounded-md font-medium ${variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white'} ${size === 'sm' ? 'px-2 py-1 text-base' : 'px-4 py-2 text-lg'}`}
        {...props}
    >
        {children}
    </button>
);
 
const ScrollArea = ({ children, className }) => <div className={`overflow-auto ${className}`}>{children}</div>;
const Separator = () => <hr className="my-4" />;
 
export default function ProfileCard() {
   
    const [employee, setEmployee] = useState(null);
    const [contacts, setContacts]=useState([]);
    const [isLoading, setIsLoading]=useState(true);
    const employeeId=localStorage.getItem("employeeId");
    const token= localStorage.getItem('token');
      const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
        const [updateEmployeeId, setUpdateEmployeeId] = useState(null);
          // const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedFile, setSelectedFile] = useState(null);
    // cropped states
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    //const [cropper, setCropper] = useState(null);
//     const [cropModalOpen, setCropModalOpen] = useState(false);
// const [previewImage, setPreviewImage] = useState(null);
// const [croppedImageFile, setCroppedImageFile] = useState(null);
 
 
    const [newImgSelected, setNewImgSelected] = useState(false);
   
 
        const fetchEmployee = useCallback(async () => {
            setIsUpdateModalOpen(false)
            setIsLoading(true);
 
            try {
               
                console.log(token);
                console.log("upto");
                const response = await axios.get(`${url}/api/v1/employeeManager/getEmployee/${employeeId}`,{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`,
                        'Content-Type':'application/json',
                        "X-Tenant-ID": localStorage.getItem('company'),
                    }
                });
                console.log("object: ",response.data);
                console.log(response.status);
                setEmployee(response.data);
                setIsLoading(false);
               
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
            try {
                const response = await axios.get(`${url}/apis/employees/contacts/contactsBy/${employeeId}`,{
                  headers: {
                    "Authorization": `Bearer ${token}`,
                        "X-Tenant-ID": localStorage.getItem('company'),   // Add the token to the Authorization header
                  }
                });
               
                setContacts(response.data);
               
              } catch (error) {
               
                console.error('Error fetching data:', error);
              } finally {
               
                setIsUpdateModalOpen(false)
            }
           
        }, [employeeId, token]);
       
        // fetchEmployee();
   
 
 
    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);
 
    const handleIconClick = () => {
        setIsModalOpen(true);
    }
 
    // const handleFileChange = async (e) => {
    //     const file = e.target.files[0];
    //     console.log("file: ", file);
    //     if (file) {
    //         //setSelectedFile(file);
    //          const reader = new FileReader();
    //          reader.readAsDataURL(file);
    //         // console.log("reader : ", reader);
    //          reader.onload = () => {
    //              setImageSrc(reader.result);
    //              setIsModalOpen(true);
    //              setNewImgSelected(true);
    //          }
           
           
    //     }
    // };
 
   
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
 
  setImageSrc(null); // ❗ Reset previous image first
 
  const reader = new FileReader();
  reader.onloadend = () => {
    setImageSrc(reader.result);     // ✅ fresh base64 image
    setIsModalOpen(true);
    setNewImgSelected(true);
  };
  reader.readAsDataURL(file);
};
 
 
// const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
 
//     const reader = new FileReader();
   
//     reader.onloadend = () => {
//       setPreviewImage(reader.result);
//       setCropModalOpen(true);
//     };
//     reader.readAsDataURL(file);
//   };
 
//   const handleCropDone = (croppedFile) => {
//     setCroppedImageFile(croppedFile);
//    // setImageSrc(URL.createObjectURL(croppedFile));
//     setNewImgSelected(true);
//   };
 
    const handleSubmit = async () => {
       
        //if (!selectedFile) return;
       if(!imageSrc || !croppedAreaPixels) return;
        try {
         const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
//             console.log("Cropped image:", croppedBlob); // should be a Blob
// console.log("Type check:", croppedBlob instanceof Blob); // should be true
//             console.log("image: ", imageSrc);
           
 
 
            const formData = new FormData();
            formData.append('employeeId', employeeId);
            formData.append('profilePhoto', croppedBlob);
            console.log("id: ", employeeId);
 
            const res = await axios.put(
                `${url}/api/v1/employeeManager/ProfilePhotoUpdate`,
                formData,
                {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${token}`,
                        "X-Tenant-ID": localStorage.getItem('company'),
                    },
                }
            );
 
           
            fetchEmployee();
           
            setIsModalOpen(false);
            setNewImgSelected(false);
            setImageSrc(null);
            setCrop({ x: 0, y: 0 });       // ❗ Reset crop
            setZoom(1);
            setCroppedAreaPixels(null);
            window.location.reload();
           
            console.log('Profile photo updated!');
            console.log("output : ", res)
        } catch (error) {
            console.error('Upload failed:', error);
           
        }
    }  
 
    const updateEmployeeDetails = (id) => {
        setUpdateEmployeeId(id);
        setIsUpdateModalOpen(true)
    }
 
    const handleDelete = async () => {
        try{
            const delResponse = await axios.delete(`${url}/api/v1/employeeManager/ProfilePhotoDelete`,{
               params: {
                employeeId : employee.employeeId
               },
               
                    headers: {
                        // 'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${token}`,
                        "X-Tenant-ID": localStorage.getItem('company'),
                    },
               
            })
            console.log("del: ", delResponse);
            if (delResponse.status === 200) {
      alert("Profile photo deleted successfully!");
      setNewImgSelected(false);
      //    setImageSrc(null);
      setIsModalOpen(false);
       window.location.reload();
      // Refresh employee data (optional but recommended)
      fetchEmployee();
    } else {
      alert("Failed to delete profile photo");
    }
        }
        catch (error) {
    console.error("Error deleting profile photo:", error);
    alert("An error occurred while deleting the profile photo.");
  }
    }
 
    if (!employee) {
        return <div className="flex justify-center items-center h-screen"><Loader /></div>;
    }
 
    // Attachments mapping
    const attachments = [
        // { label: "National Card", file: employee.nationalCard },
        { label: "10th Certificate", file: employee.tenthCertificate },
        { label: "12th Certificate", file: employee.twelfthCertificate },
        { label: "Graduation Certificate", file: employee.graduationCertificate },
    ];
 
    var givenDate;
    var currentDate=new Date();
    var years;
    var months;
    var days;
    var employeeMentDuration;
 
 
    if(!isLoading){
        givenDate=new Date(employee.dateOfJoining);
        console.log(givenDate);
        console.log(currentDate);
        var difference = currentDate.getTime() - givenDate.getTime();
   
    years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
    months = Math.floor((difference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    employeeMentDuration=years+" " +(years > 1 ? "Years ": "Year ")+months+" "+(months>1? "Months ":"Month ")+days+" "+(days>1? "Days.":"Day.")
 
    }
 
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm w-full">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-4xl font-semibold text-gray-900">My Information</h1>
                    {/* <button
                          onClick={() => updateEmployeeDetails(employee.employeeId)}
                                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                  aria-label="Edit employee">
                                               
                                                      <PencilIcon className="h-5 w-5" />  
                       
                                                    </button> */}
                   
                </div>
            </header>
            <ScrollArea className="flex-grow">
                <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-8 space-y-8">
                        <div className="flex flex-row justify-end">
                                {/* <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100" onClick={handleIconClick}>
                                         <PencilIcon className="w-5 h-5 ml-80" />
                                 </button> */}
 
                                <button
                                    onClick={() => updateEmployeeDetails(employee.employeeId)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                    aria-label="Edit employee">
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                               <div className="flex h-80 w-80 items-center justify-center rounded-full relative">
                           <img
                                onClick={handleIconClick}
                                className="h-full w-full object-cover rounded-full cursor-pointer"
                                src={`${employee.profilePhoto}?t=${new Date().getTime()}`}
                                alt="Employee profile"
                                onError={(e) => { e.currentTarget.src = profileLogo; }}
                                />
 
 
                            </div>
 
 
 
                                {/* Modal */}
                                {isModalOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
 
                                            <button className=" p-2" onClick={() => setIsModalOpen(false)} >
                                                <FaTimes className="w-5 h-5 ml-80" />
                                            </button>
                                           
 
                                            {!newImgSelected ? (
                                                <div className="flex flex-col items-center">
                                               
                                                    <img src={`${employee.profilePhoto}?t=${new Date().getTime()}`}
                                                        alt="Current"
                                                        className="w-48 h-48 rounded-full object-cover mb-4"
                                                        onError={(e) => { e.currentTarget.src = profileLogo; }}
                                                    />
                                                   
                                                    <div className=" flex flex-row mt-10">
                                                        <label htmlFor="profile-photo">
                                                            <PencilIcon className="h-8 w-8 cursor-pointer mr-10" />
                                                        </label>
                                                        <MdDelete className="text-red-500 h-10 w-10" onClick={handleDelete} />
                                                    </div>
                                                    <input
                                                        id="profile-photo"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                   
                                                   <div className="relative w-full h-96">
                                                        <Cropper
                                                            image={imageSrc}
                                                            crop={crop}
                                                            zoom={zoom}
                                                            aspect={1}
                                                            onCropChange={setCrop}
                                                            onZoomChange={setZoom}
                                                            onCropComplete={(croppedArea, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                                                        />
                                                    </div>
 
 
                                                    <div className="flex justify-between mt-4">
                                                        <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                                                            <FaCheckCircle />
                                                        </button>
                                                        <button onClick={() => {
                                                            setNewImgSelected(false);
                                                            setImageSrc(null);
                                                        }} className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
 
                                           
                                            <div className="mb-4 mt-8 flex flex-row justify-evenly">
 
                                                {/* <input
                                                    id="profile-photo"
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="mb-4 hidden"
                                                />
                                                <label htmlFor="profile-photo"><PencilIcon className="h-8 w-8 cursor-pointer" /> </label> */}
 
 
                                                {/* <MdDelete className="text-red-500 h-10 w-10" /> */}
                                                {/* <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                                    onClick={handleSubmit}
                                                >
                                                    <FaCheckCircle />
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                               <div className="flex h-80 w-80 items-center justify-center rounded-full">
                                <img
                                    className="h-full w-full object-cover rounded-full"
                                    src={employee.profilePhoto}
                                    alt={employee.name ? `Profile photo of ${employee.name}` : 'Profile photo not available'}
                                />
                                </div> */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-96 gap-y-10 ">
                                <InfoItem icon={<UserCircleIcon />} label="Full name" value={`${employee.firstName || 'N/A'} ${employee.lastName || ''}`} />
                                {/* <InfoItem icon={<BuildingOfficeIcon />} label="Company Name" value={employee.companyName || "N/A"} highlight={true} /> */}
                                <InfoItem icon={<IdentificationIcon />} label="Employee ID" value={employee.employeeId || "N/A"} />
                                <InfoItem icon={<EnvelopeIcon />} label="Corporate Email" value={employee.corporateEmail || "N/A"} />
                                <InfoItem icon={<UserGroupIcon />} label="Reporting to" value={employee.reportingTo || "N/A"} />
                                {/* <InfoItem icon={<UserGroupIcon />} label="Reporting to" value={employee.employeeId || "N/A"} /> */}
                                <InfoItem icon={<CalendarDaysIcon/> } label="Date of Birth" value={employee.dateOfBirth || "N/A"} />
                                <InfoItem icon={<CalendarIcon/> } label="Date of joining" value={employee.dateOfJoining || "N/A"} />
                                <InfoItem icon={<GlobeAmericasIcon />} label="Working Country" value={employee.workingCountry || "N/A"} />
                                <InfoItem icon={<BriefcaseIcon />} label="Job role" value={employee.jobRole || "N/A"} />
                                <InfoItem
                                    icon={<ClockIcon />}
                                    label="Employee Status"
                                   
                                    value={
                                        <Badge variant="secondary" className="text-lg px-3 py-1">
                                            {employee.employmentStatus || "N/A"}
                                        </Badge>
                                    }
                                   
                                />
                                <InfoItem icon={<CreditCardIcon />} label="National Id Number" value={employee.nationalInsuranceNumber || "N/A"} />
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <InfoItem1 icon={<MapPinIcon />} label="Address" value={`${employee.streetAddress || ''}, ${employee.city || ''}, ${employee.region || ''} - ${employee.postalCode || ''}`} fullWidth />
                            </div>
                            <Separator />
                            <div>
                            <InfoItem icon={<ClockIcon/>} label="Duration Of Employeement" value={employeeMentDuration || "N/A"} />      
                            </div>
                            <Separator />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Attachments</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {attachments.map((attachment, idx) => (
                                        attachment.file ? (
                                            <AttachmentItem
                                                key={idx}
                                                filename={attachment.label}
                                                filesize={getFileSize(attachment.file)}
                                                fileUrl={attachment.file}
                                                icon={<PaperClipIcon className="h-6 w-6 text-gray-400" />}
                                            />
                                        ) : null
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Contact</h2>
                                {contacts.length===0 ? <Link to="/NewContacts">
                                        <button type="button" className="ml-5 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-700">Add Emergency Contact</button> </Link>: <Contacts employeeId={employeeId}/>}
                               
                            </div>
                        </div>
                    </div>
                </main>
            </ScrollArea>
                        {updateEmployeeId && (
                            <UpdateEmployeeModal
                                isOpen={isUpdateModalOpen}
                                onClose={() =>  fetchEmployee ()}
                                employeeId={updateEmployeeId}
                            />
                        )}
        </div>
    );
}
 
function InfoItem({ icon, label, value, fullWidth = false, highlight = false}) {
    return (
        <div className={`flex items-start w-80 space-x-4  ${fullWidth ? 'col-span-full' : ''} ${highlight ? 'bg-blue-50 p-4 rounded-md' : ''}`}>
            <div className="flex-shrink-0 mt-1">
                {React.cloneElement(icon, { className: `h-10 w-10 ${highlight ? 'text-blue-500' : 'text-gray-400'}` })}
            </div>
            <div className="flex-grow">
                <p className={`text-xl font-medium ${highlight ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
                <div className={`mt-1 text-xl ${highlight ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{value}</div>
            </div>
        </div>
    );
}
 
function InfoItem1({ icon, label, value, fullWidth = false, highlight = false}) {
    return (
        <div className={`flex items-start space-x-4  ${fullWidth ? 'col-span-full' : ''} ${highlight ? 'bg-blue-50 p-4 rounded-md' : ''}`}>
            <div className="flex-shrink-0 mt-1">
                {React.cloneElement(icon, { className: `h-10 w-10 ${highlight ? 'text-blue-500' : 'text-gray-400'}` })}
            </div>
            <div className="flex-grow">
                <p className={`text-xl font-medium ${highlight ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
                <div className={`mt-1 text-xl ${highlight ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{value}</div>
            </div>
        </div>
    );
}
 
function AttachmentItem({ filename, filesize, icon, fileUrl }) {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", filename); // Set download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
 
    return (
        <li className="flex items-center justify-between py-4 pl-3 pr-4 text-lg bg-gray-50 rounded-md">
            <div className="flex items-center">
                {icon}
                <span className="ml-3 truncate">{filename}</span>
            </div>
            <div className="ml-4 flex items-center space-x-4">
                <span className="text-gray-500">{filesize}</span>
                <Button variant="outline" size="lg" onClick={handleDownload}>
                    Download
                </Button>
            </div>
        </li>
    );
}
 
function getFileSize(fileUrl) {
    return "1.2 MB";
}
 