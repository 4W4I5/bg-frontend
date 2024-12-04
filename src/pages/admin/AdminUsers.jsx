import React, { useEffect, useState } from "react";
import { Edit, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader"; // Import the Loader component

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // State to control the loading status
  const [modalOpen, setModalOpen] = useState(false); // State to control Modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // Store the selected user for editing
  const navigate = useNavigate();

  // Dummy data to display if no users are fetched
  const dummyData = [
    { id: 1, firstName: "John", lastName: "Doe", online: true },
    { id: 2, firstName: "Jane", lastName: "Smith", online: false },
  ];

  // Fetch users from the backend
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/v1/getUsers");
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setUsers(dummyData); // Set dummy data if fetched data is not an array or empty
      } else {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers(dummyData); // Set dummy data in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Handle delete user with confirmation
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await fetch(`http://127.0.0.1:8000/admin/v1/deleteUser/${userId}`, {
        method: "DELETE",
      });
      // Remove the user from the state after successful deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the edit modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true); // Open the modal
  };

  // Handle modal submit (edit user)
  const handleModalSubmit = async (updatedUserData) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/v1/editUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error editing user:", error);
    } finally {
      setLoading(false);
      setModalOpen(false); // Close the modal after editing
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Sidebar role={"admin"}>
      {/* Main Content */}
      <div className="col-span-12">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#333333]">Users</h1>
          <div className="flex items-center space-x-4">
            <button
              className="btn bg-primary/75 hover:bg-primary text-base-100 rounded-2xl px-4"
              onClick={() => navigate("/admin/adduser")}
            >
              + Add User
            </button>
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
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {loading ? (
            <Loader /> // Show loader if loading is true
          ) : (
            users.map((user, index) => (
              <div
                key={index}
                className="bg-base-100 rounded-2xl shadow-md p-6 flex justify-between items-center"
              >
                <div className="flex items-center space-x-2">
                  {/* Online/Offline Indicator */}
                  <h2 className="text-lg font-semibold text-[#333333]">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.online ? "bg-green-300" : "bg-gray-400"
                    }`}
                  ></div>
                </div>

                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <button
                    className="btn bg-primary/75 hover:bg-primary text-base-100 p-2 w-10 h-10 flex justify-center items-center rounded-xl"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit size={16} />
                  </button>
                  {/* Delete Button */}
                  <button
                    className="btn bg-[#B80000] hover:bg-red-800 text-base-100 p-2 w-10 h-10 flex justify-center items-center rounded-xl"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for editing user */}
      {modalOpen && (
        <Modal
          id="edit-user-modal"
          titleText="Edit User"
          contentText="Edit the user details"
          onSubmit={handleModalSubmit}
          onClose={handleCloseModal} // Add onClose handler
          actionButtonText="Save Changes"
          icon={<Edit size={24} />}
          modalData={selectedUser} // Pass selected user data to the modal
        />
      )}
    </Sidebar>
  );
};

export default AdminUsers;
