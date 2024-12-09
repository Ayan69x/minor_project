import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker styles
import { addUserProfile } from '../../redux/slice/userProfileSlice';

const UserProfileSetup = () => {
  const { user } = useSelector((state) => state.auth); // Get user from auth state
  const {org}  = useSelector((state)=> state.organization);
  const orgId = org?.organization?._id
  localStorage.setItem("orgId", orgId);
  // console.log(org);
  
  const [formData, setFormData] = useState({
    userId: user?.user._id || "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    dob: null, // Initial state for date picker is set to null
  });
// console.log('id',user?.user?._id);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: date ? date.toISOString().split('T')[0] : null, // Convert Date to yyyy-MM-dd format
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Log formData to verify the form is populated correctly
    console.log(formData);

    dispatch(addUserProfile(formData))
      .unwrap()
      .then(() => {
        setFormData({
          userId: "",
          firstName: "",
          lastName: "",
          contactNumber: "",
          dob: null,
        });
        navigate("/login");
      })
      .catch((err) => {
        console.error("Error:", err); // Log error from the server
      });
  };

  return (
    <div className="container" style={{ marginTop: "10rem" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>User Profile Setup</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* First Name Field */}
                <div className="form-group mb-3">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your First Name"
                    required
                  />
                </div>

                {/* Last Name Field */}
                <div className="form-group mb-3">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your Last Name"
                    required
                  />
                </div>

                {/* Contact Number Field */}
                <div className="form-group mb-3">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="
                    form-control"
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                {/* Date of Birth Field */}
                <div className="form-group mb-3">
                  <label htmlFor="dob">Date of Birth</label>
                  <DatePicker
                    selected={formData.dob ? new Date(formData.dob) : null}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    placeholderText="Select your date of birth"
                    showMonthDropdown   
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Set Up"}
                </button>

                {/* Error Message */}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSetup;
