import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AuthSuccessPage() {
  const navigate = useNavigate();

useEffect(() => {
  const handleAuth = async () => {
    try {
      const params = new URLSearchParams(window.location.search);

      const token = params.get('token');

      if (!token) {
        navigate('/login');
        return;
      }

      sessionStorage.setItem('token', token);

      const res = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      sessionStorage.setItem(
        'user',
        JSON.stringify(res.data.user)
      );

      console.log("Stored User:", res.data.user);

      navigate('/');
    } catch (error) {
      console.error(error);
      navigate('/login');
    }
  };

  handleAuth();
}, [navigate]);

  return <p>Signing in...</p>;
}