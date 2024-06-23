import { FaHome, FaGithub, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { IoMdLogOut, IoMdSettings } from "react-icons/io";
import { MdManageAccounts, MdNoPhotography, MdCurrencyExchange } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FcMoneyTransfer, FcApproval, FcCancel } from "react-icons/fc";
import { HiUserRemove } from "react-icons/hi";
import { PiHandDepositBold } from "react-icons/pi";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoLogoLinkedin } from "react-icons/io5";
import { SiGmail } from "react-icons/si";
import { CiEdit } from "react-icons/ci";



const ICONS = {
  Home:FaHome ,
  Logout: IoMdLogOut,
  Manage: MdManageAccounts,
  AddClient: AiOutlineUsergroupAdd,
  Transfer: FcMoneyTransfer,
  RemoveClient: HiUserRemove,
  Deposit: PiHandDepositBold,
  Draw:GiTakeMyMoney,
  Gmail: SiGmail,
  LinkedIn: IoLogoLinkedin,
  GitHub: FaGithub,
  Search: FaSearch,
  Settings: IoMdSettings,
  Edit: CiEdit,
  Save: FcApproval,
  Cancel: FcCancel,
  Photo: MdNoPhotography,
  Change: MdCurrencyExchange,
  Bars: FaBars,
  CloseX: FaTimes,
};

export default ICONS;