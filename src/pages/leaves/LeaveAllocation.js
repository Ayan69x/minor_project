import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../style/employeeList.module.css";
import getUserRoleFromToken from "../../components/Role";
import { deleteLeaveAllocation, viewLeaveAllocations } from "../../redux/slice/leaveAllocationSlice";

const LeaveAllocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const orgId = localStorage.getItem("orgId");
  const [role, setRole] = useState(null);

  // const { employees, loading, error } = useSelector((state) => state.employee);
  const { leaveAllocations , loading, error } = useSelector((state) => state.leaveAllocations);
  // const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token) {
      dispatch(viewLeaveAllocations());
      // dispatch(viewAllEmployees());
      const userRole = getUserRoleFromToken(token);
      setRole(userRole.toLowerCase()); // Ensure consistent lowercase role comparison
    }
  }, [dispatch, token]);

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteLeaveAllocation(id)).unwrap();
      await dispatch(viewLeaveAllocations());
      console.log("Employee deleted successfully:", res);
    } catch (error) {
      console.error("Error while deleting employee:", error.message || error);
    }
  };

  const roleMap = {
    "66f3c1b417fffaca198292fb": "Admin",
    "66f3c1dd17fffaca198292fd": "HR",
    "66f3c24717fffaca198292ff": "Employee",
    "66fc2768612d40e0436be865": "Super Admin",
  };

  // Helper function to retrieve employee's role
  const getEmployeeRole = (employeeId) => {
    const allocation = leaveAllocations.find(
      (allocation) => allocation?.employeeId?._id === employeeId
    );
    return allocation?.employeeId?.roleId || null;
  };

  // Filtering employees based on user role
  const filteredEmployees = leaveAllocations?.filter((allocation) => {
    const employeeRole = getEmployeeRole(allocation?.employeeId?._id);

    if (role === "super_admin") {
      return (
        allocation?.employeeId?.organizationId === orgId &&
        (employeeRole === "66f3c1b417fffaca198292fb" ||
          employeeRole === "66f3c1dd17fffaca198292fd" ||
          employeeRole === "66f3c24717fffaca198292ff")
      );
    }

    if (role === "admin") {
      return (
        allocation?.employeeId?.organizationId === orgId &&
        (employeeRole === "66f3c1dd17fffaca198292fd" || // HR
          employeeRole === "66f3c24717fffaca198292ff") // Employee
      );
    }

    if (role === "hr") {
      return (
        allocation?.employeeId?.organizationId === orgId &&
        employeeRole === "66f3c24717fffaca198292ff"
      );
    }

    if (role === "employee") {
      return (
        allocation?.employeeId?.organizationId === orgId &&
        allocation?.employeeId?._id
      );
    }

    return false;
  });

  return (
    <div className={styles.employeeListContainer}>
      <div className={styles.employeeListHeader}>
        <h2>Leave Allocation</h2>

        {(role === "super_admin" || role === "admin" || role === "hr") && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className={styles.addEmployeeButton}
            onClick={() => navigate("/add-leave-allocation")}
          >
            Add Leave Allocation
          </Button>
        )}
        {( role === "admin" || role === "hr") && (
          <Button
            variant="contained"
            color="secondary"
            className={styles.addEmployeeButton}
            onClick={() => navigate("/personal-leave-allocation")}
          >
            My Leave Allocation
          </Button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message ? error.message : JSON.stringify(error)}</p>
      ) : (
        <Table className={styles.employeeTable}>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Allocated Leaves</TableCell>
              <TableCell>Used Leaves</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees?.map((allocation) => {
              return (
                <TableRow key={allocation?.employeeId?._id}>
                  <TableCell>{allocation?.employeeId?.username}</TableCell>
                  <TableCell>{allocation?.employeeId?.email}</TableCell>
                  <TableCell>
                    {roleMap[allocation?.employeeId?.roleId] || "Unknown"}
                  </TableCell>
                  <TableCell>{allocation?.leaveTypeId?.name}</TableCell>
                  <TableCell>{allocation.allocatedLeaves}</TableCell>
                  <TableCell>{allocation.usedLeaves}</TableCell>

                  <TableCell className={styles.actionButtons}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(`/leave-allocation-details/${allocation?.employeeId?._id}`)
                      }
                    >
                      View
                    </Button>

                    <Button
                      className={styles.editButton}
                      variant="contained"
                      onClick={() =>
                        navigate(
                          `/edit-leave-allocation/${allocation?._id}`
                        )
                      }
                    >
                      Edit
                    </Button>

                    {(role === "super_admin" ||
                      role === "admin" ||
                      role === "hr") && (
                      <Button
                        className={styles.deleteButton}
                        variant="contained"
                        onClick={() =>
                          handleDelete(allocation?._id)
                        }
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LeaveAllocation;
