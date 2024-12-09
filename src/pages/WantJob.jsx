import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteJob, fetchJobs, updateJob } from "../redux/slice/jobSlice";
import { toast } from "react-toastify";
import "../style/WantJob.css";
import getUserRoleFromToken from "../components/Role";

const WantJob = () => {
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      // Prevent an infinite loop of reloads
      // console.log("Page was already reloaded.");
      return;
    }

    // Otherwise, trigger a one-time page reload when the page is first loaded
    window.location.reload();
  }, [token]);

  const [selectedJob, setSelectedJob] = useState(null); // State to track the selected job
  const [isEditing, setIsEditing] = useState(false); // State to track if the user is editing
  const { list } = useSelector((state) => state.user);
  // Helper function to decode JWT token

  const role = token ? getUserRoleFromToken(token) : null; // Decode and get the role

  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.job.jobs || []);

  // Fetch jobs when the component mounts

  useEffect(() => {
    if (!jobData.length) {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobData.length, token]);

  const handleJobClick = (job) => {
    setSelectedJob(job); // Set the clicked job as the selected job
    setIsEditing(false); // Exit editing mode if a new job is clicked
  };

  const handleDelete = async (jobId) => {
    try {
      await dispatch(deleteJob(jobId)).unwrap();
      toast.success("Job deleted successfully!");
      setSelectedJob(null); // Clear the selected job after deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting job", error);
      toast.error("Failed to delete the job.");
    }
  };

  const handleUpdate = () => {
    setIsEditing(true); // Enter editing mode
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    try {
      const formData = new FormData();
      formData.append("title", selectedJob.title);
      formData.append("companyName", selectedJob.companyName);
      formData.append("salaryRange", selectedJob.salaryRange);
      formData.append("location.city", selectedJob.location.city);
      formData.append("location.country", selectedJob.location.country);
      formData.append("jobType", selectedJob.jobType);
      formData.append("description", selectedJob.description);
      formData.append("experienceLevel", selectedJob.experienceLevel);
      formData.append("contactEmail", selectedJob.contactEmail);
      formData.append("websiteUrl", selectedJob.websiteUrl);

      await dispatch(updateJob({ id: selectedJob._id, formData })).unwrap();
      toast.success("Job updated successfully!");
      setIsEditing(false); // Exit editing mode
      window.location.reload();
    } catch (error) {
      console.error("Error updating job", error);
      toast.error("Failed to update the job.");
    }
  };

  return (
    <>
      <div style={{ height: "40px" }}></div>
      <section id="jobs" className="section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>JOBS</h2>
            <p>
              Be part of a project developer team that values precision,
              creativity, and teamwork, driving forward with passion to deliver
              successful and cutting-edge projects.
            </p>
          </div>
          <div className="job-page-container">
            {/* Left side: Job list */}
            <div className="job-list-container">
              <div className="job-list" data-aos="zoom-in" data-aos-delay="100">
                {jobData.length > 0 ? (
                  jobData.map((job) => (
                    <div
                      key={job._id}
                      className={`job-card ${
                        selectedJob?._id === job._id ? "active" : ""
                      }`}
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="job-card-header">
                        <div className="job-title">{job.title}</div>
                        <div className="company-logo">
                          <img
                            src={
                              job.companyLogo
                                ? job.companyLogo
                                : "assets/images/no-image.png"
                            }
                            alt={job.companyName || "Company Logo"}
                          />
                        </div>
                      </div>
                      <div className="job-card-info">
                        <div className="job-criteria">
                          <div className="criteria-item">
                            <span className="criteria-icon">💼</span>
                            <span className="criteria-value">
                              {job.experienceLevel || "N/A"}
                            </span>
                          </div>
                          <div className="criteria-item">
                            <span className="criteria-icon">₹</span>
                            <span className="criteria-value">
                              {job.salaryRange || "Not disclosed"}
                            </span>
                          </div>
                          <div className="criteria-item">
                            <span className="criteria-icon">📍</span>
                            <span className="criteria-value">
                              {job.location?.city || "Unknown"},{" "}
                              {job.location?.country || "Unknown"}
                            </span>
                          </div>
                          <div className="criteria-item">
                            <span className="criteria-icon">👥</span>
                            <span className="criteria-value">
                              {job.vacancies || "N/A"} Vacancies
                            </span>
                          </div>
                        </div>
                        <div className="job-description">
                          <span className="description-text">
                            {job.description?.substring(0, 100) ||
                              "No description available"}
                          </span>
                        </div>
                        {/* <div className="job-skills">
                          {job.skills && job.skills.length > 0 ? (
                            job.skills.map((skill, index) => (
                              <button key={index} className="job-skill-item">
                                <span>{skill}</span>
                              </button>
                            ))
                          ) : (
                            <span className="skills-text">
                              No skills listed
                            </span>
                          )}
                        </div> */}
                      </div>
                      <div className="job-card-footer"></div>
                    </div>
                  ))
                ) : (
                  <p>No jobs available.</p>
                )}
              </div>
            </div>

            {/* Right side: Job details */}
            <div
              className={`job-details-container ${selectedJob ? "active" : ""}`}
            >
              {selectedJob ? (
                <div className="job-details-panel">
                  {isEditing ? (
                    <form onSubmit={handleSubmitUpdate}>
                      <h2>Edit Job</h2>
                      <label>
                        Title:
                        <input
                          type="text"
                          value={selectedJob.title}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              title: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Company Name:
                        <input
                          type="text"
                          value={selectedJob.companyName}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              companyName: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        City:
                        <input
                          type="text"
                          value={selectedJob.location.city}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob.location,
                              city: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Country:
                        <input
                          type="text"
                          value={selectedJob.location.country}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob.location,
                              country: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Salary Range:
                        <input
                          type="text"
                          value={selectedJob.salaryRange}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              salaryRange: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Job Type:
                        <input
                          type="text"
                          value={selectedJob.jobType}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              jobType: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Description:
                        <input
                          type="text"
                          value={selectedJob.description}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              description: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Contact Email:
                        <input
                          type="text"
                          value={selectedJob.contactEmail}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              contactEmail: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Job Type:
                        <input
                          type="text"
                          value={selectedJob.jobType}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              jobType: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Website:
                        <input
                          type="text"
                          value={selectedJob.websiteUrl}
                          onChange={(e) =>
                            setSelectedJob({
                              ...selectedJob,
                              websiteUrl: e.target.value,
                            })
                          }
                        />
                      </label>
                      {/* Add other fields in a similar manner */}
                      <button type="submit" className="btn btn-success">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h2>{selectedJob.title}</h2>
                      <p>
                        <strong>Company:</strong> {selectedJob.companyName}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedJob.location?.city},{" "}
                        {selectedJob.location?.country}
                      </p>
                      <p>
                        <strong>Salary Range:</strong> {selectedJob.salaryRange}
                      </p>
                      <p>
                        <strong>Job Type:</strong> {selectedJob.jobType}
                      </p>
                      <p>
                        <strong>Description:</strong> {selectedJob.description}
                      </p>
                      {/* <p>
                    <strong>Responsibilities:</strong>{" "}
                    {selectedJob.responsibilities?.join(", ")}
                  </p>
                  <p>
                    <strong>Skills:</strong> {selectedJob.skills?.join(", ")}
                  </p> */}
                      <p>
                        <strong>Experience Level:</strong>{" "}
                        {selectedJob.experienceLevel}
                      </p>
                      {/* <p>
                    <strong>Vacancies:</strong> {selectedJob.vacancies}
                  </p> */}
                      <p>
                        <strong>Contact Email:</strong>{" "}
                        {selectedJob.contactEmail}
                      </p>
                      <p>
                        <strong>Website:</strong>
                        <a
                          href={selectedJob.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedJob.websiteUrl}
                        </a>
                      </p>
                      <div className="job-actions">
                        <button
                          className="btn btn-primary"
                          onClick={handleUpdate}
                          disabled={role !== "admin" || "super_admin"} // Disable if user is not an admin
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(selectedJob._id)}
                          disabled={role !== "admin" || "super_admin"} // Disable if user is not an admin
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="no-job-selected">
                  <p>Please select a job to view the details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WantJob;
