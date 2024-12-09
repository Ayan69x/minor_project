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
import {
  viewAllEmployees,
  deleteEmployee,
} from "../../redux/slice/employeeSlice";
import styles from "../../style/employeeList.module.css";
import { fetchOrganizationById } from "../../redux/slice/oraganizationSlice";
import getUserRoleFromToken from "../../components/Role";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const orgId = localStorage.getItem("orgId");
  const [role, setRole] = useState(null);

  const { employees, loading, error } = useSelector((state) => state.employee);
  // const { org } = useSelector((state) => state.organization);
  const userId = localStorage.getItem("userId");
  console.log(employees);

  useEffect(() => {
    if (token) {
      dispatch(viewAllEmployees());
      // dispatch(fetchOrganizationById(orgId));
      const userRole = getUserRoleFromToken(token);
      setRole(userRole.toLowerCase()); // Ensure consistent lowercase role comparison
    }
  }, [dispatch, token]);

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteEmployee(id)).unwrap();
      await dispatch(viewAllEmployees());
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

  const filteredEmployees = employees?.filter((employee) => 
    employee?.user?.organizationId === orgId && employee?.user?._id === userId
  );
  
  return (
    <div className={styles.employeeListContainer}>
      <div className={styles.employeeListHeader}>
        <h2>My Employee Details</h2>
</div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message ? error.message : JSON.stringify(error)}</p>
      ) : (
        <Table className={styles.employeeTable}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees?.map((employee) => {
              return (
                <TableRow key={employee?.user?._id}>
                  <TableCell>
                    {" "}
                    {employee?.userProfile?.firstName}{" "}
                    {employee?.userProfile?.lastName}
                  </TableCell>
                  <TableCell>{employee?.user?.username}</TableCell>
                  <TableCell>{employee?.user?.email}</TableCell>
                  <TableCell>{employee?.userProfile?.contactNumber}</TableCell>
                  <TableCell>
                    {employee?.userProfile?.dob
                      ? new Date(employee.userProfile.dob)
                          .toISOString()
                          .slice(0, 10)
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    {roleMap[employee?.user?.roleId?._id] || "Unknown"}
                  </TableCell>
                  <TableCell className={styles.actionButtons}>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/employee/${employee?.user?._id}`)}
                    >
                      View
                    </Button>

                    <Button
                      className={styles.editButton}
                      variant="contained"
                      onClick={() =>
                        navigate(`/employees/edit/${employee?.user?._id}`)
                      }
                    >
                      Edit
                    </Button>

                    {(role === "super_admin") && (
                      <Button
                        className={styles.deleteButton}
                        variant="contained"
                        onClick={() => handleDelete(employee?.user?._id)}
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

export default Profile;
