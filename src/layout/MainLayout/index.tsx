import { View } from "react-native";
import { ReactNode } from "react";
interface IndexProps {
  children?: ReactNode;
}

const Index: React.FC<IndexProps> = ({ children }) => {
  return <View>{children}</View>;
};

export default Index;
