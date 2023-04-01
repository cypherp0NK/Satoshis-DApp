import { useState, useEffect } from "react";
import Head from "next/head";
import ConnectionData from "@/hooks/ConnectionData";
import useStake from "@/data/utils/useStake";
import Image from "next/image";
import satsImg from "../public/sats.png";
import Sidebar from "@/components/sidebar";
import NavBarSettings from "@/components/settings";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
const web3modalStorageKey = "WEB3_CONNECT_CACHED_PROVIDER";

function Spinner() {
  return (
    <div className="flex border-4 border-l-none border-b-none border-r-cardBlack border-subtleGray w-6 h-6 rounded-3xl animate-spin"></div>
  );
}

export default function Home() {
  const web3Modal =
    typeof window !== "undefined" && new Web3Modal({ cacheProvider: true });

  const {
    address,
    userActiveStakes,
    userStakesHistory,
    userMatureStakes,
    userLobbyEntries,
    currentDay,
    lobbySats,
    lobbyEth,
    connectToWallet,
    getCurrentDay,
    getPrice,
    getStakes,
    getBalance,
    getLobbyEntries,
  } = ConnectionData();
  const [satsAmount, setSatsAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [lg, setLg] = useState(0);
  const [bg, setBg] = useState(0);
  const [price, setPrice] = useState("0.000");
  const [stakerAddress, setStakerAddress] = useState("");
  const [stakerArraySlot, setStakerArraySlot] = useState("");
  const [warningModal, setWarningModal] = useState(true);
  const [secondLoading, setSecondLoading] = useState(false);
  const [ethAmount, setEthAmount] = useState("");
  const [referralAddress, setReferralAddress] = useState("");

  const {
    ethBalance,
    isNavBarOpen,
    openNavbar,
    isStakeTab,
    isMatureUnstakeTab,
    isUnstakeTab,
    isEnterLobbyTab,
    isExitLobbyTab,
    openStakeTab,
    openMatureUnstakeTab,
    openUnstakeTab,
    openEnterLobbyTab,
    openExitLobbyTab,
  } = NavBarSettings();

  const {
    stake,
    matureUnstake,
    unstake,
    enterLobby,
    exitLobby,
    loading,
    approveHash,
    stakeHash,
    setStakeHash,
    setApproveHash,
    stakeError,
    setStakeError,
  } = useStake();

  async function getToday(provider) {
    await getCurrentDay(provider);
    const pr = await getPrice(provider);
    if (pr !== 0) setPrice(pr.toFixed(3).toString());
  }

  const handleStake = async () => {
    try {
      setStakeError("");
      setApproveHash("");
      setStakeHash("");
      const status = await stake(parseFloat(satsAmount), duration);
      if (status === "wallet error") {
        setStakeError("no wallet was detected");
      }
    } catch (error) {
      setStakeError(error.message.slice(0, 15).concat("..."));
    }
  };

  const handleMatureUnStake = async (addr, arraySlot) => {
    try {
      const matureUnstakeStatus = await matureUnstake(addr, arraySlot);
      if (matureUnstakeStatus === "wallet error") {
        setStakeError("no wallet was detected");
      }
    } catch (error) {
      setStakeError(error.message.slice(0, 25).concat("..."));
    }
  };

  const handleUnStake = async (arraySlot) => {
    try {
      const unstakeStatus = await unstake(arraySlot);
      if (unstakeStatus === "wallet error") {
        setStakeError("no wallet was detected");
      }
    } catch (error) {
      setStakeError(error.message.slice(0, 25).concat("..."));
    }
  };

  const handleEnterLobby = async (amt, ref) => {
    try {
      await enterLobby(amt, ref);
    } catch (error) {
      setStakeError(error.message.slice(0, 25).concat("..."));
    }
  };

  const maxBalance = async () => {
    try {
      if (
        (window && window.web3 !== undefined) ||
        (window && window.ethereum !== undefined)
      ) {
        const connection = web3Modal && (await web3Modal.connect());
        let distributedProvider = new ethers.providers.Web3Provider(connection);
        const simplifiedBalance = await getBalance(distributedProvider);
        if (simplifiedBalance >= 0.001) {
          setSatsAmount((simplifiedBalance - 0.001).toFixed(3).toString());
        } else {
          setSatsAmount("0");
        }
      } else {
        let centralProvider = new providers.JsonRpcProvider(
          "https://eth-mainnet.g.alchemy.com/v2/dpjYbCh3TKtompZ4MghsvWUZxJ9YUV7n"
        );
        const simplifiedBalance = await getBalance(centralProvider);
        if (simplifiedBalance >= 0.001) {
          setSatsAmount((simplifiedBalance - 0.001).toFixed(3).toString());
        } else {
          setSatsAmount("0");
        }
      }
    } catch (error) {
      setStakeError(error.message.slice(0, 25).concat("..."));
    }
  };

  const maxEthBalance = async () => {
    setEthAmount(ethBalance.toString());
  };

  const handleEthAmountChange = (event) => {
    const newEthAmount = event.target.value === "" ? "" : event.target.value;
    if (!isNaN(newEthAmount)) {
      setEthAmount(newEthAmount);
    } else {
      return;
    }
  };

  const handleReferralAddress = (event) => {
    setReferralAddress(event.target.value);
  };

  function calculate() {
    let sats = 0;
    let dt = 0;
    if (satsAmount !== "") sats = parseFloat(satsAmount);
    if (duration !== "") dt = parseInt(duration);
    const longer = (sats * dt) / 1820;
    const bigger = sats < 1e6 ? sats ** 2 / 21e9 : 4e4;
    setLg(longer);
    setBg(bigger);
  }

  const handleSatsAmountChange = (event) => {
    const newAmount = event.target.value === "" ? "" : event.target.value;
    if (!isNaN(newAmount)) {
      setSatsAmount(newAmount);
    } else {
      return;
    }
  };

  const handleDurationChange = (event) => {
    const newDuration = event.target.value === "" ? "" : event.target.value;
    if (!isNaN(newDuration)) {
      if (newDuration > 5479) {
        setDuration("5479");
      } else {
        setDuration(newDuration);
      }
    } else {
      return;
    }
  };

  const handleStakerAddress = (event) => {
    const stAddr = event.target.value === "" ? "" : event.target.value;
    setStakerAddress(stAddr);
  };

  const handleStakerArraySlot = (event) => {
    const stArraySlot = event.target.value === "" ? "" : event.target.value;
    if (!isNaN(stArraySlot)) {
      setStakerArraySlot(stArraySlot);
    } else {
      return;
    }
  };

  async function fetchAllData() {
    if (
      (window && window.web3 !== undefined) ||
      (window && window.ethereum !== undefined)
    ) {
      const connection = web3Modal && (await web3Modal.connect());
      let distributedProvider = new ethers.providers.Web3Provider(connection);
      getStakes(distributedProvider);
      getToday(distributedProvider);
      getLobbyEntries(distributedProvider);
    } else {
      let centralProvider = new providers.JsonRpcProvider(
        "https://eth-mainnet.g.alchemy.com/v2/dpjYbCh3TKtompZ4MghsvWUZxJ9YUV7n"
      );
      getStakes(centralProvider);
      getToday(centralProvider);
      getLobbyEntries(centralProvider);
    }
  }
  async function secondLoadingAnimation() {
    let timer = setTimeout(() => {
      setWarningModal(false);
    }, 1000);
    return () => clearTimeout(timer);
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

    calculate();
    async function fetchingData() {
      await fetchAllData();
    }
    async function resetApproveHash() {
      let timer = setTimeout(() => {
        setApproveHash("");
      }, 10000);
      return () => clearTimeout(timer);
    }
    async function resetStakeHash() {
      fetchAllData();
      let timer = setTimeout(() => {
        setStakeHash("");
      }, 6000);
      return () => clearTimeout(timer);
    }
    async function resetStakeError() {
      let timer = setTimeout(() => {
        setStakeError("");
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (!address) {
      checkConnection();
    }

    if (address) {
      fetchingData();
    }

    if (approveHash !== "") {
      resetApproveHash();
    }

    if (stakeHash !== "") {
      resetStakeHash();
    }

    if (stakeError !== "") {
      resetStakeError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [satsAmount, duration, address, approveHash, stakeHash, stakeError]);

  return (
    <>
      <Head>
        <title>Stake Your SATS</title>
        <meta name="description" content="The vision of Satoshi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sats.png" />
      </Head>
      {isNavBarOpen ? (
        <div id="navItems">
          <Sidebar />
        </div>
      ) : (
        ""
      )}
      <div className="fixed text-white bottom-5 z-50 bg-transparent w-full">
        {approveHash !== "" ? (
          <div className="flex flex-row w-full m-auto justify-center pt-3 pl-3 pr-1 pb-5">
            <div className="flex bg-cardBlack p-2 rounded-xl border border-subtleGray">
              <div className="px-4 p-2 rounded-lg bg-background ">
                Approve txn successful. Click on Stake Now
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {stakeHash !== "" ? (
          <div className="flex flex-row w-full m-auto justify-center pt-3 pl-3 pr-1 pb-5">
            <div className="flex bg-cardBlack p-2 rounded-xl border border-subtleGray">
              <div className="px-4 p-2 rounded-lg bg-background ">
                Txn broadcasted:{" "}
                <u>
                  <a target="_blank" rel="noopener noreferrer" href={stakeHash}>
                    {stakeHash.slice(0, 15).concat("...")}
                  </a>
                </u>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {stakeError !== "" ? (
          <div className="flex flex-row w-full m-auto justify-center pt-3 pl-3 pr-1 pb-5">
            <div className="flex bg-cardBlack p-2 rounded-xl border border-subtleGray">
              <div className="px-4 p-2 rounded-lg bg-background ">
                Error: {stakeError}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <main className="p-4 pb-16 space-y-6">
        <>
          {/* First Container */}

          <div
            id="navContainer"
            className="bg-cardBlack rounded-xl w-full px-6 py-2 flex justify-between"
          >
            {/* btn */}
            <div className="flex justify-between">
              <Image
                id="forNav"
                src={satsImg}
                alt="sats logo"
                width={30}
                height={30}
              />
              <div
                onClick={() => {
                  openNavbar();
                }}
                id="navMenuIcon"
                className="cursor-pointer my-auto flex items-center justify-center rounded-full w-8 h-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-menu"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </div>
            </div>

            <div id="forNav" className="flex row">
              {isStakeTab ? (
                <div className="cursor-pointer block my-auto text-base font-mono text-gray-300 pr-4 lg:border-r-2 lg:border-background">
                  STAKE
                </div>
              ) : (
                <div
                  onClick={openStakeTab}
                  className="cursor-pointer block my-auto text-base font-mono text-gray-600 pr-4 lg:border-r-2 lg:border-background"
                >
                  STAKE
                </div>
              )}
              {isMatureUnstakeTab ? (
                <div className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-300 lg:border-r-2 lg:border-background">
                  <span className="pr-1.5">MATURE</span>
                  <span>UNSTAKE</span>
                </div>
              ) : (
                <div
                  onClick={openMatureUnstakeTab}
                  className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-600 lg:border-r-2 lg:border-background"
                >
                  <span className="pr-1.5">MATURE</span>
                  <span>UNSTAKE</span>
                </div>
              )}
              {isUnstakeTab ? (
                <div className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-300 lg:border-r-2 lg:border-background">
                  UNSTAKE
                </div>
              ) : (
                <div
                  onClick={openUnstakeTab}
                  className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-600 lg:border-r-2 lg:border-background"
                >
                  UNSTAKE
                </div>
              )}
              {/* {isEnterLobbyTab ? (
                <div className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-300 lg:border-r-2 lg:border-background">
                  <span className="pr-1.5">ENTER</span>
                  <span>LOBBY</span>
                </div>
              ) : (
                <div
                  onClick={openEnterLobbyTab}
                  className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-600 lg:border-r-2 lg:border-background"
                >
                  <span className="pr-1.5">ENTER</span>
                  <span>LOBBY</span>
                </div>
              )} */}

              <div className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-600 lg:border-r-2 lg:border-background">
                <span className="pr-1.5">ENTER</span>
                <span>LOBBY</span>
                <span className="text-xs bg-gradient-to-r from-yellow-200 to-purple-400 via-red-400 text-transparent bg-clip-text">
                  soon
                </span>
              </div>
              <div className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-600">
                <span className="pr-1.5">EXIT</span>
                <span>LOBBY</span>
                <span className="text-xs bg-gradient-to-r from-yellow-200 to-purple-400 via-red-400 text-transparent bg-clip-text">
                  soon
                </span>
              </div>

              {/* {isExitLobbyTab ? (
                <div className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-300">
                  <span className="pr-1.5">EXIT</span>
                  <span>LOBBY</span>
                </div>
              ) : (
                <div
                  onClick={openExitLobbyTab}
                  className="cursor-pointer px-4 active:text-gray-300 block my-auto text-base font-mono text-gray-600"
                >
                  <span className="pr-1.5">EXIT</span>
                  <span>LOBBY</span>
                  <span className="text-xs bg-gradient-to-r from-yellow-200 to-purple-400 via-red-400 text-transparent bg-clip-text">
                    soon
                  </span>
                </div>
              )} */}
            </div>
            <div className="flex self-end justify-between">
              <div className="cursor-pointer bg-gradient-to-r from-yellow-200 to-purple-400 via-red-400 p-0.5 rounded-lg">
                <div className="bg-cardBlack rounded-md px-3 py-1 text-sm text-white font-medium">
                  <span className="bg-gradient-to-r from-yellow-200 to-purple-400 via-red-400 text-transparent bg-clip-text">
                    {address ? (
                      `${address.substr(0, 6)}....${address.substr(
                        address.length - 4,
                        address.length
                      )}`
                    ) : (
                      <span onClick={connectToWallet}>Connect wallet</span>
                    )}
                  </span>
                </div>
              </div>
              {/* btn */}
            </div>
          </div>
          {/* Second Container */}
          {isStakeTab ? (
            <>
              <div className="bg-cardBlack rounded-xl w-full h-fit p-4 flex flex-col lg:flex-row justify-between">
                {/* Stake card */}
                <div className="w-full lg:w-1/3 p-4 pt-1 pb-4 lg:pb-2 lg:border-r-2 lg:border-background flex flex-col justify-between">
                  <header className="space-y-1 pb-2 lg:pb-1">
                    <h2 className="block text-xl font-mono text-white -mb-1">
                      Stake
                    </h2>
                    <p className="text-subtleGray text-sm">Open a new stake</p>
                  </header>
                  <div className="bg-background border mb-3.5 text-sm border-fadedGray rounded-lg p-1.5 pr-3.5 flex justify-between">
                    <input
                      placeholder="Stake amount in SATS"
                      type="text"
                      value={satsAmount}
                      onChange={handleSatsAmountChange}
                      className="bg-background text-white text-sm spin-button-hidden w-full appearance-none rounded-lg border-transparent focus:border-transparent focus:shadow-none focus:outline-none focus:ring-0"
                    />
                    <div
                      onClick={maxBalance}
                      className="bg-white text-black active:bg-stone-300 font-medium cursor-pointer m-auto flex justify-center py-0.5 px-2 rounded-md"
                    >
                      MAX
                    </div>
                  </div>
                  <div className="bg-background mb-3.5 border border-fadedGray rounded-lg p-1.5 flex justify-between">
                    <input
                      onChange={handleDurationChange}
                      value={duration}
                      placeholder="Stake duration in days"
                      type="text"
                      className="bg-background text-white text-sm spin-button-hidden w-full appearance-none rounded-lg border-transparent focus:border-transparent focus:shadow-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  {loading ? (
                    <div className="bg-stone-300 mb-4 lg:mb-0 text-black gap-2 active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md">
                      <Spinner />
                      <span>PENDING...</span>
                    </div>
                  ) : (
                    <div
                      onClick={handleStake}
                      className="bg-white mb-4 lg:mb-0 text-black active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md"
                    >
                      STAKE NOW
                    </div>
                  )}
                </div>

                {/* details */}
                <div className="bg-cardBlack w-full p-4 pt-1 pb-2 space-y-2.5">
                  <header className="space-y-1 pb-2 w-full">
                    <h2 className="block text-xl font-mono text-white -mb-2">
                      Details of your stake
                    </h2>
                    <p className="text-subtleGray text-sm">
                      Please review before you begin staking
                    </p>
                  </header>

                  <div className="flex flex-col lg:flex-row justify-between w-full space-y-5 lg:space-y-0 lg:space-x-5">
                    <div className="bg-background text-white p-4 rounded-lg w-full">
                      <header className="text-base pb-3">Stake Bonuses</header>
                      <div className="text-subtleGray text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>LongerPaysBetter:</span>
                        <span>+{lg.toFixed(3)} SATS</span>
                      </div>
                      <div className="text-subtleGray text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>BiggerPaysBetter:</span>
                        <span>+{bg.toFixed(3)} SATS</span>
                      </div>
                      <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>Total:</span>
                        <span>+{(lg + bg).toFixed(3)} SATS</span>
                      </div>
                      <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>Effective SATS:</span>
                        <span>
                          +
                          {satsAmount !== ""
                            ? (parseFloat(satsAmount) + lg + bg).toFixed(3)
                            : "0.000"}{" "}
                          SATS
                        </span>
                      </div>
                    </div>
                    <div className="bg-background text-white text-sm p-4 rounded-lg w-full">
                      <header className="text-base pb-3">Stake Shares</header>
                      <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>SharePrice:</span>
                        <span>
                          {price !== "0.000" && currentDay !== "---"
                            ? price
                            : "0.000"}{" "}
                          SATS / T-Share
                        </span>
                      </div>
                      <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>Stake-Tshares:</span>
                        <span>
                          {satsAmount !== ""
                            ? parseFloat(satsAmount).toFixed(3)
                            : "0.000"}{" "}
                          SATS
                        </span>
                      </div>
                    </div>
                    <div className="bg-background text-white p-4 rounded-lg w-full">
                      <header className="text-base pb-3">Stake Time</header>
                      <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>Start Day:</span>
                        <span>
                          {currentDay !== "---" && price !== "0.000"
                            ? currentDay
                            : "---"}
                        </span>
                      </div>
                      <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>Last Full Day:</span>
                        <span>
                          {duration !== "" &&
                          parseInt(duration) > 0 &&
                          currentDay !== "---"
                            ? parseInt(currentDay) + parseInt(duration) - 1
                            : "---"}
                        </span>
                      </div>
                      <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                        <span>End Day:</span>
                        <span>
                          {duration !== "" &&
                          parseInt(duration) > 0 &&
                          currentDay !== "---"
                            ? parseInt(currentDay) + parseInt(duration)
                            : "---"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* details */}
              </div>
              {/* Third Container */}
              <div className="bg-cardBlack rounded-xl w-full p-6 pt-4">
                <header className="space-y-1 pb-2 w-full block text-xl font-mono text-white">
                  Active Stakes
                </header>
                <div className="flex bg-background rounded-xl flex-row text-white justify-between h-full w-full">
                  <table className="w-full text-xs lg:text-base text-center rounded-lg">
                    <tbody>
                      <tr className="h-6">
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="md:border-r-2 md:border-fadedGray"></td>
                        <td
                          className="md:border-b-2 md:border-fadedGray md:rounded-tr-xl font-normal bg-shadedGray"
                          colSpan={2}
                          id="mobileScreenView"
                        >
                          Current Value
                        </td>
                      </tr>

                      <tr className="border-b-2 border-fadedGray">
                        <td className="border-r-2 border-fadedGray">Start</td>
                        <td className="border-r-2 border-fadedGray">End</td>
                        <td className="border-r-2 border-fadedGray">
                          Progress
                        </td>
                        <td className="border-r-2 border-fadedGray">
                          Principal
                        </td>
                        <td className="border-r-2 border-fadedGray">
                          T-Shares
                        </td>
                        <td className="md:border-r-2 border-fadedGray">
                          Yield
                        </td>
                        <td
                          className="md:border-r-2 md:border-fadedGray bg-shadedGray"
                          id="mobileScreenView"
                        >
                          SATS
                        </td>
                        <td className="bg-shadedGray" id="mobileScreenView">
                          USD
                        </td>
                      </tr>

                      {userActiveStakes.length !== 0 ? (
                        userActiveStakes.map((activeStakes) => {
                          return (
                            <tr key={activeStakes.id} className="h-8 lg:h-14">
                              <td className="border-r-2 border-fadedGray">
                                {activeStakes.startDay}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {activeStakes.endDay}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {activeStakes.progress}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {activeStakes.principal}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {activeStakes.share}
                              </td>
                              <td className="md:border-r-2 border-fadedGray">
                                {activeStakes.reward}
                              </td>
                              <td
                                className="md:border-r-2 border-fadedGray"
                                id="mobileScreenView"
                              >
                                {activeStakes.sats}
                              </td>
                              <td id="mobileScreenView">{activeStakes.usd}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="h-8 lg:h-14">
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="md:border-r-2 border-fadedGray"></td>
                          <td
                            className="md:border-r-2 border-fadedGray"
                            id="mobileScreenView"
                          ></td>
                          <td id="mobileScreenView"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Fourth Container */}
              <div className="bg-cardBlack rounded-xl w-full p-6 pt-4">
                <header className="space-y-1 pb-2 w-full block text-xl font-mono text-white">
                  Stake History
                </header>
                <div className="flex bg-background rounded-xl flex-row text-white justify-between h-full w-full">
                  <table className="w-full text-xs lg:text-base text-center rounded-lg">
                    <tbody>
                      <tr className="h-6">
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="md:border-r-2 border-fadedGray"></td>
                        <td
                          className="md:border-b-2 md:border-fadedGray md:rounded-tr-xl font-normal bg-shadedGray"
                          colSpan={2}
                          id="mobileScreenView"
                        >
                          Current Value
                        </td>
                      </tr>

                      <tr className="border-b-2 border-fadedGray">
                        <td className="border-r-2 border-fadedGray">Start</td>
                        <td className="border-r-2 border-fadedGray">End</td>
                        <td className="border-r-2 border-fadedGray">
                          Progress
                        </td>
                        <td className="border-r-2 border-fadedGray">
                          Principal
                        </td>
                        <td className="border-r-2 border-fadedGray">
                          T-Shares
                        </td>
                        <td className="md:border-r-2 border-fadedGray">
                          Yield
                        </td>
                        <td
                          className="md:border-r-2 md:border-fadedGray bg-shadedGray"
                          id="mobileScreenView"
                        >
                          SATS
                        </td>
                        <td className="bg-shadedGray" id="mobileScreenView">
                          USD
                        </td>
                      </tr>
                      {userStakesHistory.length !== 0 ? (
                        userStakesHistory.map((history) => {
                          return (
                            <tr key={history.id} className="h-8 lg:h-14">
                              <td className="border-r-2 border-fadedGray">
                                {history.startDay}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {history.endDay}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {history.progress}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {history.principal}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {history.share}
                              </td>
                              <td className="md:border-r-2 border-fadedGray">
                                {history.reward}
                              </td>
                              <td
                                className="md:border-r-2 border-fadedGray"
                                id="mobileScreenView"
                              >
                                {history.sats}
                              </td>
                              <td id="mobileScreenView">{history.usd}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="h-8 lg:h-14">
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td
                            className="md:border-r-2 border-fadedGray"
                            id="mobileScreenView"
                          ></td>
                          <td
                            className="md:border-r-2 border-fadedGray"
                            id="mobileScreenView"
                          ></td>
                          <td id="mobileScreenView"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : isMatureUnstakeTab ? (
            <>
              <div className="bg-cardBlack rounded-xl w-full h-fit px-4 py-6 flex flex-col lg:flex-row justify-between">
                {/* Mature Stakes */}
                <div className="bg-cardBlack w-full p-4 pt-1 pb-2 space-y-2.5">
                  <header className="space-y-1 pb-2 w-full">
                    <h2 className="block text-lg font-mono text-white -mb-1">
                      Mature Stakes
                    </h2>
                    <p className="text-subtleGray text-sm">
                      All your mature stakes appear here
                    </p>
                  </header>

                  <div className="flex flex-col justify-center w-full space-y-5">
                    {userMatureStakes.length !== 0 ? (
                      userMatureStakes.map((Mstakes) => {
                        return (
                          <div
                            key={Mstakes.id}
                            className="bg-background text-white p-6 rounded-lg w-full mx-auto lg:w-3/5"
                          >
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Stake ID:</span>
                              <span>#{Mstakes.id}</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Staked:</span>
                              <span>{Mstakes.stake} SATS</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Duration:</span>
                              <span>{Mstakes.duration} Days</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Ended On:</span>
                              <span>Day {Mstakes.endDay}</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Yield:</span>
                              <span>{Mstakes.reward} SATS</span>
                            </div>
                            <div
                              onClick={() => {
                                handleMatureUnStake(address, Mstakes.id);
                              }}
                              className="bg-white my-4 lg:mb-0 text-black active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md"
                            >
                              UNSTAKE
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-gray-300 text-base m-auto h-full pb-6">
                        You have no mature stakes yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isNavBarOpen ? "" : <hr></hr>}
              <div className="bg-cardBlack rounded-xl w-full h-fit p-4 flex flex-col lg:flex-row justify-between">
                {/* Unstake for a friend */}
                <div className="bg-cardBlack w-full px-4 py-6 space-y-2.5">
                  <header className="space-y-1 pb-4 w-full">
                    <h2 className="block text-lg font-mono text-white -mb-1">
                      Unstake for a friend?
                    </h2>
                    <p className="text-subtleGray text-sm">
                      {
                        "Owner's stake must be mature for the transaction to go through"
                      }
                    </p>
                  </header>
                  <div className="w-full mx-auto lg:w-3/5 p-4 pt-1 pb-4 lg:pb-2 flex flex-col justify-between">
                    <div className="bg-background border mb-3.5 text-sm border-fadedGray rounded-lg p-1.5 pr-3.5 flex justify-between">
                      <input
                        placeholder="Staker's address"
                        type="text"
                        value={stakerAddress}
                        onChange={handleStakerAddress}
                        className="bg-background text-white text-sm spin-button-hidden w-full appearance-none rounded-lg border-transparent focus:border-transparent focus:shadow-none focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div className="bg-background mb-3.5 border border-fadedGray rounded-lg p-1.5 flex justify-between">
                      <input
                        onChange={handleStakerArraySlot}
                        value={stakerArraySlot}
                        placeholder="Stake ID"
                        type="text"
                        className="bg-background text-white text-sm spin-button-hidden w-full appearance-none rounded-lg border-transparent focus:border-transparent focus:shadow-none focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div
                      onClick={() => {
                        handleMatureUnStake(stakerAddress, stakerArraySlot);
                      }}
                      className="bg-white my-4 lg:mb-0 text-black active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md"
                    >
                      UNSTAKE
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : isUnstakeTab ? (
            <>
              <div className="bg-cardBlack rounded-xl w-full h-fit px-4 py-6 flex flex-col lg:flex-row justify-between">
                {/* Unstakes */}
                <div className="bg-cardBlack w-full p-4 pt-1 pb-2 space-y-2.5">
                  <header className="space-y-1 pb-6 md:pb-2 w-full">
                    <h2 className="block text-lg font-mono text-white -mb-1">
                      Unstake
                    </h2>
                    <p className="text-subtleGray text-sm">
                      All your stakes appear hear
                    </p>
                  </header>

                  <div className="h-fit flex flex-col justify-center w-full space-y-5">
                    {warningModal ? (
                      <div className="text-gray-400 text-base m-auto h-fit">
                        <div className="w-full justify-center mx-auto flex flex-row space-x-2">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-alert-circle"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                          </span>
                          <span className="text-base">
                            Proceed with Caution
                          </span>
                        </div>
                        <div className="text-xs pt-2 text-center">
                          Unstaking earlier than your commitment time can lead
                          to loss of yield or principal
                        </div>

                        {secondLoading ? (
                          <div className="bg-stone-300 mt-4 lg:mb-0 text-black gap-2 active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md">
                            <Spinner />
                            <span>FETCHING STAKES...</span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setSecondLoading(true);
                              secondLoadingAnimation();
                            }}
                            className="bg-white mt-4 lg:mb-0 text-black active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md"
                          >
                            CONTINUE
                          </div>
                        )}
                      </div>
                    ) : userActiveStakes.length !== 0 ? (
                      userActiveStakes.map((activeStakes) => {
                        return (
                          <div
                            key={activeStakes.id}
                            className="bg-background text-white p-6 rounded-lg w-full mx-auto lg:w-3/5"
                          >
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Stake ID:</span>
                              <span>#{activeStakes.id}</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Progress:</span>
                              <span>{activeStakes.progress}</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Staked:</span>
                              <span>{activeStakes.principal} SATS</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Duration:</span>
                              <span>
                                {activeStakes.endDay - activeStakes.startDay}{" "}
                                Days
                              </span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Yield:</span>
                              <span>{activeStakes.reward} SATS</span>
                            </div>
                            <div
                              onClick={() => {
                                handleUnStake(activeStakes.id);
                              }}
                              className="bg-white my-4 lg:mb-0 text-black active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md"
                            >
                              UNSTAKE
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-gray-300 text-base m-auto h-full pb-6">
                        You have no stakes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : isEnterLobbyTab ? (
            <>
              <div className="bg-cardBlack rounded-xl w-full h-fit p-4 flex flex-row lg:flex-row justify-between">
                {/* Lobby card */}
                <div className="w-full p-4 pt-1 pb-4 lg:pb-2 lg:border-background flex flex-col justify-between">
                  <header className="flex flex-row pb-2 w-full">
                    <h2 className="block text-lg font-mono text-white pt-1 pr-2">
                      {"Today's Lobby"}
                    </h2>
                  </header>

                  <div className="bg-background lg:w-7/12 mx-auto text-white p-8 lg:px-40 space-y-4 text-base rounded-lg w-full">
                    <div className="text-white pb-1.5 w-full flex flex-row justify-between">
                      <span className="pr-8">Current Day:</span>
                      <span>{currentDay !== "---" ? currentDay : "---"}</span>
                    </div>
                    <div className="text-white pb-1.5 w-full flex flex-row justify-between">
                      <span className="pr-8">SATS In Lobby:</span>
                      <span>{lobbySats !== "---" ? lobbySats : "---"}</span>
                    </div>

                    <div className="text-white pb-1.5 w-full flex flex-row justify-between">
                      <span className="pr-8">ETH In Lobby:</span>
                      <span>{lobbyEth !== "---" ? lobbyEth : "---"}</span>
                    </div>
                  </div>
                  <header className="space-y-1 pb-4 pt-6 w-full">
                    <h2 className="block text-lg font-mono text-white -mb-1">
                      Enter Lobby
                    </h2>
                    <p className="text-subtleGray text-sm">
                      {"Earn SATS from early unstakers"}
                    </p>
                  </header>

                  <div className="w-full lg:w-7/12 mx-auto text-white space-y-4 text-base rounded-lg">
                    <div className="w-full bg-background border mb-3.5 text-sm border-fadedGray rounded-lg p-1.5 pr-3.5 flex justify-between">
                      <input
                        placeholder="Enter lobby with an amount in ETH"
                        type="text"
                        value={ethAmount}
                        onChange={handleEthAmountChange}
                        className="bg-background text-white text-sm spin-button-hidden w-full appearance-none rounded-lg border-transparent focus:border-transparent focus:shadow-none focus:outline-none focus:ring-0"
                      />
                      <div
                        onClick={maxEthBalance}
                        className="bg-white text-black active:bg-stone-300 font-medium cursor-pointer m-auto flex justify-center py-0.5 px-2 rounded-md"
                      >
                        MAX
                      </div>
                    </div>
                    <div className="bg-background mb-3.5 border border-fadedGray rounded-lg p-1.5 flex justify-between">
                      <input
                        onChange={handleReferralAddress}
                        value={referralAddress}
                        placeholder="Referral address (optional)"
                        type="text"
                        className="bg-background text-white text-sm spin-button-hidden w-full appearance-none rounded-lg border-transparent focus:border-transparent focus:shadow-none focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div
                      onClick={() => {
                        handleEnterLobby(ethAmount, referralAddress);
                      }}
                      className="bg-white my-4 lg:mb-0 text-black active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md"
                    >
                      ENTER NOW
                    </div>
                  </div>
                </div>

                {/* details */}
              </div>
              {/* Third Container */}
              <div className="bg-cardBlack rounded-xl w-full p-6 pt-4">
                <header className="space-y-1 pb-4 w-full block text-xl font-mono text-white">
                  <h2 className="block text-lg font-mono text-white -mb-1">
                    Your Entries
                  </h2>
                  <p className="text-subtleGray text-sm">
                    All lobbies are open for 24 hours
                  </p>
                </header>

                <div className="flex bg-background rounded-xl flex-row text-white justify-between h-full w-full">
                  <table className="w-full text-xs lg:text-base text-center rounded-lg">
                    <tbody>
                      <tr className="h-6">
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td className="border-r-2 border-fadedGray"></td>
                        <td></td>
                      </tr>
                      <tr className="pt-8 border-b-2 border-fadedGray">
                        <td className="border-r-2 border-fadedGray">Day</td>
                        <td className="border-r-2 border-fadedGray">
                          Started With {"(ETH)"}
                        </td>
                        <td className="border-r-2 border-fadedGray">
                          SATS In Lobby
                        </td>
                        <td className="border-r-2 border-fadedGray">
                          ETH In Lobby
                        </td>

                        <td>Exit Status</td>
                      </tr>

                      {userLobbyEntries.length !== 0 ? (
                        userLobbyEntries.map((inLobby) => {
                          return (
                            <tr key={inLobby.id} className="h-8 lg:h-14">
                              <td className="border-r-2 border-fadedGray">
                                {inLobby.entryDay}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {inLobby.ethStartedWith}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {inLobby.satsInLobby}
                              </td>
                              <td className="border-r-2 border-fadedGray">
                                {inLobby.ethInLobby}
                              </td>

                              <td className="md:border-r-2 border-fadedGray">
                                {parseInt(currentDay) > inLobby.entryDay
                                  ? "Open"
                                  : "Closed"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="h-8 lg:h-14">
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td className="border-r-2 border-fadedGray"></td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : isExitLobbyTab ? (
            <>
              <div className="bg-cardBlack rounded-xl w-full h-fit px-4 py-6 flex flex-col lg:flex-row justify-between">
                {/* Exit Lobby */}
                <div className="bg-cardBlack w-full p-4 pt-1 pb-2 space-y-2.5">
                  <header className="space-y-1 pb-6 md:pb-2 w-full">
                    <h2 className="block text-lg font-mono text-white -mb-1">
                      Exit
                    </h2>
                    <p className="text-subtleGray text-sm">Leave the lobby</p>
                  </header>

                  <div className="h-fit flex flex-col justify-center w-full space-y-5">
                    {userLobbyEntries.length !== 0 ? (
                      userLobbyEntries.map((inLobby) => {
                        return (
                          <div
                            key={inLobby.id}
                            className="bg-background text-white p-6 rounded-lg w-full mx-auto lg:w-3/5"
                          >
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Member On:</span>
                              <span>Day {inLobby.entryDay}</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>SATS Left:</span>
                              <span>{inLobby.satsInLobby}</span>
                            </div>
                            <div className="text-white text-sm pb-1.5 w-full flex flex-row justify-between">
                              <span>Status:</span>
                              <span>
                                {parseInt(currentDay) > inLobby.entryDay
                                  ? "Open"
                                  : "Opens in 24 hours"}
                              </span>
                            </div>

                            <div
                              onClick={() => {
                                exitLobby(inLobby.entryDay);
                              }}
                              className="bg-white my-4 lg:mb-0 text-black active:bg-stone-300 font-medium w-full cursor-pointer flex justify-center py-3.5 rounded-md"
                            >
                              EXIT
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-gray-300 text-base m-auto h-full pb-6">
                        {"You don't belong to any lobbies"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div></div>
          )}
        </>
      </main>
    </>
  );
}
