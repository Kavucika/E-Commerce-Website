import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css"; // Optional: if you have styles here

const Profile = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Guest";
  const email = localStorage.getItem("email") || "guest@example.com";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Profile</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#f5f5f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 80px)",
  },
  card: {
    backgroundColor: "#1f1f1f",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    width: "300px",
    textAlign: "center",
  },
  title: {
    color: "#ff3f6c",
    marginBottom: "20px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    backgroundColor: "#ff3f6c",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Profile;
