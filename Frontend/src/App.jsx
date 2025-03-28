import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CreateUser from "./Components/UserRegister/CreateUser";
import ViewUsers from "./Components/ViewUsers/ViewUsers";
import Login from "./Components/LoginPage/Login";
import AddProduct from "./Components/AddProduct/AddProduct";
import AdminProducts from "./Components/AdminProducts/AdminProducts";
import UserProducts from "./Components/UserProduct/UserProducts";
import Dashboard from "./Components/Dashboard/Dashboard";
import Homepage from "./Components/Homepage/Homepage";
import CustomerNavbar from "./Components/CustomerNavbar/CustomerNavbar"; // Import Navbar
import { Outlet } from "react-router-dom";

// Layout Component
const Layout = () => {
  return (
    <div>
      <CustomerNavbar />
      <Outlet /> This is where the page content will be loaded
    </div>
  );
};

const App = () => {
  const isAuthenticated = () => {
    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return false;

      const parsedData = JSON.parse(authData);
      const token = parsedData.token;

      if (!token) return false;

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role === "Admin";
    } catch (error) {
      console.error("Error in isAuthenticated function:", error);
      return false;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateUser />} />

        {/* Customer Routes with Navbar */}
        <Route element={<Layout />}>
          <Route path="/user/products" element={<UserProducts />} />
          <Route path="/home" element={<Homepage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/users"
          element={isAuthenticated() ? <ViewUsers /> : <Navigate to="/login" />}
        />
        <Route path="/createProduct" element={<AddProduct />} />
        <Route path="/admin/products" element={<AdminProducts />} />

        <Route path="/" element={<Login />} /> {/* Default Route */}
      </Routes>
    </Router>
  );
};

export default App;
