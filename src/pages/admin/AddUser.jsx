import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
    
  const handleCreateUser = () => {
    // Replace this section with backend functionality to create a new user

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const newUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    };

    console.log('User data to be sent to backend:', newUser);

    // Example backend API call (replace with actual API request)
    // fetch('/api/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(newUser),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('User created:', data);
    //     navigate('/users'); // Redirect back to Users page after success
    //   })
    //   .catch(error => console.error('Error:', error));
  };

  return (
   <Sidebar role={"admin"}>
       {/* Main Content */}
       <div className="col-span-12">
         {/* Header Row */}
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-3xl font-bold text-[#333333]">Add User</h1>
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
    
         {/* Form Section */}
         <div className="bg-[#F8F5F9] rounded-2xl shadow-md p-6 mb-6">
           <div className="grid grid-cols-2 gap-4">
             <input
               type="text"
               placeholder="First Name"
               className="input input-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
               value={firstName}
               onChange={(e) => setFirstName(e.target.value)}
             />
             <input
               type="text"
               placeholder="Last Name"
               className="input input-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
               value={lastName}
               onChange={(e) => setLastName(e.target.value)}
             />
             <input
               type="email"
               placeholder="Email"
               className="input input-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
             <input
               type="text"
               placeholder="Phone Number"
               className="input input-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
             />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered w-full rounded-2xl bg-[#ffffff] text-gray-700 p-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
           </div>
         </div>
    
         {/* Button Section */}
         <div className="flex justify-end space-x-4">
           <button
             className="btn bg-base-100 text-gray-600 hover:bg-gray-100 p-3 rounded-lg"
             onClick={() => navigate('/admin/users')}
           >
             Cancel
           </button>
           <button
             className="btn bg-primary/75 hover:bg-primary text-base-100 p-3 rounded-lg"
             onClick={handleCreateUser}
           >
             Create User
           </button>
         </div>
       </div>
   </Sidebar>
  );
};

export default AddUser;
