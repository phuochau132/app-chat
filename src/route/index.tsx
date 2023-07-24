import {
  Login,
  Register,
  Profile,
  Home,
  ChatListFriend,
  Chat,
  Search,
  EditProfile,
} from "../screens";
import { MenuLayout, MainLayout } from "../layout";

const publicRoutes = [
  { name: "login", component: Login, layout: MainLayout },
  { name: "register", component: Register, layout: MainLayout },
  { name: "home", component: Home, layout: MenuLayout },
  { name: "chatListFriend", component: ChatListFriend, layout: MainLayout },
  { name: "chat", component: Chat, layout: MainLayout },
  { name: "editProfile", component: EditProfile, layout: MainLayout },
  // { name: "chat", component: Profile, layout: MenuLayout },
];
const tabRoutes = [
  { name: "tabHome", component: Home, iconName: "home" },
  { name: "tabSearch", component: Search, iconName: "search-outline" },
  {
    name: "tabProfile",
    component: Profile,
    iconName: "search-outline",
    type: 1,
  },
  // { name: "chat", component: Profile, layout: MenuLayout },
];
//  const authRoutes = [];
//  const privateRoutes = [{ path: "/profile", component: Profile }];

export { publicRoutes, tabRoutes };
