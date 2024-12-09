import React, { useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../style/LeaveHistory.module.css";
import {
  viewLeaves,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../../redux/slice/leaveSlice";
import getUserRoleFromToken from "../../components/Role";
import { viewAllEmployees } from "../../redux/slice/employeeSlice";
import { useNavigate } from "react-router-dom";

const LeaveHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");
  const role = token ? getUserRoleFromToken(token) : null;
  const orgId = localStorage.getItem("orgId");

  // Fetch leave and employee data from the Redux store
  const { leaves, loading, error } = useSelector((state) => state.leaves);
  const { employees } = useSelector((state) => state.employee);

  const userId = localStorage.getItem("userId");
  // const empId = employees?.find((emp) => emp?.userProfile?.userId === userId)?.user?._id;

  // Dispatch actions to fetch leaves and employees
  useEffect(() => {
    dispatch(viewLeaves());
    dispatch(viewAllEmployees());
  }, [dispatch]);

  // Function to handle leave approval with manager comments
  const handleApprove = async (leaveId) => {
    const managerComments = prompt("Enter comments for approval:");
    if (!managerComments) return;

    try {
      await dispatch(
        approveLeaveRequest({ leaveId, managerComments })
      ).unwrap();
      await dispatch(viewLeaves());
      alert("Leave request approved successfully.");
    } catch (error) {
      console.error("Error approving leave request:", error);
      window.location.reload();
    }
  };

  // Function to handle leave rejection with manager comments
  const handleReject = async (leaveId) => {
    const managerComments = prompt("Enter comments for rejection:");
    if (!managerComments) return;

    try {
      await dispatch(rejectLeaveRequest({ leaveId, managerComments })).unwrap();
      await dispatch(viewLeaves());
      alert("Leave request rejected successfully.");
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      window.location.reload();
    }
  };

  // Map leave type IDs to readable names
  const leaveTypes = {
    "670f99e8349cfd4a62453a24": "Sick Leave",
    "670f99e8349cfd4a62453a25": "Casual Leave",
    "670f99e8349cfd4a62453a26": "Maternity Leave",
  };

  // Map role IDs to readable names
  const roleMap = {
    "66f3c1b417fffaca198292fb": "Admin",
    "66f3c1dd17fffaca198292fd": "HR",
    "66f3c24717fffaca198292ff": "Employee",
    "66fc2768612d40e0436be865": "Super Admin",
  };

  // Filter leave requests based on role and employee ID
  const getEmployeeRole = (employeeId) => {
    const employee = employees.find((emp) => emp?.user?._id === employeeId);
    return employee?.user?.roleId?._id || null; // Return the role ID or null if not found
  };

  // Filter leave requests based on role and employee ID
  const filteredEmployees = (leaves?.info || []).filter((leave) => {
    const employeeRole = getEmployeeRole(leave?.employeeId?._id);

    // Super Admin: Can see all users
    if (role === "super_admin") {
      return (
        leave?.employeeId?.organizationId === orgId &&
        (employeeRole === "66f3c1b417fffaca198292fb" ||
          employeeRole === "66f3c1dd17fffaca198292fd" ||
          employeeRole === "66f3c24717fffaca198292ff")
      );
    }

    // Admin: Can see HR and Employee data
    if (role === "admin") {
      return (
        leave?.employeeId?.organizationId === orgId &&
        (employeeRole === "66f3c1dd17fffaca198292fd" ||
          employeeRole === "66f3c24717fffaca198292ff")
      );
    }

    // HR: Can see only Employee data
    if (role === "hr") {
      return (
        leave?.employeeId?.organizationId === orgId &&
        employeeRole === "66f3c24717fffaca198292ff"
      );
    }

    // Employee: Can see only their own data
    if (role === "employee") {
      return leave?.employeeId?._id === userId;
    }

    return false;
  });

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.header}>Leave History</h2>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {(role === "admin" || role === "hr") && (
  <div className={styles.buttonContainer}>
    <Button
      variant="contained"
      className={styles.dashboardButton}
      onClick={() => navigate("/personal-leave")}
    >
      Personal Leave History
    </Button>
  </div>
)}

      {!loading && !error && (
        <Table className={styles.leaveTable}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Manager Comments</TableCell>
              {(role === "super_admin" ||
                role === "admin" ||
                role === "hr") && <TableCell>Approve</TableCell>}
              {(role === "super_admin" ||
                role === "admin" ||
                role === "hr") && <TableCell>Reject</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No leave records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((leave) => {
                if (leave?.employeeId?.organizationId === orgId) {
                  const employee = employees.find(
                    (emp) => emp?.user?._id === leave.employeeId._id
                  );
                  return (
                    <TableRow key={leave._id}>
                      <TableCell>
                        {employee?.userProfile?.firstName}{" "}
                        {employee?.userProfile?.lastName}
                      </TableCell>
                      <TableCell>{employee?.user?.email}</TableCell>
                      <TableCell>
                        {roleMap[employee?.user?.roleId?._id] || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {new Date(leave.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(leave.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {leaveTypes[leave.leaveTypeId] || "Unknown"}
                      </TableCell>
                      <TableCell>{leave.status}</TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
                        {leave.managerComments || "Still Pending"}
                      </TableCell>
                      {(role === "super_admin" ||
                        role === "admin" ||
                        role === "hr") && (
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleApprove(leave._id)}
                            disabled={
                              leave && leave.status !== "pending"
                            }
                          >
                            Approve
                          </Button>
                        </TableCell>
                      )}
                      {(role === "super_admin" ||
                        role === "admin" ||
                        role === "hr") && (
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(leave._id)}
                            disabled={
                              leave && leave.status !== "pending"
                            }
                          >
                            Reject
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                }
                return null;
              })
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LeaveHistory;
