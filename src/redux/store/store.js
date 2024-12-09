// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';
import jobSlice from '../slice/jobSlice';
import employeeSlice from '../slice/employeeSlice';
import organizationReducer from '../slice/oraganizationSlice';
import userProfileReducer from '../slice/userProfileSlice';
import SigninReducer from '../slice/signinSlice';
import leaveReducer from '../slice/leaveSlice';
import leaveTypeReducer from '../slice/leaveTypeSlice';
import leaveAllocationReducer from '../slice/leaveAllocationSlice'
import documentRequestReducer from '../slice/documentRequestSlice'
import documentSubmissionReducer from '../slice/documentSubmissionSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    job : jobSlice,
    employee : employeeSlice,
    organization: organizationReducer,
    profile: userProfileReducer,
    auth: SigninReducer,
    leaves: leaveReducer,
    leaveTypes : leaveTypeReducer,
    leaveAllocations : leaveAllocationReducer,
    documentRequest : documentRequestReducer,
    documentSubmission : documentSubmissionReducer
  },
});

export default store;
