import React, { useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../style/LeaveHistory.module.css";
import { viewLeaves } from "../../redux/slice/leaveSlice";
import { viewAllEmployees } from "../../redux/slice/employeeSlice";
import { useNavigate } from "react-router-dom";

function PersonalLeave() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");

  // Fetch leave and employee data from the Redux store
  const { leaves, loading, error } = useSelector((state) => state.leaves);
  const { employees } = useSelector((state) => state.employee);

  const userId = localStorage.getItem("userId");

  // Dispatch actions to fetch leaves and employees
  useEffect(() => {
    dispatch(viewLeaves());
    dispatch(viewAllEmployees());
  }, [dispatch]);

  // Map leave type IDs to readable names
  const leaveTypes = {
    "670f99e8349cfd4a62453a24": "Sick Leave",
    "670f99e8349cfd4a62453a25": "Casual Leave",
    "670f99e8349cfd4a62453a26": "Maternity Leave",
  };

  // Filter leave requests for the logged-in user
  const filteredLeaves = (leaves?.info || []).filter(
    (leave) => leave?.employeeId?._id === userId
  );

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.header}>Leave History</h2>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Table className={styles.leaveTable}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Manager Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No leave records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaves.map((leave) => {
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
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default PersonalLeave;
