import { Login, Register, Profile, Home, ChatListFriend } from "../screens";
import { MenuLayout, MainLayout } from "../layout";

const publicRoutes = [
  { name: "login", component: Login, layout: MainLayout },
  { name: "register", component: Register, layout: MainLayout },
  { name: "home", component: Home, layout: MenuLayout },
  { name: "chatListFriend", component: ChatListFriend, layout: MainLayout },
  // { name: "chat", component: Profile, layout: MenuLayout },
];

//  const authRoutes = [];
//  const privateRoutes = [{ path: "/profile", component: Profile }];

export { publicRoutes };
