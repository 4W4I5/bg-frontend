import React, { useState } from 'react';
import { Search} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Help = () => {
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace this section with backend functionality to submit a support ticket
    const ticket = {
      title: ticketTitle,
      description: ticketDescription,
    };

    console.log('Ticket submitted:', ticket);
  };

  return (
   <Sidebar role={"user"}>
       
       {/* Main Content */}
       <div className="col-span-12">
         {/* Header Row */}
         <div className="flex justify-between items-center mb-6">
           <div className="flex items-center">
             <h1 className="text-3xl font-bold text-[#333333]">Support</h1>
           </div>
           <div className="relative">
             {/* Search Icon inside the input field */}
             <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="w-5 h-5 text-gray-500" />
             </span>
             <input
               type="text"
               placeholder="Search"
               className="input input-bordered w-60 pl-10 rounded-2xl bg-[#ffffff] text-gray-500 border-none shadow-sm"
             />
           </div>
         </div>
    
         {/* Ticket Form Card */}
         <div className="bg-[#F8F5F9] rounded-2xl shadow-md p-6">
           <form onSubmit={handleSubmit} className="space-y-4">
             <input
               type="text"
               placeholder="Ticket Title"
               className="input input-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
               value={ticketTitle}
               onChange={(e) => setTicketTitle(e.target.value)}
               required
             />
             <textarea
               placeholder="Ticket Description"
               className="textarea textarea-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
               value={ticketDescription}
               onChange={(e) => {
                 setTicketDescription(e.target.value);
                 setCharCount(e.target.value.length);
               }}
               maxLength={maxCharCount}
               rows={6}
               required
             />
             <div className="flex justify-between items-center">
               <span className="text-gray-400 text-sm">{charCount}/{maxCharCount}</span>
               <button type="submit" className="btn bg-purple-700 hover:bg-purple-800 text-white p-3 rounded-2xl px-4">
                 Submit
               </button>
             </div>
           </form>
         </div>
       </div>

   </Sidebar>
  );
};

export default Help;
