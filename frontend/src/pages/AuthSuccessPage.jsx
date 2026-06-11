import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(
      window.location.search
    ).get('token');

    if (token) {
      sessionStorage.setItem('token', token);
      navigate('/');
    }
  }, []);

  return <p>Signing in...</p>;
}