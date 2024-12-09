import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../style/employeeDetails.module.css'; // Import the CSS module
import { viewEmployee } from '../../redux/slice/employeeSlice';
import { viewLeaveAllocations } from '../../redux/slice/leaveAllocationSlice';

const LeaveAllocationDetails = () => {
  const { id } = useParams(); // Get the employee id from the URL params
  
  const dispatch = useDispatch();
  
  const { leaveAllocations, loading, error } = useSelector((state) => state.leaveAllocations);
  
  useEffect(() => {
    dispatch(viewLeaveAllocations(id));
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message ? error.message : error}</div>;
  }

  if (!leaveAllocations || leaveAllocations.length === 0) {
    return <div>No leave allocations found.</div>;
  }
  
  const employeeView = leaveAllocations.find((emp) => emp?.employeeId?._id === id);
  
  if (!employeeView) {
    return <div>Employee not found</div>;
  }

  return (
    <div className={styles.employeesDetailContainer}>
      <h2 className={styles.employeesDetailHeader}>{employeeView?.employeeId?.username}'s Details</h2>
      
      {/* User Details */}
      <h3>User Information</h3>
      <p className={styles.employeesDetailInfo}><strong>User ID:</strong> {employeeView?.employeeId?._id}</p>
      <p className={styles.employeesDetailInfo}><strong>Username:</strong> {employeeView?.employeeId?.username}</p>
      <p className={styles.employeesDetailInfo}><strong>Email:</strong> {employeeView?.employeeId?.email}</p>
      <p className={styles.employeesDetailInfo}><strong>Role ID:</strong> {employeeView?.employeeId?.roleId}</p>
      <p className={styles.employeesDetailInfo}><strong>Organization ID:</strong> {employeeView?.employeeId?.organizationId}</p>
      <p className={styles.employeesDetailInfo}><strong>Status:</strong> {employeeView?.employeeId?.status}</p>
      <p className={styles.employeesDetailInfo}><strong>Created At:</strong> {new Date(employeeView?.employeeId?.createdAt).toLocaleString()}</p>
      <p className={styles.employeesDetailInfo}><strong>Updated At:</strong> {new Date(employeeView?.employeeId?.updatedAt).toLocaleString()}</p>
      
      {/* User Profile Details */}
      {/* <h3>User Profile Information</h3> */}
      {/* <p className={styles.employeesDetailInfo}><strong>First Name:</strong> {employeeView?.userProfile?.firstName}</p> */}
      {/* <p className={styles.employeesDetailInfo}><strong>Last Name:</strong> {employeeView?.userProfile?.lastName}</p> */}
      {/* <p className={styles.employeesDetailInfo}><strong>Date of Birth:</strong> {new Date(employeeView?.userProfile?.dob).toLocaleDateString()}</p> */}
      {/* <p className={styles.employeesDetailInfo}><strong>Contact Number:</strong> {employeeView?.userProfile?.contactNumber}</p> */}
      {/* <p className={styles.employeesDetailInfo}><strong>Profile Created At:</strong> {new Date(employeeView?.userProfile?.createdAt).toLocaleString()}</p> */}
      {/* <p className={styles.employeesDetailInfo}><strong>Profile Updated At:</strong> {new Date(employeeView?.userProfile?.updatedAt).toLocaleString()}</p> */}
      
      {/* Leave Allocation Details */}
      <h3>Leave Allocation Information</h3>
      <p className={styles.employeesDetailInfo}><strong>Leave Type:</strong> {employeeView?.leaveTypeId?.name}</p>
      <p className={styles.employeesDetailInfo}><strong>Accrual Policy:</strong> {employeeView?.leaveTypeId?.accuralPolicy}</p>
      <p className={styles.employeesDetailInfo}><strong>Allocated Leaves:</strong> {employeeView?.allocatedLeaves}</p>
      <p className={styles.employeesDetailInfo}><strong>Used Leaves:</strong> {employeeView?.usedLeaves}</p>
    </div>
  );
};

export default LeaveAllocationDetails;
