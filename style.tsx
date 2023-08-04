import { StyleSheet } from "react-native";

export const greyColor = "rgba(190,194,197,255)";
export const blueColor = "#1877F2";
export const greyColorBtn = "#b1b2b4";

export const backgroundColor = "white";
export const itemColor = "rgba(133,126,117,255)";
export const fontColor = "white";
export const btnBgr = "black";
export const btnColor = "white";
export const fontColorItem = "white";

export const global_styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    paddingTop: 40,
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
  textTitle: {
    fontSize: 25,
    fontWeight: "bold",
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
    padding: 12,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: fontColor,
  },
  text: {
    color: fontColor,
  },
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
});
