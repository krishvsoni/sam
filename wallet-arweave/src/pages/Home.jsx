import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LampDemo } from '../components/Lamp';
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
     <Navbar/>
      <LampDemo/>
    </>
  );
};

export default Home;
