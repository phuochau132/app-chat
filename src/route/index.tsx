import {
  Login,
  Register,
  Home,
  ChatListFriend,
  Chat,
  Search,
  EditProfile,
  RequestAddFriend,
  ForgotPassword,
} from "../screens";
import { MenuLayout, MainLayout } from "../layout";
import UserProfile from "../screens/OtherUserProfile";

const publicRoutes = [
  { name: "login", component: Login, layout: MainLayout },
  { name: "register", component: Register, layout: MainLayout },
  { name: "home", component: Home, layout: MenuLayout },
  { name: "chatListFriend", component: ChatListFriend, layout: MainLayout },
  { name: "chat", component: Chat, layout: MainLayout },
  { name: "editProfile", component: EditProfile, layout: MainLayout },
  { name: "userProfile", component: UserProfile, layout: MainLayout },
  { name: "forgotPassword", component: ForgotPassword, layout: MainLayout },
];
const tabRoutes = [
  { name: "tabHome", component: Home, iconName: "home-outline" },
  { name: "tabSearch", component: Search, iconName: "search-outline" },
  {
    name: "listFriend",
    component: ChatListFriend,
    iconName: "chatbubble-ellipses-outline",
  },
  {
    name: "requestAddFriend",
    component: RequestAddFriend,
    iconName: "people-outline",
  },
];

export { publicRoutes, tabRoutes };
