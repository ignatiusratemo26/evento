import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { BsCheck2Circle } from "react-icons/bs";
import { FaCalendarAlt, FaClock, FaUserAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function OrderSummary() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }
    
    setLoading(true);
    axios
      .get(`/event/${id}/ordersummary`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) return "";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-8">
        <Link to={'/event/' + event._id} className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
          <IoMdArrowBack className="mr-2 h-5 w-5" />
          <span>Back to Event</span>
        </Link>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-primary-light p-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
          </div>
          
          {/* Event Details */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Event Image */}
              <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-gray-200">
                {event.image ? (
                  <img
                    src={`https://evento-ems-api.onrender.com/${event.image}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              
              {/* Event Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-primary mr-2" />
                    <span>{event.eventDate.split("T")[0]}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaClock className="text-primary mr-2" />
                    <span>{event.eventTime}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MdLocationPin className="text-primary mr-2" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaUserAlt className="text-primary mr-2" />
                    <span>{event.organizedBy}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing Details */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-700">1 x Ticket</span>
                <span className="font-bold">{event.ticketPrice === 0 ? 'FREE' : `KSH ${event.ticketPrice}`}</span>
              </div>
              
              {event.ticketPrice > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-700">Service Fee</span>
                  <span className="font-bold">KSH 0.00</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-lg font-bold">
                <span>Total</span>
                <span>{event.ticketPrice === 0 ? 'FREE' : `KSH ${event.ticketPrice}`}</span>
              </div>
            </div>
            
            {/* Information Note */}
            <div className="mt-8 bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <BsCheck2Circle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    What happens next?
                  </h4>
                  <p className="mt-1 text-sm text-blue-700">
                    After proceeding to payment, you'll receive an e-ticket that grants
                    you access to this event.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between gap-4">
            <Link
              to={`/event/${event._id}`}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <IoMdArrowBack className="mr-2 h-5 w-5" /> Back to Event
            </Link>
            
            <Link 
              to={`/event/${event._id}/ordersummary/paymentsummary`}
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Proceed to Payment
            </Link>
          </div>
        </div>
        
        {!user && (
          <div className="mt-6 text-center p-4 bg-yellow-50 border border-yellow-100 rounded-md">
            <p className="text-sm text-yellow-700">
              You need to be logged in to book tickets.{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>{" "}
              or{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                create an account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}