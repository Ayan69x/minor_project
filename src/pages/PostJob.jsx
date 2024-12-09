import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constant/Env";
import "../style/PostJob.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { postJob } from "../redux/slice/jobSlice";
import { useDispatch } from "react-redux";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    salaryRange: "",
    location: { city: "", country: "" }, // Nested object for location
    jobType: "",
    description: "",
    // responsibilities: [], 
    // skills: [], 
    experienceLevel: "",
    contactEmail: "",
    websiteUrl: "",
  });

  const [companyLogo, setCompanyLogo] = useState(null); // File state for company logo
  const [inputValue, setInputValue] = useState(""); // For handling user input for skills
  const [responsibilityValue, setResponsibilityValue] = useState(""); // For handling user input for responsibilities
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle form input changes for nested objects like location
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "city" || name === "country") {
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, [name]: value }, // Update nested location field
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle file input change (company logo)
  const handleFileChange = (e) => {
    setCompanyLogo(e.target.files[0]); // Capture the file object
  };

  // Reset form fields and file input
  const handleReset = () => {
    setFormData({
      title: "",
      companyName: "",
      salaryRange: "",
      location: { city: "", country: "" },
      jobType: "",
      description: "",
      // responsibilities: [],
      // skills: [],
      experienceLevel: "",
      contactEmail: "",
      websiteUrl: "",
    });
    setCompanyLogo(null); // Reset the file input
    setInputValue("");
    setResponsibilityValue("");
  };

  // Handle adding skills
  const handleSkillInput = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = inputValue.trim();
      if (newSkill && !formData.skills.includes(newSkill)) {
        setFormData((prevData) => ({
          ...prevData,
          skills: [...prevData.skills, newSkill],
        }));
      }
      setInputValue(""); // Clear input after adding skill
    }
  };

  // Handle adding responsibilities
  // const handleResponsibilityInput = (e) => {
  //   if (e.key === "Enter" || e.key === ",") {
  //     e.preventDefault();
  //     const newResponsibility = responsibilityValue.trim();
  //     if (
  //       newResponsibility &&
  //       !formData.responsibilities.includes(newResponsibility)
  //     ) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         responsibilities: [...prevData.responsibilities, newResponsibility],
  //       }));
  //     }
  //     setResponsibilityValue(""); // Clear input after adding responsibility
  //   }
  // };

  // Remove a skill from the list
  // const removeSkill = (index) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     skills: prevData.skills.filter((_, i) => i !== index),
  //   }));
  // };

  // Remove a responsibility from the list
  // const removeResponsibility = (index) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     responsibilities: prevData.responsibilities.filter((_, i) => i !== index),
  //   }));
  // };

  // Handle form submission
  

    // Prepare form data for submission
    // const jobFormData = new FormData();

    // Loop through the formData and append fields to FormData
    // Object.keys(formData).forEach((key) => {
    //   if (Array.isArray(formData[key])) {
    //     formData[key].forEach((item) => jobFormData.append(`${key}[]`, item)); // Append arrays like skills and responsibilities
    //   } else if (typeof formData[key] === "object" && formData[key] !== null) {
    //     // For nested objects like location
    //     if (key === "location") {
    //       jobFormData.append("location.city", formData.location.city);
    //       jobFormData.append("location.country", formData.location.country);
    //     }
    //   } else {
    //     jobFormData.append(key, formData[key]); // Append other fields
    //   }
    // });

    // Append company logo if it exists
    // if (companyLogo) {
    //   jobFormData.append("companyLogo", companyLogo);
    // }

    console.log("formData",formData);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Create a new FormData object
      const jobData = new FormData();
    
      // Append the text fields
      jobData.append('title', formData.title);
      jobData.append('companyName', formData.companyName);
      jobData.append('location.city', formData.location.city);
      jobData.append('location.country', formData.location.country);
      jobData.append('salaryRange', formData.salaryRange);
      jobData.append('jobType', formData.jobType);
      jobData.append('description', formData.description);
      jobData.append('experienceLevel', formData.experienceLevel);
      jobData.append('contactEmail', formData.contactEmail);
      jobData.append('websiteUrl', formData.websiteUrl);
    
      // Append the file if present
      if (formData.file) {
        jobData.append('companyLogo', formData.file); // Assuming the file is called `companyLogo`
      }
    
      try {
        // Send the FormData with the dispatch
        const response = await dispatch(postJob(jobData)).unwrap();
        
        console.log("Job posted successfully!", response);
    
        // Handle successful response
        toast.success("Job posted successfully!");
        navigate("/wantjob"); // Redirect to jobs list page
      } catch (error) {
        console.error("Error posting job", error);
        toast.error("Failed to post the job. Please try again.");
      }
    };

  return (
    <section id="post-job-section" className="section-bg">
      <div className="section-title mt-5">
        <h2>Post a Job</h2>
      </div>
      <div className="container" data-aos="fade-up">
        <div className="post-job-container">
          {/* <h1>Post a Job</h1> */}
          <form className="post-job-form" onSubmit={handleSubmit}>
            {/* Job title */}
            <div className="form-group">
              <label>
                Job Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* Company details */}
            <div className="form-group">
              <label>
                Company Name:
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Company Logo:
                <input
                  type="file"
                  name="companyLogo"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>

            {/* Location */}
            <div className="form-group">
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Country:
                <input
                  type="text"
                  name="country"
                  value={formData.location.country}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* Job details */}
            <div className="form-group">
              <label>
                Job Type:
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </label>
              <label>
                Salary Range:
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* Experience level and contact */}
            <div className="form-group">
              <label>
                Experience Level:
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Experience Level</option>
                  <option value="0-1yr">0-1 year</option>
                  <option value="1-3yr">1-3 years</option>
                  <option value="3-5yr">3-5 years</option>
                  <option value="5-8yr">5-8 years</option>
                  <option value="8above">8+ years</option>
                </select>
              </label>
              <label>
                Contact Email:
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* Responsibilities */}
            {/* <div className="form-group">
              <label>
                Responsibilities:
                <input
                  type="text"
                  value={responsibilityValue}
                  onChange={(e) => setResponsibilityValue(e.target.value)}
                  onKeyDown={handleResponsibilityInput}
                  placeholder="Press Enter to add"
                />
              </label>
              <ul>
                {formData.responsibilities.map((resp, index) => (
                  <li key={index}>
                    {resp}{" "}
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeResponsibility(index)}
                    >
                      <FaTrash /> 
                    </button>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Skills */}
            {/* <div className="form-group">
              <label>
                Skills:
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleSkillInput}
                  placeholder="Press Enter to add"
                />
              </label>
              <ul>
                {formData.skills.map((skill, index) => (
                  <li key={index}>
                    {skill}{" "}
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeSkill(index)}
                    >
                      <FaTrash /> 
                    </button>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Job description */}
            <div className="form-group">
              <label>
                Job Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </label>
            </div>

            {/* Website URL */}
            <div className="form-group">
              <label>
                Company Website URL:
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* Submit and reset buttons */}
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                Post Job
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PostJob;
