import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom'; 
import { addUser } from '../../redux/slice/userSlice'; // Import addUser action
import '../../style/Signup.css'; 
import axios from 'axios';

const SignUp = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    // roleId: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    // roleId: Yup.string().required('Role ID is required'),
  });

  const onSubmit = async (values) => {
    try {
    //   const checkUserResponse = await axios.post('/api/auth/checkUser', { email: values.email });
    //   if (checkUserResponse.data.exists) {
    //     alert('User already exists! Redirecting to login.');
    //     navigate('/login'); 
    //   } else {
        // Use dispatch to call addUser
        const userData = {
          username: values.username,
          email: values.email,
          password: values.password,
          roleId: "66f3c24717fffaca198292ff",
        };
        const response = await dispatch(addUser(userData)).unwrap();
        console.log('User registered successfully', response);
        navigate('/organization-setup'); 
      }
    /* } */ catch (error) {
      console.error('Error registering user', error.response?.data || error.message);
      alert('Error registering user. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <div className="form-group">
            <label>Username</label> 
            <Field type="text" name="username" className="form-control" />
            <ErrorMessage name="username" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <Field type="email" name="email" className="form-control" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <Field type="password" name="password" className="form-control" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <Field type="password" name="confirmPassword" className="form-control" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />
          </div>
{/* 
          <div className="form-group">
            <label>Role ID</label>
            <Field type="text" name="roleId" className="form-control" />
            <ErrorMessage name="roleId" component="div" className="error" />
          </div> */}
          

          <button type="submit" className="submit-button">Sign Up</button>
        </Form>
      </Formik>
      <div className="login-link">
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default SignUp;
