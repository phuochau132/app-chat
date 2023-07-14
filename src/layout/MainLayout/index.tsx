import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "react-native-elements";
import { ReactNode } from "react";

interface IndexProps {
  children?: ReactNode;
}

const Index: React.FC<IndexProps> = ({ children }) => {
  return <View>{children}</View>;
};

export default Index;
