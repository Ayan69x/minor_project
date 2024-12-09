import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/AttendanceCalendar.module.css";
import { viewLeaves } from "../../redux/slice/leaveSlice";
import { useDispatch, useSelector } from "react-redux";
import getUserRoleFromToken from "../../components/Role";
import { viewAllEmployees } from "../../redux/slice/employeeSlice";
import { viewLeaveAllocations } from "../../redux/slice/leaveAllocationSlice";

const AttendanceCalendar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");
  const role = token ? getUserRoleFromToken(token) : null;
  const orgId = localStorage.getItem("orgId");
  const userId = localStorage.getItem("userId");

  // Fetch leave data from the Redux store
  const { leaves, loading, error } = useSelector((state) => state.leaves);
  const { employees } = useSelector((state) => state.employee);
  const { leaveAllocations } = useSelector((state) => state.leaveAllocations);
  
  
  const allocatedLeaves = leaveAllocations.filter((allocation)=> allocation?.employeeId?._id === userId)
  console.log(allocatedLeaves);

  useEffect(() => {
    dispatch(viewLeaves());
    dispatch(viewAllEmployees());
    dispatch(viewLeaveAllocations())
  }, [dispatch]);

  // Get employee role based on employee ID
  const getEmployeeRole = (employeeId) => {
    const employee = employees.find((emp) => emp?.user?._id === employeeId);
    return employee?.user?.roleId?._id || null;
  };

  // Filter leaves based on role
  const filterLeavesByRole = (leaveTypeId = null, status = null) => {
    return leaves?.info?.filter((leave) => {
      const employeeRole = getEmployeeRole(leave?.employeeId?._id);
      
      // Super Admin: Can see all leaves in the organization
      if (role === "super_admin") {
        return (
          (!leaveTypeId || leave.leaveTypeId === leaveTypeId) &&
          (!status || leave.status === status) &&
          leave?.employeeId?.organizationId === orgId &&
          (employeeRole === "66f3c1b417fffaca198292fb" ||
            employeeRole === "66f3c1dd17fffaca198292fd" ||
            employeeRole === "66f3c24717fffaca198292ff")
        );
      }

      // Admin: Can see HR and Employee leaves
      if (role === "admin") {
        return (
          (!leaveTypeId || leave.leaveTypeId === leaveTypeId) &&
          (!status || leave.status === status) &&
          leave?.employeeId?.organizationId === orgId &&
          (employeeRole === "66f3c1dd17fffaca198292fd" ||
            employeeRole === "66f3c24717fffaca198292ff")
        );
      }

      // HR: Can see only Employee leaves
      if (role === "hr") {
        return (
          (!leaveTypeId || leave.leaveTypeId === leaveTypeId) &&
          (!status || leave.status === status) &&
          leave?.employeeId?.organizationId === orgId &&
          employeeRole === "66f3c24717fffaca198292ff"
        );
      }

      // Employee: Can only see their own leaves
      if (role === "employee") {
        return (
          (!leaveTypeId || leave.leaveTypeId === leaveTypeId) &&
          (!status || leave.status === status) &&
          leave?.employeeId?._id === userId
        );
      }

      return false;
    }) || [];
  };

  // Calculate leave counts based on type and status
  const sickLeaves = filterLeavesByRole("670f99e8349cfd4a62453a24").length;
  const casualLeaves = filterLeavesByRole("670f99e8349cfd4a62453a25").length;
  const maternityLeaves = filterLeavesByRole("670f99e8349cfd4a62453a26").length;
  const approvedLeaves = filterLeavesByRole(null, "approved").length;
  const rejectedLeaves = filterLeavesByRole(null, "rejected").length;
  const totalLeaves = filterLeavesByRole().length;

  // console.log(role);
  

  // Render leave statistics based on the user's role
  const renderLeaveStats = () => {
    return (
      <div>
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <h3 style={{ color: "purple" }}>Sick Leaves</h3>
          {(role === "super_admin" || role === "admin" || role === "hr") &&  <p style={{ color: "purple" }}>{sickLeaves}</p>}
          { allocatedLeaves.map((allocated)=> {
            if (role === "employee" && allocated?.leaveTypeId?._id === "670f99e8349cfd4a62453a24") {
              return  <>
              <p style={{ color: "grey" }}>Allocated Leaves : {allocated?.allocatedLeaves}</p>
              <p style={{ color: "grey" }}>Used Leaves : {allocated?.usedLeaves}</p>
              <p style={{ color: "grey" }}>Leave Balance : {allocated?.allocatedLeaves - allocated?.usedLeaves}</p>
              </>
            }
          })
            
          }
          </div>
          <div className={styles.statBox}>
            <h3 style={{ color: "#a52a2a" }}>Casual Leaves</h3>
            {(role === "super_admin" || role === "admin" || role === "hr") && <p style={{ color: "#a52a2a" }}>{casualLeaves}</p>}
            { allocatedLeaves.map((allocated)=> {
              if (role === "employee" && allocated?.leaveTypeId?._id === "670f9a01349cfd4a62453a25") {
                return  <>
                <p style={{ color: "grey" }}>Allocated Leaves : {allocated?.allocatedLeaves}</p>
                <p style={{ color: "grey" }}>Used Leaves : {allocated?.usedLeaves}</p>
                <p style={{ color: "grey" }}>Leave Balance : {allocated?.allocatedLeaves - allocated?.usedLeaves}</p>
                </>
              }
             })
             
          }
          </div>
          <div className={styles.statBox}>
            <h3 style={{ color: "darkblue" }}>Maternity Leaves</h3>
            {(role === "super_admin" || role === "admin" || role === "hr") && <p style={{ color: "darkblue" }}>{maternityLeaves}</p>}
            { allocatedLeaves.map((allocated)=> {
              if (role === "employee" && allocated?.leaveTypeId?._id === "670f9a26349cfd4a62453a26") {
                return  <>
                <p style={{ color: "grey" }}>Allocated Leaves : {allocated?.allocatedLeaves}</p>
                <p style={{ color: "grey" }}>Used Leaves : {allocated?.usedLeaves}</p>
                <p style={{ color: "grey" }}>Leave Balance : {allocated?.allocatedLeaves - allocated?.usedLeaves}</p>
                </>
              }
             })
          }
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <h3 style={{ color: "blue" }}>Total Leaves</h3>
            <p style={{ color: "blue" }}>{totalLeaves}</p>
          </div>
          <div className={styles.statBox}>
            <h3 style={{ color: "green" }}>Approved Leaves</h3>
        <p style={{ color: "green" }}>{approvedLeaves}</p>
          </div>
          <div className={styles.statBox}>
            <h3 style={{ color: "red" }}>Rejected Leaves</h3>
            <p style={{ color: "red" }}>{rejectedLeaves}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Attendance Overview</h2>
      <div className={styles.buttonContainer}>
      {( role === "super_admin" || role === "admin" || role === "hr") && (
        <button
          className={styles.button}
          onClick={() => navigate("/leave-allocation")}
        >
          Leave Allocation
        </button>
      )}
      {(role === "super_admin") && (
        <button
          className={styles.button}
          onClick={() => navigate("/leave-types")}
        >
          Leave Details
        </button>
      )}
      {( role === "admin" || role === "hr") && (
        <button
          className={styles.button}
          onClick={() => navigate("/personal-dashboard")}
        >
          Personal Dashboard
        </button>
      )}
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Please wait, loading your data...</p>
        </div>
      ) : error ? (
        <p>Error fetching leave data: {error}</p>
      ) : (
        <>
          {renderLeaveStats()}

          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={() => navigate("/leave-application")}
            >
              Apply for Leave
            </button>
            <button
              className={styles.button}
              onClick={() => navigate("/leave-history")}
            >
              View Leave History
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceCalendar;
