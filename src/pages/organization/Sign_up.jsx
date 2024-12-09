import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser, clearMessage } from "../../redux/slice/signinSlice"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const OrgSignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, error, isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUpUser(formData))
      .unwrap()
      .then(() => {
        try {
          navigate("/organization-setup");
          setFormData({
            username: "",
            email: "",
            password: "",
            phone: "",
          });
        } catch (error) {
          console.log(error);
        }
      });
  };

  return (
    <div className="container" style={{ marginTop: "7rem" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>Sign Up</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="form-group mb-3">
                  <label htmlFor="username">UserName</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your Username"
                    required
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter a password"
                    required
                    minLength="6"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
              <div className="login-link">
                <p>
                  Already have an account? <a href="/login">Login here</a>
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <p className="mt-3 text-center text-success">{message}</p>
              )}
              {error && <p className="mt-3 text-center text-danger">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgSignUp;
