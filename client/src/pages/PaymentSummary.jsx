/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io'
import { FaCreditCard, FaLock } from 'react-icons/fa'
import { MdPayment, MdSecurity } from 'react-icons/md'
import { UserContext } from '../UserContext';
import Qrcode from 'qrcode'

export default function PaymentSummary() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { user } = useContext(UserContext);
    const [details, setDetails] = useState({
      name: '',
      email: '',
      contactNo: '',
    });
    
    const defaultTicketState = {
      userid: user ? user._id : '',
      eventid: '',
      ticketDetails: {
        name: user ? user.name : '',
        email: user ? user.email : '',
        eventname: '',
        eventdate: '',
        eventtime: '',
        ticketprice: '',
        qr: '',
      }
    };

    const [ticketDetails, setTicketDetails] = useState(defaultTicketState);
    const [payment, setPayment] = useState({
      nameOnCard: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    });
    const [redirect, setRedirect] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if(!id) return;
      
      axios.get(`/event/${id}/ordersummary/paymentsummary`).then(response => {
        setEvent(response.data)

        setTicketDetails(prevTicketDetails => ({
          ...prevTicketDetails,
          eventid: response.data._id,
          ticketDetails: {
            ...prevTicketDetails.ticketDetails,
            eventname: response.data.title,
            eventdate: response.data.eventDate.split("T")[0],
            eventtime: response.data.eventTime,
            ticketprice: response.data.ticketPrice,
          }
        }));
      }).catch((error) => {
        console.error("Error fetching events:", error);
      });
    }, [id]);

    useEffect(() => {
      setTicketDetails(prevTicketDetails => ({
        ...prevTicketDetails,
        userid: user ? user._id : '',
        ticketDetails: {
          ...prevTicketDetails.ticketDetails,
          name: user ? user.name : '',
          email: user ? user.email : '',
        }
      }));
    }, [user]);
    
    if (!event) return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

    const handleChangeDetails = (e) => {
      const { name, value } = e.target;
      setDetails(prev => ({ ...prev, [name]: value }));
    };
  
    const handleChangePayment = (e) => {
      const { name, value } = e.target;
      setPayment(prev => ({ ...prev, [name]: value }));
    };

    const createTicket = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        const qrCode = await generateQRCode(
          ticketDetails.ticketDetails.eventname,
          ticketDetails.ticketDetails.name
        );

        const updatedTicketDetails = {
          ...ticketDetails,
          ticketDetails: {
            ...ticketDetails.ticketDetails,
            qr: qrCode,
          }
        };
        
        await axios.post(`/tickets`, updatedTicketDetails);
        
        // Show success feedback
        setIsLoading(false);
        setRedirect(true);
      } catch (error) {
        console.error('Error creating ticket:', error);
        setIsLoading(false);
        alert("Payment failed. Please try again.");
      }
    }

    async function generateQRCode(name, eventName) {
      try {
        return await Qrcode.toDataURL(`Event Name: ${name} \n Name: ${eventName}`);
      } catch (error) {
        console.error("Error generating QR code:", error);
        return null;
      }
    }
    
    if (redirect) {
      return <Navigate to={'/wallet'} />
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link to={'/event/'+event._id+ '/ordersummary'} className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
            <IoMdArrowBack className="mr-2 h-5 w-5" />
            <span>Back to Order Summary</span>
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Purchase</h2>
                  
                  {/* Your Details Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                        <MdSecurity className="h-5 w-5 text-primary" />
                      </span>
                      Your Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={details.name}
                          onChange={handleChangeDetails}
                          placeholder="Enter your full name"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={details.email}
                          onChange={handleChangeDetails}
                          placeholder="Enter your email"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                          type="tel"
                          id="contactNo"
                          name="contactNo"
                          value={details.contactNo}
                          onChange={handleChangeDetails}
                          placeholder="Enter your phone number"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Options Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                        <MdPayment className="h-5 w-5 text-primary" />
                      </span>
                      Payment Method
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex space-x-4 mb-6">
                        <button 
                          type="button" 
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-md shadow-sm"
                        >
                          <FaCreditCard />
                          Credit / Debit Card
                        </button>
                        <button 
                          type="button" 
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-500 rounded-md border border-gray-300"
                          disabled
                        >
                          Mobile Payment
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                          <input
                            type="text"
                            id="nameOnCard"
                            name="nameOnCard"
                            placeholder="John Doe"
                            onChange={handleChangePayment}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="5648 3212 7802"
                              onChange={handleChangePayment}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            onChange={handleChangePayment}
                            placeholder="MM/YY"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="password"
                            id="cvv"
                            name="cvv"
                            placeholder="e.g. 532"
                            onChange={handleChangePayment}
                            maxLength={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-6 border-t border-gray-200">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <FaLock className="text-green-600 mr-2" />
                        <span className="text-sm text-gray-600">Secured & encrypted payment</span>
                      </div>
                      
                      <button 
                        type="button" 
                        onClick={createTicket}
                        disabled={isLoading}
                        className={`
                          w-full sm:w-auto px-8 py-3 rounded-md text-white font-medium
                          ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'}
                          shadow-md transition-colors flex items-center justify-center gap-2
                        `}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                          </>
                        ) : (
                          `Pay KSH ${event.ticketPrice}`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-primary-light p-6">
                  <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>{event.eventDate.split("T")[0]}</div>
                        <div>{event.eventTime}</div>
                        <div className="mt-2 bg-green-50 text-green-800 inline-block px-2 py-1 rounded text-xs font-medium">
                          1 Ticket
                        </div>
                      </div>
                    </div>
                    
                    {event.image && (
                      <div className="w-16 h-16 ml-4">
                        <img 
                          src={`http://localhost:4000/${event.image}`} 
                          alt={event.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Ticket Price:</span>
                      <span>KSH {event.ticketPrice}</span>
                    </div>
                    
                    {event.ticketPrice > 0 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span>Service Fee:</span>
                        <span>KSH 0.00</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-base mt-4 pt-4 border-t border-gray-200">
                      <span>Total:</span>
                      <span>KSH {event.ticketPrice}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-md">
                    <p className="text-sm text-blue-800">
                      Your e-ticket will be sent to your email address after successful payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}