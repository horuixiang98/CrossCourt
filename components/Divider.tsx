import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/theme";

function Divider() {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center',}}>
            <View style={styles.Divider}></View>
            <View style={styles.DividerDot}></View>
            {/* <View style={styles.DividerDot}></View> */}
        </View>
    );
}

export default Divider;


const styles = StyleSheet.create({
    Divider:{
      height: 5,
      borderRadius: 20,
      width: '80%',
      backgroundColor: Colors.light.lightgreen,
    },
    DividerDot:{
      margin: 5,
      height: 5,
      borderRadius: 10,
      width: '3%',
      backgroundColor: Colors.light.lightgreen,
    },
});
