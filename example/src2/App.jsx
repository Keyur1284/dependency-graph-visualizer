import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'; 
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { EmailVerification } from "./pages/EmailVerification";
import { ResetPassword } from "./pages/ResetPassword";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProjectDashboard } from "./pages/ProjectDashboard";
import { Expense } from "./pages/Expense";
import { AddExpense } from "./pages/AddExpense";
import { Project } from "./pages/Project";
import { AddProject } from "./pages/AddProject";
import { EditProject } from "./pages/EditProject";
import { EditExpense } from "./pages/EditExpense";
import { Er401 } from "./pages/Er401";
import { Er403 } from "./pages/Er403";
import { Er404 } from "./pages/Er404";
import { useSelector } from "react-redux";
import { MyProfile} from './pages/MyProfile'
import { EditProfile } from "./pages/EditProfile";
import { ExpenseDetails } from "./pages/ExpenseDetails";
import { Analytics } from "./pages/Analytics";
import { EmployeeSearch } from "./pages/EmployeeSearch";
import { Announcement } from "./pages/Announcement";
import { TeamMembers } from "./pages/TeamMembers";
import { Invitations } from "./pages/Invitations";
import { AboutUs } from "./pages/B/AboutUs";
import { NotificationEmployee } from "./pages/NotificationEmployee";
import { NotificationManager } from "./pages/NotificationManager";
import { atom } from "atoms";
// import app from "../../server/server";
// import root from "../../aalekh-main/src/Root";
// import app2 from "../../back-end-main/src/server";
// import app3 from "../../front-end-company-main/src/App";
// import app4 from "../../front-end-student-main/src/App";
// import app5 from "../../frontend-admin-main/src/App";
// import app6 from "../../WanderWiz-main/Code/backend/src/index";
// import app7 from "../../WanderWiz-main/Code/frontend/src/App";

import { a } from "./a.web";

// import React, { useEffect, useRef } from 'react';
// import { DataSet, DataView, Network } from 'vis-network/standalone/esm/vis-network';
// import graph from '../../graph.json';

function App() {
  
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        {user ? (
          user?.role == "employee" ? (
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/projects/:projectId/dashboard" element={<ProjectDashboard />} />
                <Route path="/projects/:projectId/add-expense" element={<AddExpense />} />
                <Route path="/projects/:projectId/expenses" element={<Expense />} />
                <Route path="/projects/:projectId/expenses/:expenseId/edit-expense" element={<EditExpense />} />
                <Route path="/projects" element={<Project />} />
                <Route path="/add-project" element={<Er403 />} />
                <Route path='/employee-search' element={<Er403 />} />
                <Route path='/profile' element={<MyProfile />} />
                <Route path='/edit-profile' element={<EditProfile />} />
                <Route path='/invites' element={<Invitations />} />
                <Route path='/projects/:projectId/expenses/:expenseId' element={<ExpenseDetails />} />
                <Route path='/projects/:projectId/analytics' element={<Er403 />} />
                <Route path='/projects/:projectId/announcements' element={<Announcement />} />
                <Route path='/projects/:projectId/team-members' element={<TeamMembers />} />
                <Route path='/notifications' element={<NotificationEmployee/>} />
                <Route path='*' element={<Er404 />} />
              </Routes>
            </>
          ) : (
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/projects/:projectId/dashboard" element={<ProjectDashboard />} />
                <Route path="/projects/:projectId/add-expense" element={<Er403 />} />
                <Route path="/projects/:projectId/expenses" element={<Expense />} />
                <Route path="/projects" element={<Project />} />
                <Route path="/add-project" element={<AddProject />} />
                <Route path="/projects/:projectId/edit-project" element={<EditProject />} />
                <Route path='/profile' element={<MyProfile />} />
                <Route path='/edit-profile' element={<EditProfile />} />
                <Route path='/projects/:projectId/invite-employee' element={<EmployeeSearch />} />
                <Route path='/projects/:projectId/expenses/:expenseId' element={<ExpenseDetails />} />
                <Route path='/projects/:projectId/analytics' element={<Analytics />} />
                <Route path='/projects/:projectId/announcements' element={<Announcement />} />
                <Route path='/projects/:projectId/team-members' element={<TeamMembers />} />
                <Route path='/notifications' element={<NotificationManager/>} />
                <Route path='*' element={<Er404 />} />
              </Routes>
            </>
          )
        ) : (
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email/:verifyId" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:resetId" element={<ResetPassword />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="*" element={<Er401 />} />
            </Routes>
          </>
        )}
        
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );

  // const containerRef = useRef(null);

  // useEffect(() => {
    
  //     const nodes = [], edges = [];

  //     graph.nodes.forEach(node => {

  //         const index = node.filename.lastIndexOf('/');
  //         const label = node.filename.split('/').pop(), dirPath = node.filename.substring(0, index);
          
  //         // Hash the "dirPath" and assign color based on it
  //         const color = dirPath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  //         const colorString = `hsl(${color}, 100%, 80%)`;

  //         nodes.push({ id: node.id, label: label, color: colorString});
          
  //         node.dependencies.forEach(dep => {
  //             edges.push({ from: node.id, to: graph.map[dep] });
  //         });
  //     });

  //       const data = {
  //           nodes: nodes,
  //           edges: edges,
  //       };

  //     const options = {
  //       layout: {
  //           randomSeed: undefined,
  //           improvedLayout:true,
  //           clusterThreshold: 150,
  //           hierarchical: {
  //             enabled:true,
  //             levelSeparation: 40,
  //             nodeSpacing: 4000,
  //             treeSpacing: 200,
  //             blockShifting: true,
  //             edgeMinimization: true,
  //             parentCentralization: true,
  //             direction: 'UD',        // UD, DU, LR, RL
  //             sortMethod: 'hubsize',  // hubsize, directed
  //             shakeTowards: 'leaves'  // roots, leaves
  //           }
  //         },
  //           edges: {
  //               arrows: {
  //                   to: {
  //                       enabled: true,
  //                       scaleFactor: 0.5,
  //                   },
  //               },
  //           },
  //       };

  //    const network = new Network(containerRef.current, data, options);
  // }
  // , []);

  //   return <div style={{height: "1000px", width: "auto"}} ref={containerRef}></div>;
}

export default App;

// export {a};