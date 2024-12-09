import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../style/employeeDetails.module.css'; // Import the CSS module
import { viewEmployee } from '../../redux/slice/employeeSlice';

const EmployeesDetail = () => {
  const { id } = useParams(); // Get the employee id from the URL params
  // console.log(id);
  
  
  const dispatch = useDispatch();

  const { employees, loading, error } = useSelector((state) => state.employee);
 
  

  useEffect(() => {
    dispatch(viewEmployee(id));
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message ? error.message : error}</div>;
  }

  if (!employees) {
    return <div>Employee not found</div>;
  }

  if (!employees || employees.length === 0) {
    return <div>No employees found.</div>;
  }
  
  const employeeView = employees.find((emp) => emp?.user?._id === id);
  
  if (!employeeView) {
    return <div>Employee not found</div>;
  }
  
  // console.log('employeeView',employeeView);

  return (
    <div className={styles.employeesDetailContainer}>
      <h2 className={styles.employeesDetailHeader}>{employeeView?.userProfile?.firstName}'s Details</h2>
      
      {/* User Details */}
      <h3>User Information</h3>
      <p className={styles.employeesDetailInfo}><strong>User ID:</strong> {employeeView?.user?._id}</p>
      <p className={styles.employeesDetailInfo}><strong>Username:</strong> {employeeView?.user?.username}</p>
      <p className={styles.employeesDetailInfo}><strong>Email:</strong> {employeeView?.user?.email}</p>
      {/* <p className={styles.employeesDetailInfo}><strong>Password:</strong> {employeeView?.user?.password}</p> */}
      <p className={styles.employeesDetailInfo}><strong>Role ID:</strong> {employeeView?.user?.roleId?._id}</p>
      <p className={styles.employeesDetailInfo}><strong>Organization ID:</strong> {employeeView?.user?.organizationId}</p>
      <p className={styles.employeesDetailInfo}><strong>Status:</strong> {employeeView?.user?.status}</p>
      <p className={styles.employeesDetailInfo}><strong>Created At:</strong> {new Date(employeeView?.user?.createdAt).toLocaleString()}</p>
      <p className={styles.employeesDetailInfo}><strong>Updated At:</strong> {new Date(employeeView?.user?.updatedAt).toLocaleString()}</p>
      
      {/* User Profile Details */}
      <h3>User Profile Information</h3>
      <p className={styles.employeesDetailInfo}><strong>Profile ID:</strong> {employeeView?.userProfile?._id}</p>
      <p className={styles.employeesDetailInfo}><strong>User ID:</strong> {employeeView?.userProfile?.userId}</p>
      <p className={styles.employeesDetailInfo}><strong>First Name:</strong> {employeeView?.userProfile?.firstName}</p>
      <p className={styles.employeesDetailInfo}><strong>Last Name:</strong> {employeeView?.userProfile?.lastName}</p>
      <p className={styles.employeesDetailInfo}><strong>Date of Birth:</strong> {new Date(employeeView?.userProfile?.dob).toLocaleDateString()}</p>
      <p className={styles.employeesDetailInfo}><strong>Contact Number:</strong> {employeeView?.userProfile?.contactNumber}</p>
      <p className={styles.employeesDetailInfo}><strong>Profile Created At:</strong> {new Date(employeeView?.userProfile?.createdAt).toLocaleString()}</p>
      <p className={styles.employeesDetailInfo}><strong>Profile Updated At:</strong> {new Date(employeeView?.userProfile?.updatedAt).toLocaleString()}</p>
    </div>
  );
};

export default EmployeesDetail;
