import { useState, useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'Sopproo';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  'https://c.tenor.com/hgj5jJzYhIwAAAAd/modcheck.gif',
  'https://c.tenor.com/bCWhbbjF8dwAAAAM/poggers-pepe.gif',
  'https://c.tenor.com/HrfZSnO19zYAAAAi/jojo-dance.gif',
  'https://c.tenor.com/RMZBNNK3u90AAAAC/poggers-pepe.gif',
  'https://c.tenor.com/z0zQqT5iujUAAAAi/pepe-pls.gif',
  'https://c.tenor.com/OmkN64qYnMkAAAAM/pepe-the-frog-trippy.gif'
]

const App = () => {
  const [hasSolana, setSolana] = useState(false);
  const [currAccount, setCurrentAccount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [gifs, setGifs] = useState([]);

  // Determine user account
  const checkWalletConnection = async () => {
    try {
      const { solana } = window;

      if (!solana) {
        console.log("Solana wallet not detected");
        return;
      } else {
        if (solana.isPhantom) {
          setSolana(true);
          console.log("Solana SDK: ", solana);

          const res = await solana.connect({ onlyIfTrusted: true});
          console.log("Public key: ", res.publicKey.toString())
          setCurrentAccount(res.publicKey.toString());
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    if (!hasSolana) {
      return
    }

    const { solana } = window;

    const res = await solana.connect()
    console.log("Public key: ", res.publicKey.toString())
    setCurrentAccount(res.publicKey.toString());
  }

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  }

  const sendGIF = async () => {
    if (inputValue.length > 0) {
      console.log('User GIF: ', inputValue)
    } else {
      console.log('No link provided.')
    }
  }

  const renderConnectWallet = () => {
    return (
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
    >
        Connect to Wallet
      </button>
    )
  }

  const renderConnectedContainer = () => {
    return (
      <div className="connected-container">

        // GIF input
        <form onClick={(event) => {
          event.preventDefault();
          sendGIF();
        }}>
          <input type="text" placeholder="Enter your GIF link here" value={inputValue} onChange={onInputChange} />
          <button type="submit" className="cta-button submit-gif-button">Submit</button>
        </form>

        // GIF display
        <div className="gif-grid">
          {gifs.map(gif => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>

      </div>
    )
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletConnection();
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (currAccount) {
      // Do Solana

      setGifs(TEST_GIFS)
    }
  }, [currAccount])

  return (
    <div className="App">
      <div className={currAccount ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">😀 Emotes Portal 🥳</p>
          <p className="sub-text">
            Memes for dreams ✨
          </p>
          {!currAccount && renderConnectWallet()}
          {currAccount && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
