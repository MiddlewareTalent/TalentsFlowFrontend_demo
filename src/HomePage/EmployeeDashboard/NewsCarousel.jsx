import { useState, useEffect, useContext } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import axios from 'axios'
import Loader from '../../Timesheet/loader';
import { MyContext } from '../../MyProvider/MyProvider';
import url from '../../UniversalApi';

// Sample news data


export default function NewsCarousel() {
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const { state } = useContext(MyContext);
  const [showModal, setShowModal] = useState(false);
  const [newsDeleteId, setNewsDeleteId]=useState(null);
  const [loading,setLoading]=useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${url}/apis/employees/companyNews/getAllNews`, {
        headers: {
          "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
        }
      });
      console.log(response.data);
      setNewsData(response.data.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
      

    fetchData();
  }, []);

  

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  let currentNews;
  let isFirstNews;
  let isLastNews;


  if (newsData !== null) {
    currentNews = newsData[currentIndex]
    isFirstNews = currentIndex === 0
    isLastNews = currentIndex === newsData.length - 1
  }

  const deleteNews=async(id)=>{
    setLoading(true);
    const token = localStorage.getItem("token");
    try{
      await axios.delete(`${url}/apis/employees/companyNews/deleteNewsById/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
        }
      })
      await fetchData();
      setShowModal(false);
      setLoading(false);
    }
    catch(e){
      console.log(e);
    }

    setCurrentIndex(0);

  }


const showDelete=(id)=>{
  setNewsDeleteId(id);
  setShowModal(true); 
}


  return (
    <div className="flex flex-col items-center justify-center">
      {loading && <Loader/>}
      {newsData !== null && newsData.length > 0 && (
        <div className="flex justify-between w-full max-w-2xl mt-4">
          {!isFirstNews && (
            <button
              onClick={goToPrevious}
              className="flex items-center px-4 py-2 text-black border border-solid border-black rounded-md transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
            </button>
          )}
          <div className="flex-grow" /> {/* This div will take the remaining space */}
          {!isLastNews && (
            <button
              onClick={goToNext}
              className="flex items-center px-4 py-2 text-black border border-solid border-black rounded-md transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      )}


{showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Are you sure you want to delete this Post?</h2>
                  <div className="mt-5 p-4 flex justify-center space-x-2 ">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-200 text-lg text-gray-800 mr-3 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out"
                    >
                      Close
                    </button>
                    <button
                      onClick={()=>deleteNews(newsDeleteId)}
                      className="bg-red-600 text-lg text-white px-4 py-2 ml-4 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

      {newsData !== null && newsData.length > 0 && <div className="bg-slate-100 p- mt-5 shadow-md rounded-lg w-full max-w-2xl overflow-hidden">
        <div className="p-6 ">
          {newsData.length > 0 && <h2 className="text-2xl font-bold mb-2">{currentNews.newsHeading}</h2>}
          {newsData.length > 0 && <p className="text-gray-600">{currentNews.news}</p>}
        </div>

      </div>}
      {newsData.length>0 && state.employeeId===currentNews.userId && 
      <button
      type="button"
      onClick={() => {
        showDelete(currentNews.newsId)
      }}
      className="inline-flex items-end mt-5 rounded-md bg-indigo-600 px-3 py-2 text-xl font-semibold text-white bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >Delete News
    </button>}
    </div>
  )
}