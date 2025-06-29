import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-popup">
        <h2>Login to <span className="highlight">CredHex</span></h2>
        <input type="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

export default Login;
