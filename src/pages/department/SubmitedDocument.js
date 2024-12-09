import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../style/employeeList.module.css";
import {
  deleteSubmission,
  getEmployeeSubmissions,
  getSubmissionsForDocumentRequest,
} from "../../redux/slice/documentSubmissionSlice";
import getUserRoleFromToken from "../../components/Role";

const SubmitedDocument = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const orgId = localStorage.getItem("orgId");
  const userId = localStorage.getItem("userId");
  const role = getUserRoleFromToken(token);

  const { submissions, employeeSubmissions, loading, error } = useSelector(
    (state) => state.documentSubmission
  );

  useEffect(() => {
    if (token) {
      if (role === "employee") {
        dispatch(getEmployeeSubmissions());
      } else if (["super_admin", "admin", "hr"].includes(role)) {
        dispatch(getSubmissionsForDocumentRequest(id));
      }
    }
  }, [dispatch, token, role, id]);

  const handleDelete = async (sid) => {
    try {
      await dispatch(deleteSubmission(sid)).unwrap();
      await dispatch(getSubmissionsForDocumentRequest(id));
    } catch (error) {
      console.error("Error while deleting submission:", error.message || error);
    }
  };

  const roleMap = {
    "66f3c1b417fffaca198292fb": "Admin",
    "66f3c1dd17fffaca198292fd": "HR",
    "66f3c24717fffaca198292ff": "Employee",
    "66fc2768612d40e0436be865": "Super Admin",
  };

  const filteredSubmissions =
    role === "employee" ? employeeSubmissions : submissions;

  return (
    <div className={styles.employeeListContainer}>
      <div className={styles.employeeListHeader}>
        <h2>Document Request</h2>
        <Button
          variant="contained"
          color="primary"
          className={styles.addEmployeeButton}
          onClick={() => navigate("/upload-document")}
        >
          Upload Document
        </Button>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading...</div>
      ) : error ? (
        <p className={styles.error}>
          Error: {error.message ? error.message : JSON.stringify(error)}
        </p>
      ) : (
        <Table className={styles.employeeTable}>
          <TableHead>
            <TableRow>
              {(role === "super_admin" ||
                role === "admin" ||
                role === "hr") && (
                <>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </>
              )}
              {role === "employee" && (
                <>
                  <TableCell>SubmittedBy</TableCell>
                  <TableCell>Feedback</TableCell>
                </>
              )}
              <TableCell>Status</TableCell>
              <TableCell>File Path</TableCell>
              {(role === "super_admin" ||
                role === "admin" ||
                role === "hr") && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubmissions.map((submission) => {
              if (
                submission?.submittedBy?.organizationId === orgId ||
                submission?.submittedBy === userId
              ) {
                return (
                  <TableRow key={submission._id}>
                    {(role === "super_admin" ||
                      role === "admin" ||
                      role === "hr") && (
                      <>
                        {" "}
                        <TableCell>
                          {submission?.submittedBy?.username}
                        </TableCell>
                        <TableCell>{submission?.submittedBy?.email}</TableCell>
                        <TableCell>
                          {roleMap[submission?.submittedBy?.roleId] ||
                            "Unknown"}
                        </TableCell>
                      </>
                    )}
                    {role === "employee" && (
                      <>
                        <TableCell>{submission?.submittedBy}</TableCell>
                        <TableCell>{submission?.feedback}</TableCell>
                      </>
                    )}
                    <TableCell>{submission?.status}</TableCell>
                    <TableCell>{submission?.filePath}</TableCell>
                    {(role === "super_admin" ||
                      role === "admin" ||
                      role === "hr") && (
                      <TableCell className={styles.actionButtons}>
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(`/review-documents/${submission._id}`)
                          }
                        >
                          Review
                        </Button>
                        <Button
                          className={styles.deleteButton}
                          variant="contained"
                          onClick={() => handleDelete(submission._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SubmitedDocument;
