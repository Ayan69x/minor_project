import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button, MenuItem } from "@mui/material";
import * as Yup from "yup";
import styles from "../../style/LeaveApplicationForm.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import getUserRoleFromToken from "../../components/Role";
import {
  createLeaveType,
  fetchLeaveTypeById,
  fetchLeaveTypes,
  updateLeaveType,
} from "../../redux/slice/leaveTypeSlice";

const AddEditLeaveType = () => {
  const { id } = useParams(); // Get leave type ID from URL parameters
  const { leaveTypes, loading, error } = useSelector(
    (state) => state.leaveTypes
  );
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    accrualPolicy: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchLeaveTypeById(id)).then((res) => {
        const leaveTypeData = res.payload;
        if (leaveTypeData) {
          setInitialValues({
            name: leaveTypeData?.name || "",
            description: leaveTypeData?.description || "",
            accrualPolicy: leaveTypeData?.accrualPolicy || "",
          });
        }
      });
    } else {
      // If creating a new leave type, fetch the existing leave types
      dispatch(fetchLeaveTypes());
    }
  }, [dispatch, id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Leave Type Name is required"),
    description: Yup.string().required("Description is required"),
    accrualPolicy: Yup.string()
      .required("Accrual Policy is required")
  });

  const handleSubmit = async (values) => {
    const leaveTypeData = {
      name: values.name,
      description: values.description,
      accrualPolicy: values.accrualPolicy,
    };

    try {
      if (id) {
        // Update leave type
        await dispatch(updateLeaveType({  id, leaveTypeData })).unwrap();
      } else {
        // Create new leave type
        await dispatch(createLeaveType(leaveTypeData)).unwrap();
      }
      navigate("/leave-types");
      await dispatch(fetchLeaveTypes());
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ errors, touched }) => (
        <Form className={styles.leaveForm}>
          {/* Leave Type Name */}
          <Field
            as={TextField}
            name="name"
            label="Leave Type Name"
            fullWidth
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
            className={styles.inputField}
          />

          {/* Description */}
          <Field
            as={TextField}
            name="description"
            label="Description"
            fullWidth
            error={touched.description && Boolean(errors.description)}
            helperText={touched.description && errors.description}
            className={styles.inputField}
          />

          {/* Accrual Policy */}
          <Field
            as={TextField}
            name="accrualPolicy"
            label="Accrual Policy"
            fullWidth
            error={touched.accrualPolicy && Boolean(errors.accrualPolicy)}
            helperText={touched.accrualPolicy && errors.accrualPolicy}
            className={styles.inputField}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            {id ? "Update Leave Type" : "Create Leave Type"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddEditLeaveType;
