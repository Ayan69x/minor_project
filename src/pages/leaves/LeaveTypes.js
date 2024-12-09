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
import { fetchLeaveTypes, deleteLeaveType } from "../../redux/slice/leaveTypeSlice";
import styles from "../../style/employeeList.module.css";

const LeaveTypes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const { leaveTypes, loading, error } = useSelector((state) => state.leaveTypes);

  useEffect(() => {
    if (token) {
      dispatch(fetchLeaveTypes());
    }
  }, [dispatch, token]);

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteLeaveType(id)).unwrap();
      await dispatch(fetchLeaveTypes());
      console.log("Leave type deleted successfully:", res);
    } catch (error) {
      console.error("Error while deleting leave type:", error.message || error);
    }
  };

  return (
    <div className={styles.employeeListContainer}>
      <div className={styles.employeeListHeader}>
        <h2>Leave Types</h2>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className={styles.addEmployeeButton}
            onClick={() => navigate("/add-leave-type")}
          >
            Add Leave Type
          </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message ? error.message : JSON.stringify(error)}</p>
      ) : (
        <Table className={styles.employeeTable}>
          <TableHead>
            <TableRow>
            <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Accrual Policy</TableCell>
              <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveTypes?.map((leaveType) => {
              return (
                <TableRow key={leaveType._id}>
                    <TableCell>{leaveType._id}</TableCell>
                  <TableCell>{leaveType.name}</TableCell>
                  <TableCell>{leaveType.accuralPolicy} {leaveType.accrualPolicy}</TableCell>
                  <TableCell>{leaveType.description}</TableCell>
                    <TableCell className={styles.actionButtons}>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/edit-leave-type/${leaveType._id}`)}
                      >
                        Edit
                      </Button>

                      <Button
                        className={styles.deleteButton}
                        variant="contained"
                        onClick={() => handleDelete(leaveType._id)}
                      >
                        Delete
                      </Button>
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

export default LeaveTypes;
