import { atom, useAtom } from "jotai";

const settingsNavbar = atom(false);
const stakeOption = atom(true);
const matureUnstakeOption = atom(false);
const unstakeOption = atom(false);
const enterLobbyOption = atom(false);
const exitLobbyOption = atom(false);
const ethBalanceSetting = atom(0);

export default function NavBarSettings() {
  const [ethBalance, setEthBalance] = useAtom(ethBalanceSetting);
  const [isNavBarOpen, setNavbarOpen] = useAtom(settingsNavbar);
  const openNavbar = () => setNavbarOpen(true);
  const closeNavbar = () => setNavbarOpen(false);

  const [isStakeTab, setStakeTab] = useAtom(stakeOption);
  const [isMatureUnstakeTab, setMatureUnstakeTab] =
    useAtom(matureUnstakeOption);
  const [isUnstakeTab, setUnstakeTab] = useAtom(unstakeOption);
  const [isEnterLobbyTab, setEnterLobbyTab] = useAtom(enterLobbyOption);
  const [isExitLobbyTab, setExitLobbyTab] = useAtom(exitLobbyOption);

  const openStakeTab = () => {
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setStakeTab(true);
  };
  const openMatureUnstakeTab = () => {
    setStakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setMatureUnstakeTab(true);
  };
  const openUnstakeTab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setUnstakeTab(true);
  };
  const openEnterLobbyTab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setExitLobbyTab(false);
    setEnterLobbyTab(true);
  };
  const openExitLobbyTab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(true);
  };

  return {
    ethBalance,
    setEthBalance,
    isNavBarOpen,
    openNavbar,
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
  };
}
