import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import StandardERC20 from "../data/static/StandardERC20.json";
import SATStaking from "../data/static/SATStaking.json";
import Pool from "../data/static/Pool.json";
import Aggregator from "../data/static/Aggregator.json";
import { formatUnits } from "@ethersproject/units";
import NavBarSettings from "@/components/settings";

const web3modalStorageKey = "WEB3_CONNECT_CACHED_PROVIDER";

export default function ConnectionData() {
  const { address, setAddress } = NavBarSettings();
  //const [address, setAddress] = useState(undefined);
  const [error, setError] = useState(false);
  const [network, setNetwork] = useState();
  const stakingAddress = "0x7666CA32eF844Ff435506568f66D6de6792e8425"; //mainnet: 0x7666CA32eF844Ff435506568f66D6de6792e8425 testnet: 0x2f61A303be2c16cFf99D0FeE5698341C5E8d31dE
  const tokenAddress = "0x6C22910c6F75F828B305e57c6a54855D8adeAbf8"; //mainnet: 0x6C22910c6F75F828B305e57c6a54855D8adeAbf8 testnet: 0xCc5DD33CA0B61cc33A14fFBeBDa0a818ef71223c
  const poolAddress = "0xd99E9c449f40BE2809b2c09D4A04114eB559cFaa";
  const aggregatorAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
  const { abi } = SATStaking;
  const tokenABI = StandardERC20.abi;
  const poolABI = Pool.abi;
  const aggregatorABI = Aggregator.abi;
  const [currentDay, setCurrentDay] = useState("---");
  const [launchTime, setLaunchTime] = useState(0);
  const [userActiveStakes, setUserActiveStakes] = useState([]);
  const [userStakesHistory, setStakesUserHistory] = useState([]);
  const [userMatureStakes, setUserMatureStakes] = useState([]);

  const web3Modal =
    typeof window !== "undefined" && new Web3Modal({ cacheProvider: true });

  const setWalletAddress = async (provider) => {
    try {
      const signer = provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        return web3Address;
      }
    } catch (error) {
      console.log(
        error,
        "Account not connected; logged from setWalletAddress function"
      );
    }
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    web3Modal && web3Modal.clearCachedProvider();
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const connectToWallet = async () => {
    try {
      checkIfExtensionIsAvailable();

      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.providers.Web3Provider(connection);
      await subscribeProvider(connection);
      await setWalletAddress(provider);
    } catch (error) {
      console.log(
        error,
        "got this error on connectToWallet catch block while connecting the wallet"
      );
    }
  };

  const subscribeProvider = async (connection) => {
    connection.on("accountsChanged", async (accounts) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
      } else {
        disconnectWallet();
      }
    });
    connection.on("chainChanged", async (chainId) => {
      if (chainId?.length) {
        setNetwork(chainId);
        window.location.reload();
      }
    });
  };

  async function getBalance(provider) {
    if (!address) {
      return 0;
    } else {
      const token = new ethers.Contract(tokenAddress, tokenABI, provider);
      const balance = await token.balanceOf(address);
      const simplifiedBalance = parseFloat(formatUnits(balance, 9)).toFixed(3);
      return simplifiedBalance;
    }
  }

  async function getStakes(provider) {
    /**SATS Price In USD**/
    const pool = new ethers.Contract(poolAddress, poolABI, provider);
    const getAmounts = await pool.getReserves();
    const satsInPool = parseFloat(formatUnits(getAmounts[0], 9));
    const ethInPool = parseFloat(formatUnits(getAmounts[1], 18));

    const satsToEth = ethInPool / satsInPool;
    const aggregator = new ethers.Contract(
      aggregatorAddress,
      aggregatorABI,
      provider
    );
    const feedAnswers = await aggregator.latestRoundData();
    const priceFeed = parseFloat(formatUnits(feedAnswers[1], 8));

    const satsToUSD = satsToEth * priceFeed;

    /**Stake Details**/
    const stakingContract = new ethers.Contract(stakingAddress, abi, provider);
    const stakes = await stakingContract.individualStakesLength(address);
    const activeStakesLength = parseInt(formatUnits(stakes[0], 0));
    const stakesHistoryLength = parseInt(formatUnits(stakes[1], 0));

    let activeStakes = [];
    let StakesHistory = [];
    let matureStakes = [];

    for (let i = 0; i < activeStakesLength; i++) {
      const structValues = await stakingContract.stakersArray(address, i);
      const principal = parseFloat(formatUnits(structValues.sats, 9));
      const share = parseFloat(formatUnits(structValues.share, 9));
      const duration = parseInt(structValues.duration);

      const startDay = parseInt(
        (parseFloat(structValues.startday) - launchTime) / 86400
      );
      const endDay = startDay + duration;
      const progress =
        ((parseInt(currentDay) - startDay) / duration) * 100 > 100
          ? 100
          : ((parseInt(currentDay) - startDay) / duration) * 100;
      const reward = getExpectedReward(principal, duration);
      const sats = principal + reward;
      const satsPrice = sats * satsToUSD;

      activeStakes.push({
        id: i,
        startDay: startDay,
        endDay: endDay,
        progress: progress.toFixed(2).toString().concat("%"),
        principal: principal.toFixed(3),
        share: share.toFixed(3),
        reward: reward.toFixed(3),
        sats: sats.toFixed(3),
        usd: "$".concat(satsPrice.toFixed(3).toString()),
      });

      if (progress >= 100) {
        matureStakes.push({
          id: i,
          stake: principal.toFixed(3),
          duration: duration,
          endDay: endDay,
          reward: reward.toFixed(3),
        });
      }
    }

    for (let i = 0; i < stakesHistoryLength; i++) {
      const structValues = await stakingContract.stakersHistory(address, i);

      const timeClosed = parseFloat(structValues.closed);

      if (timeClosed === 0) {
        const principal = parseFloat(formatUnits(structValues.sats, 9));
        const share = parseFloat(formatUnits(structValues.share, 9));
        const duration = parseInt(structValues.duration);

        const startDay = parseInt(
          (parseFloat(structValues.startday) - launchTime) / 86400
        );
        const endDay = startDay + duration;
        const progress =
          ((parseInt(currentDay) - startDay) / duration) * 100 > 100
            ? 100
            : ((parseInt(currentDay) - startDay) / duration) * 100;
        const reward = getExpectedReward(principal, duration);
        const sats = principal + reward;
        const satsPrice = sats * satsToUSD;

        StakesHistory.push({
          id: i,
          startDay: startDay,
          endDay: endDay,
          progress: progress.toFixed(2).toString().concat("%"),
          principal: principal.toFixed(3),
          share: share.toFixed(3),
          reward: reward.toFixed(3),
          sats: sats.toFixed(3),
          usd: "$".concat(satsPrice.toFixed(3).toString()),
        });
      } else {
        const dayOfClose = (timeClosed - launchTime) / 86400;
        const principal = parseFloat(formatUnits(structValues.sats, 9));
        const share = parseFloat(formatUnits(structValues.share, 9));
        const reward = parseFloat(formatUnits(structValues.yield, 9));
        const duration = parseInt(structValues.duration);

        const startDay = parseInt(
          (parseFloat(structValues.startday) - launchTime) / 86400
        );
        const endDay = startDay + duration;
        const progress =
          ((dayOfClose - startDay) / duration) * 100 > 100
            ? 100
            : ((dayOfClose - startDay) / duration) * 100;

        const sats = principal + reward;
        const satsPrice = sats * satsToUSD;

        StakesHistory.push({
          id: i,
          startDay: startDay,
          endDay: endDay,
          progress: progress.toFixed(2).toString().concat("%"),
          principal: principal.toFixed(3),
          share: share.toFixed(3),
          reward: reward.toFixed(3),
          sats: sats.toFixed(3),
          usd: "$".concat(satsPrice.toFixed(3).toString()),
        });
      }
    }
    setUserActiveStakes(activeStakes);
    setStakesUserHistory(StakesHistory);
    setUserMatureStakes(matureStakes);
  }

  function getExpectedReward(sats, duration) {
    const longerPaysBetter = (sats * duration) / 1820;
    const biggerPaysBetter = sats < 1e6 ? sats ** 2 / 21e9 : 4e4;
    return longerPaysBetter + biggerPaysBetter;
  }

  async function getCurrentDay(provider) {
    const stakingContract = new ethers.Contract(stakingAddress, abi, provider);
    const currentDay = await stakingContract.currentDay();
    const launchTime = await stakingContract.LaunchTime();
    const simplifiedDay = parseInt(currentDay);
    const simplifiedLaunchTime = parseFloat(launchTime);
    setCurrentDay(simplifiedDay.toString());
    setLaunchTime(simplifiedLaunchTime);
  }

  async function getPrice(provider) {
    const stakingContract = new ethers.Contract(stakingAddress, abi, provider);
    const totalSats = await stakingContract.contractBalance();
    const totalShares = await stakingContract.TotalShares();
    const simplifiedSats = parseFloat(formatUnits(totalSats), 9);
    const simplifiedShares = parseFloat(formatUnits(totalShares), 9);
    if (simplifiedSats === 0 && simplifiedShares === 0) {
      return 0;
    } else {
      const price = simplifiedSats / simplifiedShares;
      return price;
    }
  }

  useEffect(() => {
    async function checkConnection() {
      try {
        if (window && window.ethereum) {
          // Check if web3modal wallet connection is available on storage
          if (localStorage.getItem(web3modalStorageKey)) {
            await connectToWallet();
          }
        } else {
          console.log("window or window.ethereum is not available");
        }
      } catch (error) {
        console.log(error, "Catch error Account is not connected");
      }
    }
    if (!address) {
      checkConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    address,
    userActiveStakes,
    userStakesHistory,
    userMatureStakes,
    error,
    network,
    connectToWallet,
    stakingAddress,
    tokenAddress,
    getBalance,
    currentDay,
    getCurrentDay,
    getPrice,
    getStakes,
  };
}
