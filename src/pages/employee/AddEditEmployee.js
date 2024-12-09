import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, editEmployee, viewEmployee } from '../../redux/slice/employeeSlice'; // Adjust path as needed
import { useParams, useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from '../../style/addEditEmployee.module.css';
import getUserRoleFromToken from '../../components/Role';

const AddEmployeeForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // To detect if we are editing an existing employee
  const navigate = useNavigate(); // For navigation after successful submission
  const { employees, error, loading } = useSelector((state) => state.employee); // Assuming employee slice contains single employee data
  const {org}  = useSelector((state)=> state.organization);
  const orgId =  localStorage.getItem("orgId");
  const token = localStorage.getItem("authToken");
  const role = token ? getUserRoleFromToken(token) : null;
  console.log("orgId",orgId);
  // console.log(org);
  
  const roles = [
    { label: 'Admin', value: '66f3c1b417fffaca198292fb' },
    { label: 'HR', value: '66f3c1dd17fffaca198292fd' },
    { label: 'Employee', value: '66f3c24717fffaca198292ff' },
  ];

  const [employeeData, setEmployeeData] = useState({
    username: '',
    email: '',
    phone: '',
    roleId: '',
    firstName: '',
    lastName: '',
    dob: '',
    contactNumber: '',
    password: 'employee@123',
    organizationId: orgId
  });

  useEffect(() => {
    if (id) {
      // Fetch employee details if we are editing an existing employee
      dispatch(viewEmployee(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (employees && id) {
      // Ensure that the employee data exists before attempting to populate the form
      const editEmpDetails = employees.find((emp) => emp.user._id === id);
      
      if (editEmpDetails) {
        setEmployeeData({
          username: editEmpDetails.user?.username || '',
          email: editEmpDetails.user?.email || '',
          phone: editEmpDetails.userProfile?.contactNumber || '',
          roleId: editEmpDetails.user?.roleId || '',
          firstName: editEmpDetails.userProfile?.firstName || '',
          lastName: editEmpDetails.userProfile?.lastName || '',
          dob: editEmpDetails.userProfile?.dob?.split('T')[0] || '',
          contactNumber: editEmpDetails.userProfile?.contactNumber || '',
          password: employeeData.password || '', 
          organizationId: orgId
        });
      }
    }
  }, [employees, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      // Edit Mode - Dispatch editEmployee with employee ID and updated data
      dispatch(editEmployee({ id, updatedData: employeeData })).then(() => {
        navigate('/emplist'); // Redirect to the employee list after successful edit
        window.location.reload();
      });
    } else {
      // Add Mode - Dispatch addEmployee with new employee data
      dispatch(addEmployee(employeeData)).then(() => {
        navigate('/emplist'); // Redirect to the employee list after successful addition
        window.location.reload();
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.employeeFormContainer}>
      <div className={styles.employeeFormCard}>
        <h2 className={styles.formTitle}>{id ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="username" 
            placeholder="Username" 
            value={employeeData.username} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={employeeData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="phone" 
            type="tel" 
            placeholder="Phone" 
            value={employeeData.phone} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="firstName" 
            placeholder="First Name" 
            value={employeeData.firstName} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="lastName" 
            placeholder="Last Name" 
            value={employeeData.lastName} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="dob" 
            type="date" 
            placeholder="Date of Birth" 
            value={employeeData.dob} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="contactNumber" 
            type="tel" 
            placeholder="Contact Number" 
            value={employeeData.contactNumber} 
            onChange={handleChange} 
            required 
          />
          <select 
            name="roleId" 
            value={employeeData.roleId} 
            onChange={handleChange} 
            disabled={role === "employee"}
            required
          >
            <option value="" disabled>Select Role</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {/* {id && ( */}
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={employeeData.password} 
              onChange={handleChange} 
              // required={!id} 
            />
          {/* )} */}
          {/* {error && <div className={styles.errorMessage}>{error.message || error}</div>} */}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {id ? 'Update Employee' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
