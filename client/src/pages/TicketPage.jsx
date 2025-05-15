import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FaTicketAlt, FaCalendarAlt, FaUser, FaDollarSign, FaEnvelope, FaIdCard } from 'react-icons/fa'
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function TicketPage() {
    const { user } = useContext(UserContext);
    const [userTickets, setUserTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (user) {
        fetchTickets();
      }
    }, [user]); // Adding user as dependency to prevent infinite loop
  
    const fetchTickets = async() => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/tickets/user/${user._id}`);
        setUserTickets(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user tickets:', error);
        setError('Failed to load tickets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  
    const deleteTicket = async(ticketId) => {
      if (!confirm('Are you sure you want to delete this ticket?')) {
        return;
      }
      
      try {
        await axios.delete(`/tickets/${ticketId}`);
        fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Failed to delete ticket. Please try again.');
      }
    }
  
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <Link to='/'>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <IoMdArrowBack className="mr-2 -ml-1 h-5 w-5" /> 
              Back to Home
            </button>
          </Link>
        </div>
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              {error}
            </div>
          ) : userTickets.length === 0 ? (
            <div className="text-center py-12">
              <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any tickets yet.</p>
              <div className="mt-6">
                <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userTickets.map(ticket => (
                <div key={ticket._id} className="bg-white overflow-hidden shadow-lg rounded-lg">
                  {/* Ticket Header */}
                  <div className="bg-primary-light px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800 truncate">
                      {ticket.ticketDetails.eventname}
                    </h2>
                    <button 
                      onClick={() => deleteTicket(ticket._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete ticket"
                    >
                      <RiDeleteBinLine className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Ticket Content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* QR Code */}
                      <div className="flex-shrink-0 flex justify-center">
                        <img 
                          src={ticket.ticketDetails.qr} 
                          alt="QR Code" 
                          className="h-36 w-36 object-contain border border-gray-200 rounded"
                        />
                      </div>
                      
                      {/* Ticket Details */}
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <FaCalendarAlt className="mt-1 mr-3 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="font-semibold">
                              {ticket.ticketDetails.eventdate.split("T")[0]}<br/>
                              {ticket.ticketDetails.eventtime}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaUser className="mt-1 mr-3 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Attendee</p>
                            <p className="font-semibold">{ticket.ticketDetails.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaDollarSign className="mt-1 mr-3 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="font-semibold">
                              {ticket.ticketDetails.ticketprice > 0 
                                ? `KSH ${ticket.ticketDetails.ticketprice}` 
                                : 'Free'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaEnvelope className="mt-1 mr-3 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold text-sm truncate max-w-[180px]">
                              {ticket.ticketDetails.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start md:col-span-2">
                          <FaIdCard className="mt-1 mr-3 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Ticket ID</p>
                            <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                              {ticket._id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Validation note */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        This ticket is valid and has been verified
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
}