import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthStyles.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check where the user came from (for protected route redirection)
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // 👈 Store the username

      if (data.email) {
        localStorage.setItem('email', data.email); // Optional: If API returns email
      }

      navigate(from, { replace: true });
      } else {
        alert('Invalid login credentials');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

   return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login to Tint</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}

export default Login;