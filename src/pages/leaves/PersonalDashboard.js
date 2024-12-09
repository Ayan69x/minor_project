import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/AttendanceCalendar.module.css";
import { viewLeaves } from "../../redux/slice/leaveSlice";
import { useDispatch, useSelector } from "react-redux";
import { viewLeaveAllocations } from "../../redux/slice/leaveAllocationSlice";

function PersonalDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orgId = localStorage.getItem("orgId");
  const userId = localStorage.getItem("userId");

  // Fetch leave data from the Redux store
  const { leaves, loading, error } = useSelector((state) => state.leaves);
  const { leaveAllocations } = useSelector((state) => state.leaveAllocations);
  const allocatedLeaves = leaveAllocations.find((allocation)=> allocation?.employeeId?._id === userId);
  console.log(allocatedLeaves);

  useEffect(() => {
    dispatch(viewLeaves());
    dispatch(viewLeaveAllocations())
  }, [dispatch]);

  // Filter leaves based on organization ID
  const orgLeaves = leaves?.info?.filter(
    (leave) => leave?.employeeId?.organizationId === orgId
  ) || [];

  // Helper function to filter leaves by type and status
  const filterLeavesByType = (leaveTypeId, status = null) => {
    return orgLeaves.filter((leave) => {
      return (
        (!leaveTypeId || leave.leaveTypeId === leaveTypeId) &&
        (!status || leave.status === status) &&
        leave.employeeId?._id === userId
      );
    }).length;
  };

  // Leave counts for the current user or all users (depending on role)
  const leaveCount = orgLeaves.length;
  const approvedLeavesForUser = filterLeavesByType(null, "approved");
  const rejectedLeavesForUser = filterLeavesByType(null, "rejected");

  const sickLeavesForUser = filterLeavesByType("670f99e8349cfd4a62453a24");
  const casualLeavesForUser = filterLeavesByType("670f99e8349cfd4a62453a25");
  const maternityLeavesForUser = filterLeavesByType("670f99e8349cfd4a62453a26");

  // Render different stats based on the user's role
  const renderLeaveStats = () => {
    return (
      <>
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <h3 style={{ color: "purple" }}>Sick Leaves</h3>
            {/* <p style={{ color: "purple" }}>{sickLeavesForUser}</p> */}
            {
            (allocatedLeaves?.leaveTypeId?._id === "670f99e8349cfd4a62453a24") ? <>
            <p style={{ color: "purple" }}>Allocated Leaves : {allocatedLeaves?.allocatedLeaves}</p>
            <p style={{ color: "purple" }}>Used Leaves : {allocatedLeaves?.usedLeaves}</p>
            <p style={{ color: "purple" }}>Leave Balance : {allocatedLeaves?.allocatedLeaves - allocatedLeaves?.usedLeaves}</p>
            </>:0
          }
          </div>
          <div className={styles.statBox}>
            <h3 style={{ color: "#a52a2a" }}>Casual Leaves</h3>
            {/* <p style={{ color: "#a52a2a" }}>{casualLeavesForUser}</p> */}
            {
            (allocatedLeaves?.leaveTypeId?._id === "670f9a01349cfd4a62453a25") ? <>
            <p style={{ color: "purple" }}>Allocated Leaves : {allocatedLeaves?.allocatedLeaves}</p>
            <p style={{ color: "purple" }}>Used Leaves : {allocatedLeaves?.usedLeaves}</p>
            <p style={{ color: "purple" }}>Leave Balance : {allocatedLeaves?.allocatedLeaves - allocatedLeaves?.usedLeaves}</p>
            </>:0
          }
          </div>
          <div className={styles.statBox}>
            <h3 style={{ color: "darkblue" }}>Maternity Leaves</h3>
            {/* <p style={{ color: "darkblue" }}>{maternityLeavesForUser}</p> */}
            {
            (allocatedLeaves?.leaveTypeId?._id === "670f9a26349cfd4a62453a26") ? <>
            <p style={{ color: "purple" }}>Allocated Leaves : {allocatedLeaves?.allocatedLeaves}</p>
            <p style={{ color: "purple" }}>Used Leaves : {allocatedLeaves?.usedLeaves}</p>
            <p style={{ color: "purple" }}>Leave Balance : {allocatedLeaves?.allocatedLeaves - allocatedLeaves?.usedLeaves}</p>
            </>:0
          }
          </div>
        </div>

        <div className={styles.statsContainer}>
          {/*
            <div className={styles.statBox}>
              <h3 style={{ color: "blue" }}>Applied Leaves</h3>
              <p style={{ color: "blue" }}>{leaveCount}</p>
            </div>
           */}
          <div className={styles.statBox}>
            <h3 style={{ color: "green" }}>Approved Leaves</h3>
            <p style={{ color: "green" }}>{approvedLeavesForUser}</p>
          </div>
          <div className={styles.statBox}>
            <h3 style={{ color: "red" }}>Rejected Leaves</h3>
            <p style={{ color: "red" }}>{rejectedLeavesForUser}</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Attendance Overview</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching leave data: {error}</p>
      ) : (
        <>
          {renderLeaveStats()}
        </>
      )}
    </div>
  );
}

export default PersonalDashboard;
