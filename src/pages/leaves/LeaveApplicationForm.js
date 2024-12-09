import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import styles from '../../style/LeaveApplicationForm.module.css';
import { createLeaveRequest } from '../../redux/slice/leaveSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import getUserRoleFromToken from '../../components/Role';

const LeaveApplicationForm = () => {
  const leaveTypes = [
    { id: '670f99e8349cfd4a62453a24', name: 'Sick Leave' },
    { id: '670f99e8349cfd4a62453a25', name: 'Casual Leave' },
    { id: '670f99e8349cfd4a62453a26', name: 'Maternity Leave' }
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const role = token ? getUserRoleFromToken(token) : null;

  // Validation Schema
  const validationSchema = Yup.object().shape({
    employeeId: Yup.string().required('Employee ID is required'),
    leaveType: Yup.string().required('Leave Type is required'),
    fromDate: Yup.date().required('Start Date is required'),
    toDate: Yup.date().required('End Date is required'),
    reason: Yup.string().required('Reason is required'),
    // supportingDocuments: Yup.mixed().nullable().notRequired(),
  });

  const handleSubmit = async (values) => {
    const leaveData = {
            employeeId: values.employeeId,
            leaveTypeId: values.leaveType,
            startDate: values.fromDate,
            endDate: values.toDate,
            reason: values.reason,
            supportingDocuments : null
          };
console.log(leaveData);

    try {
      await dispatch(createLeaveRequest(leaveData)).unwrap();
      navigate('/leave-history');
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        employeeId: userId,
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: '',
        // supportingDocuments: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className={styles.leaveForm}>
          {/* Employee ID */}
          {(role === "super_admin" || role === "admin") && (
          <Field
            as={TextField}
            name="employeeId"
            label="Employee ID"
            fullWidth
            error={touched.employeeId && Boolean(errors.employeeId)}
            helperText={touched.employeeId && errors.employeeId}
            className={styles.inputField}
          />
          )}

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

          {/* Start Date */}
          <Field
            as={TextField}
            name="fromDate"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={touched.fromDate && Boolean(errors.fromDate)}
            helperText={touched.fromDate && errors.fromDate}
            className={styles.inputField}
          />

          {/* End Date */}
          <Field
            as={TextField}
            name="toDate"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={touched.toDate && Boolean(errors.toDate)}
            helperText={touched.toDate && errors.toDate}
            className={styles.inputField}
          />

          {/* Reason */}
          <Field
            as={TextField}
            name="reason"
            label="Reason"
            multiline
            rows={4}
            fullWidth
            error={touched.reason && Boolean(errors.reason)}
            helperText={touched.reason && errors.reason}
            className={styles.inputField}
          />

          {/* Supporting Documents */}
          {/* <label className={styles.fileLabel} htmlFor="supportingDocuments">
            Supporting Documents (optional)
          </label>
          <input
            id="supportingDocuments"
            name="supportingDocuments"
            type="file"
            className={styles.fileInput}
            onChange={(event) => {
              setFieldValue('supportingDocuments', event.currentTarget.files[0]);
            }}
          />
          {errors.supportingDocuments && touched.supportingDocuments && (
            <div className={styles.errorText}>{errors.supportingDocuments}</div>
          )} */}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LeaveApplicationForm  