
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Use same CSS file

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful. Please log in.");
      navigate('/login');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-popup">
        <h2>Create <span className="highlight">Account</span></h2>
        <input type="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <p>Already registered? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default Register;
