import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const walletStrategy = localStorage.getItem('wallet_kit_strategy_id');
    if (walletStrategy === 'arconnect') {
      navigate('/monitor');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">Monitor Analysis Audit</h1>
        <p className="mt-4 text-lg"></p>
      </div>
    </>
  );
};

export default Home;
