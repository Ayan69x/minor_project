import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import "./App.css";
import About from "./pages/About";
import Home from "./pages/Home";
import PostJob from "./pages/PostJob";
import WantJob from "./pages/WantJob";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Services from "./pages/Services";
import Team from "./pages/Team";
import PrivacyPolicy from "./cms/PrivacyPolicy";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import PrivateRoute from "./routes/PrivateRoute"; // Import PrivateRoute
import EmployeeList from "./pages/employee/EmployeeList";
import AddEditEmployee from "./pages/employee/AddEditEmployee";
import EmployeeDetail from "./pages/employee/EmployeeDetail";
import DepartmentList from "./pages/department/DocumentUpload";
import AttendanceCalendar from "./pages/leaves/AttendanceCalendar";
import LeaveApplicationForm from "./pages/leaves/LeaveApplicationForm";
import LeaveHistory from "./pages/leaves/LeaveHistory";
import OrganizationSetup from "./pages/organization/OrganizationSetup";
import UserProfileSetup from "./pages/organization/UserProfileSetup";
import OrgSignUp from "./pages/organization/Sign_up";
import PersonalLeave from "./pages/leaves/PersonalLeave";
import PersonalDashboard from "./pages/leaves/PersonalDashboard";
import Profile from "./pages/employee/Profile";
import LeaveTypes from "./pages/leaves/LeaveTypes";
import LeaveAllocation from "./pages/leaves/LeaveAllocation";
import AddEditLeaveAllocates from "./pages/leaves/AddEditLeaveAllocates";
import LeaveAllocationDetails from "./pages/leaves/LeaveAllocationDetails";
import AddEditLeaveType from "./pages/leaves/AddEditLeaveType";
import PersonalAllocation from "./pages/leaves/PersonalAllocation";
import RequestDocuments from "./pages/department/RequestDocuments";
import AddEditDocument from "./pages/department/AddEditDocument";
import SubmitedDocument from "./pages/department/SubmitedDocument";
import ReviewSubmission from "./pages/department/ReviewSubmission";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orgsignup" element={<OrgSignUp />} />
          <Route path="/organization-setup" element={<OrganizationSetup />} />
          <Route path="/user-profile-setup" element={<UserProfileSetup />} />

          {/* Private Routes */}
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/wantjob"
            element={
              <PrivateRoute>
                <WantJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/services"
            element={
              <PrivateRoute>
                <Services />
              </PrivateRoute>
            }
          />
          <Route
            path="/team"
            element={
              <PrivateRoute>
                <Team />
              </PrivateRoute>
            }
          />
          <Route
            path="/postjob"
            element={
              <PrivateRoute>
                <PostJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/privacypolicy"
            element={
              <PrivateRoute>
                <PrivacyPolicy />
              </PrivateRoute>
            }
          />
          <Route
            path="/emplist"
            element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/addemp"
            element={
              <PrivateRoute>
                <AddEditEmployee />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/edit/:id"
            element={
              <PrivateRoute>
                <AddEditEmployee />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/:id"
            element={
              <PrivateRoute>
                <EmployeeDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/document-upload"
            element={
              <PrivateRoute>
                <DepartmentList />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload-document/:id"
            element={
              <PrivateRoute>
                <DepartmentList />
              </PrivateRoute>
            }
          />

          <Route
            path="/attendance-calendar"
            element={
              <PrivateRoute>
                <AttendanceCalendar />
              </PrivateRoute>
            }
          />

          {/* Route for Leave Application */}
          <Route
            path="/leave-application"
            element={
              <PrivateRoute>
                <LeaveApplicationForm />
              </PrivateRoute>
            }
          />

          {/* Route for Leave History */}
          <Route
            path="/leave-history"
            element={
              <PrivateRoute>
                <LeaveHistory />
              </PrivateRoute>
            }
          />

          <Route
            path="/personal-leave"
            element={
              <PrivateRoute>
                <PersonalLeave />
              </PrivateRoute>
            }
          />

          <Route
            path="/personal-dashboard"
            element={
              <PrivateRoute>
                <PersonalDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/personal-profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/leave-types"
            element={
              <PrivateRoute>
                <LeaveTypes />
              </PrivateRoute>
            }
          />

          <Route
            path="/leave-allocation"
            element={
              <PrivateRoute>
                <LeaveAllocation />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-leave-allocation"
            element={
              <PrivateRoute>
                <AddEditLeaveAllocates />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-leave-allocation/:id"
            element={
              <PrivateRoute>
                <AddEditLeaveAllocates />
              </PrivateRoute>
            }
          />

          <Route
            path="/leave-allocation-details/:id"
            element={
              <PrivateRoute>
                <LeaveAllocationDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-leave-type"
            element={
              <PrivateRoute>
                <AddEditLeaveType />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-leave-type/:id"
            element={
              <PrivateRoute>
                <AddEditLeaveType />
              </PrivateRoute>
            }
          />

          <Route
            path="/personal-leave-allocation"
            element={
              <PrivateRoute>
                <PersonalAllocation />
              </PrivateRoute>
            }
          />

          <Route
            path="/requested-documents"
            element={
              <PrivateRoute>
                <RequestDocuments />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-requested-documents"
            element={
              <PrivateRoute>
                <AddEditDocument />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-requested-documents/:id"
            element={
              <PrivateRoute>
                <AddEditDocument />
              </PrivateRoute>
            }
          />

<Route
            path="/submited-documents"
            element={
              <PrivateRoute>
                <SubmitedDocument />
              </PrivateRoute>
            }
          />

          <Route
            path="/submited-documents/:id"
            element={
              <PrivateRoute>
                <SubmitedDocument />
              </PrivateRoute>
            }
          />

          <Route
            path="/review-documents/:id"
            element={
              <PrivateRoute>
                <ReviewSubmission />
              </PrivateRoute>
            }
          />

          {/* Redirect to Home if no match */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
