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
import { viewLeaveAllocations } from "../../redux/slice/leaveAllocationSlice";

function PersonalAllocation() {
  const dispatch = useDispatch();

  const { leaveAllocations , loading, error} = useSelector((state) => state.leaveAllocations);
  

  const userId = localStorage.getItem("userId");

  // Dispatch actions to fetch leaves and employees
  useEffect(() => {
    dispatch(viewLeaveAllocations())
  }, [dispatch]);

  const filteredLeaves = leaveAllocations?.filter((allocation) => allocation?.employeeId?._id === userId
  );
  

  const leaveTypes = {
    "670f99e8349cfd4a62453a24": "Sick Leave",
    "670f9a01349cfd4a62453a25": "Casual Leave",
    "670f99e8349cfd4a62453a26": "Maternity Leave",
  };

  const roleMap = {
    "66f3c1b417fffaca198292fb": "Admin",
    "66f3c1dd17fffaca198292fd": "HR",
    "66f3c24717fffaca198292ff": "Employee",
    "66fc2768612d40e0436be865": "Super Admin",
  };

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.header}>Leave History</h2>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Table className={styles.leaveTable}>
          <TableHead>
            <TableRow>
            <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Allocated Leaves</TableCell>
              <TableCell>Used Leaves</TableCell>
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
              filteredLeaves.map((allocation) => {
                return (
                    <TableRow key={allocation?.employeeId?._id}>
                    <TableCell>{allocation?.employeeId?.username}</TableCell>
                    <TableCell>{allocation?.employeeId?.email}</TableCell>
                    <TableCell>
                      {roleMap[allocation?.employeeId?.roleId] || "Unknown"}
                    </TableCell>
                    <TableCell>{leaveTypes[allocation?.leaveTypeId?._id] || "Unknown"}</TableCell>
                    <TableCell>{allocation.allocatedLeaves}</TableCell>
                    <TableCell>{allocation.usedLeaves}</TableCell>
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

export default PersonalAllocation;
