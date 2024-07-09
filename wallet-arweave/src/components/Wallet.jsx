import { ConnectButton } from 'arweave-wallet-kit'

const Wallet = () => {
  return (
    <div>
      <div>
            <ConnectButton
                accent="rgb(0, 174, 255, 1 )"
                profileModal={false}
                showBalance={true}/>
        </div>
    </div>
  )
}

export default Wallet
