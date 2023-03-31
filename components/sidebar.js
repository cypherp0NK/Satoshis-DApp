import navBarSettings from "./settings";

import Image from "next/image";
import satsImg from "../public/sats.png";
export default function Sidebar() {
  const {
    closeNavbar,
    isStakeTab,
    openStakeTab,
    isMatureUnstakeTab,
    openMatureUnstakeTab,
    isUnstakeTab,
    openUnstakeTab,
    isEnterLobbyTab,
    openEnterLobbyTab,
    isExitLobbyTab,
    openExitLobbyTab,
  } = navBarSettings();

  return (
    <div className="p-6 top-0 z-40 h-full text-gray-300 scroll-none w-full max-w-full border-dashed border-gray-200">
      <div className="flex items-center row justify-between h-fit mb-4">
        <Image src={satsImg} alt="sats logo" width={60} height={60} />
        <div
          onClick={closeNavbar}
          className="cursor-pointer hover:border-gray-300 border border-fadedGray p-3.5 rounded-full"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.46445 8.53542L8.53552 1.46436"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M1.46446 1.46458L8.53552 8.53564"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-8 space-y-5">
        {isStakeTab ? (
          <div
            onClick={() => {
              openStakeTab();
              closeNavbar();
            }}
            className="cursor-pointer"
          >
            STAKE
          </div>
        ) : (
          <div
            onClick={() => {
              openStakeTab();
              closeNavbar();
            }}
            className="text-subtleGray hover:text-gray-300 hover:text-lg cursor-pointer"
          >
            STAKE
          </div>
        )}
        {isMatureUnstakeTab ? (
          <div
            onClick={() => {
              openMatureUnstakeTab();
              closeNavbar();
            }}
            className="cursor-pointer"
          >
            MATURE UNSTAKE
          </div>
        ) : (
          <div
            onClick={() => {
              openMatureUnstakeTab();
              closeNavbar();
            }}
            className="text-subtleGray hover:text-gray-300 hover:text-lg cursor-pointer"
          >
            MATURE UNSTAKE
          </div>
        )}
        {isUnstakeTab ? (
          <div
            onClick={() => {
              openUnstakeTab();
              closeNavbar();
            }}
            className="cursor-pointer"
          >
            UNSTAKE
          </div>
        ) : (
          <div
            onClick={() => {
              openUnstakeTab();
              closeNavbar();
            }}
            className="text-subtleGray hover:text-gray-300 hover:text-lg cursor-pointer"
          >
            UNSTAKE
          </div>
        )}
        {isEnterLobbyTab ? (
          <div
            onClick={() => {
              openEnterLobbyTab();
              closeNavbar();
            }}
            className="cursor-pointer"
          >
            ENTER LOBBY
          </div>
        ) : (
          <div
            onClick={() => {
              openEnterLobbyTab();
              closeNavbar();
            }}
            className="text-subtleGray hover:text-gray-300 hover:text-lg cursor-pointer"
          >
            ENTER LOBBY
          </div>
        )}
        {isExitLobbyTab ? (
          <div
            onClick={() => {
              openExitLobbyTab();
              closeNavbar();
            }}
            className="cursor-pointer"
          >
            <span>EXIT LOBBY</span>
          </div>
        ) : (
          <div
            onClick={() => {
              openExitLobbyTab();
              closeNavbar();
            }}
            className="text-subtleGray hover:text-gray-300 hover:text-lg cursor-pointer"
          >
            <span>EXIT LOBBY</span>
          </div>
        )}
      </div>
    </div>
  );
}
