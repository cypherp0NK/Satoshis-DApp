import { atom, useAtom } from 'jotai';

const settingsNavbar = atom(false);
const stakeOption = atom(true)
const matureUnstakeOption = atom(false)
const unstakeOption = atom(false)
const addressSetting = atom(undefined)

export default function NavBarSettings() {
  const [address, setAddress] = useAtom(addressSetting)
  const [isNavBarOpen, setNavbarOpen] = useAtom(settingsNavbar);
  const openNavbar = () => setNavbarOpen(true);
  const closeNavbar = () => setNavbarOpen(false);

  const [isStakeTab, setStakeTab] = useAtom(stakeOption)
  const [isMatureUnstakeTab, setMatureUnstakeTab] = useAtom(matureUnstakeOption)
  const [isUnstakeTab, setUnstakeTab] = useAtom(unstakeOption)

  const openStakeTab = () => {
    setMatureUnstakeTab(false)
    setUnstakeTab(false)
    setStakeTab(true)
  }
  const openMatureUnstakeTab = () => {
    setStakeTab(false)
    setUnstakeTab(false)
    setMatureUnstakeTab(true)
  }
  const openUnstakeTab = () => {
    setStakeTab(false)
    setMatureUnstakeTab(false)
    setUnstakeTab(true)
  }
  return {
    address,
    setAddress,
    isNavBarOpen,
    openNavbar,
    closeNavbar,
    isStakeTab,
    openStakeTab,
    isMatureUnstakeTab,
    openMatureUnstakeTab,
    isUnstakeTab,
    openUnstakeTab
  };
}