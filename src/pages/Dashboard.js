import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import './Dashboard.css';

function Dashboard() {
  const [certs, setCerts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);


  useEffect(() => {
    const fetchUserAndCerts = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      const id = data.user.id;
      setUserId(id);
      fetchCerts(id);
    };
    fetchUserAndCerts();
  }, []);

  const fetchCerts = async (id) => {
    const { data, error } = await supabase.storage.from('certificates').list(id + '/', {
      limit: 100,
    });
    if (!error) setCerts(data);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    setUploading(true);
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('certificates').upload(filePath, file);
    if (!error) fetchCerts(userId);
    else alert(error.message);
    setUploading(false);
  };

  const handleDelete = async (fileName) => {
    const filePath = `${userId}/${fileName}`;
    const { error } = await supabase.storage.from('certificates').remove([filePath]);
    if (!error) fetchCerts(userId);
    else alert('Error deleting file: ' + error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      alert("Logged out");
      window.location.href = "/login";
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-bg">
        <div className="dashboard-layout">
          <div className="upload-section">
            <h2>📤 Upload Your Certificates</h2>
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading || !userId}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <button className="preview-button" onClick={() => navigate('/preview')}>
              🔍 Preview Certificates
            </button>
          </div>
          
          <div className="certs-section">
            <h3>📄 Uploaded Certificates</h3>
            <ul>
              {certs.length === 0 && <p className="no-certs">No certificates yet.</p>}
              {certs.map(file => (
                <li key={file.name} className="cert-item">
                  <a
                    href={`https://tbnoplsxldmollqtkgsn.supabase.co/storage/v1/object/public/certificates/${userId}/${file.name}`}
                    target="_blank"
                    rel="noreferrer"
                    title={file.name}
                  >
                    {file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name}
                  </a>
                  <button className="delete-button" onClick={() => handleDelete(file.name)}>
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
            <button className="logout-button" onClick={handleLogout}>
              🔓 Logout
            </button>
          </div>
        </div>
      </div>
      
    </>
  );
}

export default Dashboard;
  
