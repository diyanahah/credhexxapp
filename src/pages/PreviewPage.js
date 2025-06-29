 // src/pages/PreviewPage.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import './PreviewPage.css';

function PreviewPage() {
  const [certs, setCerts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const id = data.user.id;
        setUserId(id);
        fetchCerts(id);
      }
    };
    load();
  }, []);

  const fetchCerts = async (id) => {
    const { data } = await supabase.storage.from('certificates').list(id + '/', {
      limit: 100,
    });
    if (data) setCerts(data);
  };

  return (
    <>
      <Navbar />
      <div className="preview-page">
        <h2>🖼️ Preview Certificates</h2>
        <div className="cert-preview-grid">
          {certs.length === 0 && <p>No certificates uploaded yet.</p>}
          {certs.map(cert => {
            const url = `https://tbnoplsxldmollqtkgsn.supabase.co/storage/v1/object/public/certificates/${userId}/${cert.name}`;
            const isImage = /\.(jpg|jpeg|png)$/i.test(cert.name);
            return (
              <div key={cert.name} className="cert-card">
                {isImage ? (
                  <img src={url} alt={cert.name} />
                ) : (
                  <a href={url} target="_blank" rel="noreferrer">
                    📄 {cert.name}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default PreviewPage;
