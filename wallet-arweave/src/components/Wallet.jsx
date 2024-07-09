import { useEffect } from 'react';
import { ConnectButton } from 'arweave-wallet-kit';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const walletStrategy = localStorage.getItem('wallet_kit_strategy_id');
    if (!walletStrategy ) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <div>
        <ConnectButton
          accent="rgb(0, 174, 255, 1 )"
          profileModal={false}
          showBalance={true}
        />
      </div>
    </div>
  );
};

export default Wallet;
