import { StyleSheet, Text, View } from "react-native";

function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Account</Text>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});