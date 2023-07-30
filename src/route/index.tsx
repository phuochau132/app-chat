import {
  Login,
  Register,
  Home,
  ChatListFriend,
  Chat,
  Search,
  EditProfile,
  RequestAddFriend,
} from "../screens";
import { MenuLayout, MainLayout } from "../layout";

const publicRoutes = [
  { name: "login", component: Login, layout: MainLayout },
  { name: "register", component: Register, layout: MainLayout },
  { name: "home", component: Home, layout: MenuLayout },
  { name: "chatListFriend", component: ChatListFriend, layout: MainLayout },
  { name: "chat", component: Chat, layout: MainLayout },
  { name: "editProfile", component: EditProfile, layout: MainLayout },
];
const tabRoutes = [
  { name: "tabHome", component: Home, iconName: "home-outline" },
  { name: "tabSearch", component: Search, iconName: "search-outline" },
  {
    name: "requestAddFriend",
    component: RequestAddFriend,
    iconName: "people-outline",
  },
];

export { publicRoutes, tabRoutes };
