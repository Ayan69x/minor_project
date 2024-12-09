import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setupOrganization } from '../../redux/slice/oraganizationSlice';
import { useNavigate } from 'react-router-dom';

const OrganizationSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, message, error } = useSelector((state) => state.organization);
const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    userId: user?.user._id || '',
    name: '',
    logo: null,
    email: '',
    addressLine: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setupOrganization(formData));
    navigate("/user-profile-setup"); 
  };

  return (
    <div className="container" style={{ marginTop: "7rem" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              <h2>Organization Setup</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* All input fields... */}
               
              
                {/* User ID Field */}
                {/* <div className="form-group mb-3">
                  <label htmlFor="userId">User ID</label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter user ID"
                    required
                  />
                </div> */}

                {/* Organization Name Field */}
                <div className="form-group mb-3">
                  <label htmlFor="name">Organization Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                {/* Logo Field */}
                <div className="form-group mb-3">
                  <label htmlFor="logo">Organization Logo</label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleFileChange}
                    className="form-control"
                    accept="image/*"
                  />
                </div>

                {/* Email Field */}
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="form-group mb-3">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {/* Address Field */}
                <div className="form-group mb-3">
                  <label htmlFor="addressLine">Address Line</label>
                  <input
                    type="text"
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter address"
                    required
                  />
                </div>

                {/* City Field */}
                <div className="form-group mb-3">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter city"
                    required
                  />
                </div>

                {/* State Field */}
                <div className="form-group mb-3">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter state"
                    required
                  />
                </div>

                {/* Country Field */}
                <div className="form-group mb-3">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter country"
                    required
                  />
                </div>

                {/* Zip Code Field */}
                <div className="form-group mb-3">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter zip code"
                    required
                  />
                </div>
                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting...' : 'Submit'}
                </button>
              </form>

              {/* Message Display */}
              {message && <p className="mt-3 text-center text-success">{message}</p>}
              {error && <p className="mt-3 text-center text-danger">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;
