import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook, FaTicketAlt } from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import { toast } from "react-toastify";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  //! Fetching the event data from server by ID
  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axios
      .get(`/event/${id}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  //! Copy Functionalities
  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      toast.success('Link copied to clipboard!');
    });
  };

  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`Check out this event: ${event.title} ${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
    window.open(facebookShareUrl);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) return "";

  return (
    <div className="flex flex-col pb-12 flex-grow">
      {/* Hero Image Section */}
      <div className="w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] relative bg-gray-200">
        {event.image ? (
          <img
            src={`https://evento-ems-api.onrender.com/${event.image}`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
              {event.title}
            </h1>
            <p className="text-white/90 mt-2 text-lg">
              {event.ticketPrice === 0 ? 'FREE EVENT' : `KSH ${event.ticketPrice}`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            {/* CTA for Mobile */}
            <div className="lg:hidden mb-6">
              <Link to={'/event/'+event._id+ '/ordersummary'}>
                <button className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                  <FaTicketAlt /> Book Ticket
                </button>  
              </Link>
            </div>

            {/* Event Description */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <div className="text-gray-700 whitespace-pre-line">
                {event.description}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900">Organized By</h3>
                <p className="text-gray-700">{event.organizedBy}</p>
              </div>
            </div>

            {/* Date, Time and Location - Mobile View */}
            <div className="lg:hidden bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">When and Where</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-light p-3 rounded-full">
                    <AiFillCalendar className="text-primary h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">Date</h3>
                    <p>{event.eventDate.split("T")[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-light p-3 rounded-full">
                    <BiTime className="text-primary h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">Time</h3>
                    <p>{event.eventTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-light p-3 rounded-full">
                    <MdLocationPin className="text-primary h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">Location</h3>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Share with Friends</h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FaCopy className="h-5 w-5 text-gray-700" />
                </button>

                <button 
                  onClick={handleWhatsAppShare}
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                >
                  <FaWhatsappSquare className="h-6 w-6 text-green-600" />
                </button>

                <button 
                  onClick={handleFacebookShare}
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <FaFacebook className="h-6 w-6 text-blue-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Box */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-primary-light p-6">
                <h3 className="font-bold text-lg text-gray-900">
                  {event.ticketPrice === 0 ? 'FREE EVENT' : `KSH ${event.ticketPrice}`}
                </h3>
              </div>
              
              {/* Date and Location */}
              <div className="p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-light p-3 rounded-full">
                    <AiFillCalendar className="text-primary h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">Date</h3>
                    <p>{event.eventDate.split("T")[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-light p-3 rounded-full">
                    <BiTime className="text-primary h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">Time</h3>
                    <p>{event.eventTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-light p-3 rounded-full">
                    <MdLocationPin className="text-primary h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">Location</h3>
                    <p>{event.location}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Link to={'/event/'+event._id+ '/ordersummary'} className="mt-4 block">
                  <button className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                    <FaTicketAlt /> Book Ticket
                  </button>  
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}