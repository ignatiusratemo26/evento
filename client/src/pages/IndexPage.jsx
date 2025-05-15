/* eslint-disable react/jsx-key */
import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";

  export default function IndexPage() {
    const [events, setEvents] = useState([]);

   //! Fetch events from the server ---------------------------------------------------------------
    useEffect(() => {
      
      axios
        .get("/events")
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    }, []);
    
  //! Like Functionality --------------------------------------------------------------
    const handleLike = (eventId) => {
      axios
        .post(`/event/${eventId}`)
        .then((response) => {
            setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === eventId
                ? { ...event, likes: event.likes + 1 }
                : event
            )
          );
          console.log("done", response)
        })
        .catch((error) => {
          console.error("Error liking ", error);
        });
    };
  

    return (
      <>
      <div className="mt-1 flex flex-col">
        <div className="hidden sm:block" >
          <div href="#" className="flex item-center inset-0">
            <img src="../src/assets/evento.png" alt="" className='w-full'/> 
          </div>
        </div>

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5 ">
        
        {/*-------------------------- Checking whether there is a event or not-------------------  */}
        {events.length > 0 && events.map((event) => {
          const eventDate = new Date(event.eventDate);
          const currentDate = new Date();
          
          //! Check the event date is passed or not --------------------------------------------------------------------------------------- 
          if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()){

          return (
            <div className="bg-white rounded-xl relative h-[500px] flex flex-col" key={event._id}>
              {/* Fixed height image container */}
              <div className='h-48 overflow-hidden rounded-t-xl'>
                {event.image ? (
                  <img
                    src={`http://localhost:4000/${event.image}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                
                {/* Like button position adjusted */}
                <div className="absolute top-2 right-2">
                  <button onClick={() => handleLike(event._id)}>
                    <BiLike className="w-auto h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
                  </button>
                </div>
              </div>

              {/* Content area with fixed height and scrollable description */}
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="font-bold text-lg truncate">{event.title}</h1>
                  <div className="flex gap-2 items-center text-red-600"> <BiLike /> {event.likes}</div>
                </div>
                
                <div className="flex text-sm justify-between text-primarydark font-bold mb-2">
                  <div>{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                  <div>{event.ticketPrice === 0? 'Free' : 'Ksh. '+ event.ticketPrice}</div>
                </div>

                {/* Description with max height and overflow scroll */}
                <div className="text-xs flex-grow overflow-y-auto mb-2 h-20">
                  {event.description}
                </div>
                
                <div className="flex justify-between items-center mb-3 text-sm text-primarydark">
                  <div>
                    <span className="font-bold">Organized By:</span><br />
                    <span>{event.organizedBy}</span>
                  </div>
                  <div>
                    <span className="font-bold">Created By:</span><br />
                    <span>{event.owner}</span>
                  </div>
                </div>
                
                {/* Button fixed at bottom */}
                <Link to={'/event/'+event._id} className="mt-auto">
                  <button className="primary w-full flex items-center justify-center gap-2">
                    Book Ticket <BsArrowRightShort className="w-6 h-6" />
                  </button>
                </Link>
              </div>
            </div>
          )
          }
          return null;
        }   
        )}
        </div>
      </div>
      </>
        
      )
  }
  