import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AuthSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AUTH SUCCESS PAGE LOADED");

    const params = new URLSearchParams(window.location.search);

    console.log("Full URL:", window.location.href);

    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');

    console.log("Token:", token);
    console.log("Name:", name);
    console.log("Email:", email);

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

    console.log(
      "Stored User: ",
      sessionStorage.getItem('user')
    );

    navigate('/');
  }, []);

  return <p>Signing in...</p>;
}