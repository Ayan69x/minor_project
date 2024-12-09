import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slice/userSlice';
import '../../style/Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = async (values) => {
    try {
      const response = await dispatch(loginUser(values)).unwrap(); // Use unwrap() to access the resolved value or throw errors
      // If the login is successful, navigate to '/home'
      navigate('/home');
    } catch (error) {
      // Handle any login errors here
      console.error('Error logging in:', error);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <div>
            <label>Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div>
            <label>Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="error">incorrect email and password</p>}

          <button type="submit">Login</button>
        </Form>
      </Formik>

      <div className="signup-prompt">
        <p>New to Job Portal? <Link to="/orgsignup">Create an account</Link></p>
      </div>
    </div>
  );
};

export default Login;
