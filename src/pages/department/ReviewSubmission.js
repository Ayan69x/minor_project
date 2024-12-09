import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button, MenuItem } from "@mui/material";
import * as Yup from "yup";
import styles from "../../style/LeaveApplicationForm.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSubmissionsForDocumentRequest } from "../../redux/slice/documentSubmissionSlice";
import { reviewSubmission } from "../../redux/slice/documentRequestSlice";

const ReviewSubmission = () => {
  const { id } = useParams(); // Get document submission ID from URL parameters
  const { submissions, loading, error } = useSelector(
    (state) => state.documentRequest
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    status: Yup.string()
      .oneOf(["approved", "rejected"], "Invalid status")
      .required("Status is required"),
    feedback: Yup.string()
  });

  const handleSubmit = async (values) => {
    const reviewData = {
      status: values.status,
      feedback: values.feedback
    };

    try {
      await dispatch(reviewSubmission({ id, reviewData })).unwrap();
      navigate("/requested-documents"); // Redirect after review
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Formik
      initialValues={{
        status: "", // Set initial empty values for status and feedback
        feedback: ""
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ errors, touched }) => (
        <Form className={styles.leaveForm}>
          {/* Status Field */}
          <Field
            as={TextField}
            select
            name="status"
            label="Status"
            fullWidth
            error={touched.status && Boolean(errors.status)}
            helperText={touched.status && errors.status}
            className={styles.inputField}
          >
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Field>

          {/* Feedback Field */}
          <Field
            as={TextField}
            name="feedback"
            label="Feedback"
            fullWidth
            multiline
            rows={4}
            className={styles.inputField}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            Submit Review
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ReviewSubmission;
