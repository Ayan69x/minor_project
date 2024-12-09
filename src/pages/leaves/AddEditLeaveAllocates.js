import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button, MenuItem } from "@mui/material";
import * as Yup from "yup";
import styles from "../../style/LeaveApplicationForm.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import getUserRoleFromToken from "../../components/Role";
import {
  createLeaveAllocation,
  updateLeaveAllocation,
  viewLeaveAllocationByEmployee,
  viewLeaveAllocations,
} from "../../redux/slice/leaveAllocationSlice";

const AddEditLeaveAllocates = () => {
  const { id } = useParams(); // Get allocationId from URL parameters
  const { leaveAllocations, loading } = useSelector((state) => state.leaveAllocations); // Assuming allocation is stored in Redux
  const userId = localStorage.getItem("userId");
  const [initialValues, setInitialValues] = useState({
    employeeId:userId,      
    leaveType: "",
    allocatedLeaves: "",
  });
  console.log('allocationId',id);

  const leaveTypes = [
    { id: "670f99e8349cfd4a62453a24", name: "Sick Leave" },
    { id: "670f9a01349cfd4a62453a25", name: "Casual Leave" },
    { id: "670f9a26349cfd4a62453a26", name: "Maternity Leave" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = token ? getUserRoleFromToken(token) : null;

  useEffect(() => {
    console.log(leaveAllocations);
    if (id && leaveAllocations && leaveAllocations.length > 0) {
      const empId = leaveAllocations.find((empId) => empId?._id === id);

  
      if (empId) {
        dispatch(viewLeaveAllocationByEmployee(empId?.employeeId?._id)).then((res) => {
          const allocationData = res.payload;
          console.log('allocationData', allocationData);
  
          if (allocationData) {
            setInitialValues({
              employeeId: allocationData[0]?.employeeId || null, // Assuming this is the correct path
              leaveType: allocationData[0]?.leaveTypeId?._id || null,
              allocatedLeaves: allocationData[0]?.allocatedLeaves || null,
            });
          }
        });
      }
    }
  }, [dispatch, id, leaveAllocations]);
  
  

  const validationSchema = Yup.object().shape({
    employeeId: Yup.string().required("Employee ID is required"),
    leaveType: Yup.string().required("Leave Type is required"),
    allocatedLeaves: Yup.number()
      .required("Allocated Leaves is required")
      .min(1, "Allocated leaves must be at least 1"),
  });

  const handleSubmit = async (values) => {
    const allocationData = {
      employeeId: values.employeeId,
      leaveTypeId: values.leaveType,
      allocatedLeaves: values.allocatedLeaves,
    };

    try {
        console.log("id",id);
      if (id) {
        // Update existing allocation
        await dispatch(updateLeaveAllocation({ allocationId: id, updatedData: allocationData })).unwrap();
      } else {
        // Create new allocation
        await dispatch(createLeaveAllocation(allocationData)).unwrap();
      }
      navigate("/leave-allocation");
      dispatch(viewLeaveAllocations())
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Formik
      initialValues={initialValues}
      enableReinitialize // Important for setting initial values when editing
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ errors, touched }) => (
        <Form className={styles.leaveForm}>
          {/* Employee ID */}
            <Field
              as={TextField}
              name="employeeId"
              label="Employee ID"
              fullWidth
              error={touched.employeeId && Boolean(errors.employeeId)}
              helperText={touched.employeeId && errors.employeeId}
              className={styles.inputField}
            //   disabled={!!id} 
            />
          

          {/* Leave Type */}
   {/* Leave Type */}
   <Field
            as={TextField}
            select
            name="leaveType"
            label="Leave Type"
            fullWidth
            error={touched.leaveType && Boolean(errors.leaveType)}
            helperText={touched.leaveType && errors.leaveType}
            className={styles.inputField}
          >
            {leaveTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Field>


          {/* Allocated Leaves */}
          <Field
            as={TextField}
            name="allocatedLeaves"
            label="Allocated Leaves"
            fullWidth
            error={touched.allocatedLeaves && Boolean(errors.allocatedLeaves)}
            helperText={touched.allocatedLeaves && errors.allocatedLeaves}
            className={styles.inputField}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            {id ? "Update Allocation" : "Submit"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddEditLeaveAllocates;
