import { ethers } from "ethers";
import {
  Check,
  Edit,
  KeyRound,
  Loader2,
  Search,
  SquareUserRound,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import sampleQR from "../../assets/sample-QR.png";
import Sidebar from "../../components/Sidebar";

const AdminProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAuth, setEditingAuth] = useState(false);
  const [errors, setErrors] = useState({});
  const [account, setAccount] = useState(null);
  const [didDetails, setDidDetails] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletPassword, setWalletPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [walletExists, setWalletExists] = useState(
    !!localStorage.getItem("encryptedWallet")
  );

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchAdminProfile = async () => {
      setIsLoading(true);
      const accessToken = sessionStorage.getItem("access_token") || "";

      try {
        const response = await fetch("http://127.0.0.1:8000/admin/v1/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 401) {
          console.log("Redirecting to:", "/");
          window.location.href = "/";
          return;
        }
        const adminData = await response.json();
        setProfile(adminData);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const [editForm, setEditForm] = useState({ ...profile });
  const [authForm, setAuthForm] = useState({
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: profile.twoFactorAuth,
  });

  // Validation functions
  const validatePersonal = () => {
    const errors = {};
    if (!editForm.firstName) errors.firstName = "First name is required";
    if (!editForm.lastName) errors.lastName = "Last name is required";
    if (!editForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email))
      errors.email = "Valid email is required";
    if (!editForm.phone || !/^\+?[\d\s-]+$/.test(editForm.phone))
      errors.phone = "Valid phone number is required";
    return errors;
  };

  const validateAuth = () => {
    const errors = {};
    if (authForm.newPassword !== authForm.confirmPassword)
      errors.password = "Passwords do not match";
    if (authForm.newPassword && authForm.newPassword.length < 8)
      errors.password = "Password must be at least 8 characters";
    return errors;
  };

  // Save handlers with dummy API calls
  const handleSavePersonal = async () => {
    const accessToken = sessionStorage.getItem("access_token") || "";

    const validationErrors = validatePersonal();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/admin/v1/updateProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(editForm),
        }
      );
      if (response.status === 401) {
        console.log("Redirecting to:", "/");
        window.location.href = "/";
        return;
      }

      if (!response.ok) throw new Error("Failed to update profile");

      setProfile(editForm);
      setEditingPersonal(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAuth = async () => {
    const accessToken = sessionStorage.getItem("access_token") || "";

    const validationErrors = validateAuth();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/admin/v1/updateAuth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(authForm),
        }
      );

      if (!response.ok) throw new Error("Failed to update authentication");

      setProfile((prev) => ({
        ...prev,
        passwordSet: authForm.newPassword ? true : prev.passwordSet,
        twoFactorAuth: authForm.twoFactorAuth,
      }));
      setEditingAuth(false);
      setAuthForm({
        newPassword: "",
        confirmPassword: "",
        twoFactorAuth: authForm.twoFactorAuth,
      });
      setErrors({});
    } catch (error) {
      console.error("Error updating authentication:", error);
      setErrors({ submit: "Failed to update authentication" });
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      setIsLoadingWallet(true);
      const wallet = ethers.Wallet.createRandom();
      const encryptedJson = await wallet.encrypt(walletPassword);
      localStorage.setItem("encryptedWallet", encryptedJson);
      setWallet(wallet);
      setAccount(wallet.address);
      setWalletExists(true);
      console.log("Wallet created:", wallet);
      console.log("Encrypted JSON:", encryptedJson);
    } catch (err) {
      console.error("Error in createWallet:", err);
      alert("Failed to create wallet.");
    } finally {
      setIsLoadingWallet(false);
      setIsPasswordModalOpen(false);
    }
  };

  const loadWallet = async () => {
    const encryptedWallet = localStorage.getItem("encryptedWallet");
    if (encryptedWallet) {
      try {
        setIsLoadingWallet(true);
        const wallet = await ethers.Wallet.fromEncryptedJson(
          encryptedWallet,
          walletPassword
        );
        setWallet(wallet);
        setAccount(wallet.address);
        console.log("Wallet loaded:", wallet);
      } catch (err) {
        console.error("Error in loadWallet:", err);
        alert("Failed to load wallet.");
      } finally {
        setIsLoadingWallet(false);
        setIsPasswordModalOpen(false);
      }
    } else {
      alert("No wallet found. Please create a new wallet.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (walletExists) {
      loadWallet();
    } else {
      createWallet();
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setIsLoadingWallet(false);
    setTimeout(() => {
      document.getElementById("wallet-password-input").focus();
    }, 100);
  };

  return (
    <Sidebar role={"admin"}>
      <dialog id="qr-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Connect with your mobile app</h3>
          <p className="py-4">
            Scan this code with the BlackGate mobile app on your phone to enable
            2-Factor Authentication.
          </p>
          <img src={sampleQR} alt="QR Code" className="w-48 h-48 mx-auto" />
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("qr-modal").close()}
            >
              Done
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="password-modal" className="modal" open={isPasswordModalOpen}>
        <form className="modal-box" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg">Enter Wallet Password</h3>
          <input
            id="wallet-password-input"
            type="password"
            // value={walletPassword}
            onChange={(e) => setWalletPassword(e.target.value)}
            className="input input-bordered w-full mt-4"
            placeholder="Enter your wallet password"
          />
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setWalletPassword("");
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoadingWallet}
            >
              {isLoadingWallet ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </dialog>

      <div className="col-span-12">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#333333]">Profile</h1>
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

        {/* Cards Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-base-100 rounded-2xl shadow-md p-6 relative">
            <div className="absolute top-4 right-4">
              {editingPersonal ? (
                <div className="space-x-2">
                  <button
                    className="btn bg-gray-500 hover:bg-gray-600 text-base-100 p-2 rounded-2xl px-4"
                    onClick={() => {
                      setEditingPersonal(false);
                      setEditForm({ ...profile });
                      setErrors({});
                    }}
                    disabled={isLoading}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    className="btn bg-primary/75 hover:bg-primary text-base-100 p-2 rounded-2xl px-4"
                    onClick={handleSavePersonal}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Check size={16} />
                    )}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className="btn bg-primary/75 hover:bg-primary text-base-100 p-2 rounded-2xl px-4"
                  onClick={() => setEditingPersonal(true)}
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <SquareUserRound size={32} className="text-primary" />
              <h2 className="text-xl font-bold text-[#333333]">
                Personal Information
              </h2>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-y-4 items-center">
                {/* First Name */}
                <p className="font-semibold">First name:</p>
                <div className="col-span-2">
                  {editingPersonal ? (
                    <>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="input input-bordered w-full"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">
                          {errors.firstName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>{profile.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <p className="font-semibold">Last name:</p>
                <div className="col-span-2">
                  {editingPersonal ? (
                    <>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="input input-bordered w-full"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>{profile.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <p className="font-semibold">Email:</p>
                <div className="col-span-2">
                  {editingPersonal ? (
                    <>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="input input-bordered w-full"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </>
                  ) : (
                    <p>{profile.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <p className="font-semibold">Phone No.:</p>
                <div className="col-span-2">
                  {editingPersonal ? (
                    <>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className="input input-bordered w-full"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </>
                  ) : (
                    <p>{profile.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Card */}
          <div className="bg-base-100 rounded-2xl shadow-md p-6 relative">
            <div className="absolute top-4 right-4">
              {editingAuth ? (
                <div className="space-x-2">
                  <button
                    className="btn bg-gray-500 hover:bg-gray-600 text-base-100 p-2 rounded-2xl px-4"
                    onClick={() => {
                      setEditingAuth(false);
                      setAuthForm({
                        newPassword: "",
                        confirmPassword: "",
                        twoFactorAuth: profile.twoFactorAuth,
                      });
                      setErrors({});
                    }}
                    disabled={isLoading}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    className="btn bg-primary/75 hover:bg-primary text-base-100 p-2 rounded-2xl px-4"
                    onClick={handleSaveAuth}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Check size={16} />
                    )}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className="btn bg-primary/75 hover:bg-primary text-base-100 p-2 rounded-2xl px-4"
                  onClick={() => setEditingAuth(true)}
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <KeyRound size={32} className="text-primary" />
              <h2 className="text-xl font-bold text-[#333333]">
                Authentication
              </h2>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-y-4 items-center">
                {/* Password */}
                <p className="font-semibold">Password:</p>
                <div className="col-span-2">
                  {editingAuth ? (
                    <>
                      <input
                        type="password"
                        placeholder="New Password"
                        value={authForm.newPassword}
                        onChange={(e) =>
                          setAuthForm({
                            ...authForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="input input-bordered w-full"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={authForm.confirmPassword}
                        onChange={(e) =>
                          setAuthForm({
                            ...authForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="input input-bordered w-full mt-2"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>{profile.passwordSet ? "Set" : "Not Set"}</p>
                  )}
                </div>

                {/* 2-Factor Auth */}
                <p className="font-semibold">2-Factor Auth:</p>
                <div className="col-span-2">
                  {editingAuth ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={authForm.twoFactorAuth}
                        onChange={(e) => {
                          setAuthForm({
                            ...authForm,
                            twoFactorAuth: e.target.checked,
                          });
                          if (e.target.checked)
                            document.getElementById("qr-modal").showModal();
                        }}
                        className="checkbox checkbox-primary"
                      />
                      <span>Enable 2-Factor Authentication</span>
                    </div>
                  ) : (
                    <p>{profile.twoFactorAuth ? "Enabled" : "Disabled"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-base-100 rounded-2xl shadow-md p-6 relative">
            <div className="absolute top-4 right-4">
              <button
                className="btn bg-primary/75 hover:bg-primary text-base-100 p-2 rounded-2xl px-4"
                onClick={handleOpenPasswordModal}
              >
                {walletExists ? "Load Wallet" : "Create Wallet"}
              </button>
            </div>
            <div className="flex gap-2">
              <KeyRound size={32} className="text-primary" />
              <h2 className="text-xl font-bold text-[#333333]">Wallet</h2>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-y-4 items-center">
                <p className="font-semibold">Wallet:</p>
                <div className="col-span-2">
                  <p>{account}</p>
                </div>
                {wallet && (
                  <>
                    <p className="font-semibold">Private Key:</p>
                    <div className="col-span-2">
                      <p>{wallet.privateKey}</p>
                    </div>
                    <p className="font-semibold">Public Key:</p>
                    <div className="col-span-2">
                      <p>{wallet.publicKey}</p>
                    </div>
                  </>
                )}
                {didDetails && (
                  <>
                    <p className="font-semibold">DID Document:</p>
                    <div className="col-span-2">
                      <pre>
                        {JSON.stringify(didDetails.didDocument, null, 2)}
                      </pre>
                    </div>
                    <p className="font-semibold">Credential:</p>
                    <div className="col-span-2">
                      <pre>
                        {JSON.stringify(didDetails.credential, null, 2)}
                      </pre>
                    </div>
                    <p className="font-semibold">Proof Options:</p>
                    <div className="col-span-2">
                      <pre>
                        {JSON.stringify(didDetails.proof_options, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminProfile;
