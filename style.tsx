import { StyleSheet } from "react-native";

export const greyColor = "#ebedf0";
export const blueColor = "#1877F2";
export const global_styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    padding: 10,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }],
    zIndex: 1,
  },
  rowCenter: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  rowCenterBetween: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ColumnCenter: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  touchBtn: {
    backgroundColor: greyColor,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
  },
});
