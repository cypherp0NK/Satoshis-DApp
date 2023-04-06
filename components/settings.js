import { atom, useAtom } from "jotai";

const settingsNavbar = atom(false);
const stakeOption = atom(true);
const matureUnstakeOption = atom(false);
const unstakeOption = atom(false);
const enterLobbyOption = atom(false);
const exitLobbyOption = atom(false);
const claimBonusOption = atom(false);
const unstakeV1Option = atom(false);
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
  const [isClaimBonusTab, setClaimBonusTab] = useAtom(claimBonusOption);
  const [isUnstakeV1Tab, setUnstakeV1Tab] = useAtom(unstakeV1Option);

  const openStakeTab = () => {
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setClaimBonusTab(false);
    setUnstakeV1Tab(false);
    setStakeTab(true);
  };
  const openMatureUnstakeTab = () => {
    setStakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setClaimBonusTab(false);
    setUnstakeV1Tab(false);
    setMatureUnstakeTab(true);
  };
  const openUnstakeTab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setClaimBonusTab(false);
    setUnstakeV1Tab(false);
    setUnstakeTab(true);
  };
  const openEnterLobbyTab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setExitLobbyTab(false);
    setClaimBonusTab(false);
    setUnstakeV1Tab(false);
    setEnterLobbyTab(true);
  };
  const openExitLobbyTab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setClaimBonusTab(false);
    setUnstakeV1Tab(false);
    setExitLobbyTab(true);
  };
  const openClaimBonusTab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setUnstakeV1Tab(false);
    setClaimBonusTab(true);
  };
  const openUnstakeV1Tab = () => {
    setStakeTab(false);
    setMatureUnstakeTab(false);
    setUnstakeTab(false);
    setEnterLobbyTab(false);
    setExitLobbyTab(false);
    setClaimBonusTab(false);
    setUnstakeV1Tab(true);
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
    isClaimBonusTab,
    openClaimBonusTab,
    isUnstakeV1Tab,
    openUnstakeV1Tab,
  };
}
