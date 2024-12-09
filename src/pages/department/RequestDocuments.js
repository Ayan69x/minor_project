import React, { useEffect } from "react";
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
import {
  deleteDocumentRequest,
  getAllDocumentRequests,
  getEmployeeDocumentRequests,
} from "../../redux/slice/documentRequestSlice";
import getUserRoleFromToken from "../../components/Role";
import { getEmployeeSubmissions } from "../../redux/slice/documentSubmissionSlice";

const RequestDocuments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const orgId = localStorage.getItem("orgId");
  const role = getUserRoleFromToken(token);

  const { requests, loading, error } = useSelector(
    (state) => state.documentRequest
  );
  const { employeeSubmissions } = useSelector(
    (state) => state.documentSubmission
  );

  // console.log("employeeSubmissions", employeeSubmissions);

  useEffect(() => {
    if (["super_admin", "admin", "hr"].includes(role)) {
      dispatch(getAllDocumentRequests());
    } else if (role === "employee") {
      dispatch(getEmployeeDocumentRequests());
      dispatch(getEmployeeSubmissions());
    }
  }, [dispatch, role]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDocumentRequest(id)).unwrap();
      dispatch(getAllDocumentRequests());
    } catch (error) {
      console.error("Error while deleting leave type:", error.message || error);
    }
  };

  const roleMap = {
    "66f3c1b417fffaca198292fb": "Admin",
    "66f3c1dd17fffaca198292fd": "HR",
    "66f3c24717fffaca198292ff": "Employee",
    "66fc2768612d40e0436be865": "Super Admin",
  };

  const isAuthorizedToAdd = ["super_admin", "admin", "hr"].includes(role);

  const filterRequest = isAuthorizedToAdd
    ? requests.filter((request) =>
        request?.employees.some((employee) => employee.organizationId === orgId)
      )
    : requests?.requests || [];

  // console.log(filterRequest);

  return (
    <div className={styles.employeeListContainer}>
      <div className={styles.employeeListHeader}>
        <h2>Document Request</h2>
        {isAuthorizedToAdd && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className={styles.addEmployeeButton}
            onClick={() => navigate("/add-requested-documents")}
          >
            Add Document Request
          </Button>
        )}
        {role === "employee" && (
          <Button
            variant="contained"
            color="primary"
            className={styles.addEmployeeButton}
            onClick={() => navigate("/submited-documents")}
          >
            Submitted Document
          </Button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message || JSON.stringify(error)}</p>
      ) : (
        <Table className={styles.employeeTable}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Max Size</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Feedback</TableCell>
              {isAuthorizedToAdd && <TableCell>Employees</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filterRequest.length > 0 &&
    filterRequest.map((request) => {
      // Check if there is a matching submission for the request
      const submission = employeeSubmissions.find(
        (submit) => submit?.documentRequestId?._id === request?._id && role === "employee"
      );

      return (
        <TableRow key={request._id}>
          <TableCell>{request.title}</TableCell>
          <TableCell>{request.description}</TableCell>
          <TableCell>{request.format}</TableCell>
          <TableCell>{request.maxSize} MB</TableCell>
          <TableCell>
            {new Date(request.dueDate).toLocaleDateString()}
          </TableCell>
          {/* Display submission status and feedback if available, else default request status */}
          <TableCell>{submission ? submission.status : request.status}</TableCell>
          {<TableCell>{submission?.feedback? submission?.feedback : ""}</TableCell>}

          {isAuthorizedToAdd && (
            <TableCell>
              {request?.employees?.map((employee, index) => {
                if (employee.organizationId === orgId) {
                  return (
                    <div
                      key={employee._id}
                      className={styles.employeeInfo}
                    >
                      <span>
                        {employee.username} ({employee.email}) -{" "}
                        {roleMap[employee.roleId] || "Unknown"}
                      </span>
                      {index < request.employees.length - 1 && (
                        <hr className={styles.employeeDivider} />
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </TableCell>
          )}

          <TableCell className={styles.actionButtons}>
            {role === "employee" ? (
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/upload-document/${request._id}`)
                }
                disabled={
                  submission && submission.status === "approved"
                }
              >
                Upload
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  className={styles.editButton}
                  onClick={() =>
                    navigate(`/edit-requested-documents/${request._id}`)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(request._id)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(`/submited-documents/${request._id}`)
                  }
                >
                  Submissions
                </Button>
              </>
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

export default RequestDocuments;
