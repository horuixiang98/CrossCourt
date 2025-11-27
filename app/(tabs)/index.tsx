import { Colors } from "@/constants/theme";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import MiniApp from "../indexPage/miniApp";
import Search from "../indexPage/search";

function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.ProfileHeader}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 25, fontWeight: "bold", color: "#1c1c1cb7" }}
              >
                Ryanxavier Ho,
              </Text>
              <CountryFlag
                isoCode="MY"
                size={20}
                style={{ margin: 10, marginTop: 15 }}
              />
              {/* <Feather name="arrow-right-circle" size={23} color="#222222b7"/> */}
            </View>
            <View>
              <Text
                style={{ fontSize: 12, color: "#1c1c1c92", paddingBottom: 5 }}
              >
                Ranked No. 32 in Kuala Lumpur
              </Text>
            </View>
          </View>
          <Image
            style={[styles.ProfileImage, { width: 80 }]}
            source={{ uri: "https://picsum.photos/seed/696/3000/2000" }} // Network image
            // OR
            // source={require('./assets/my-local-image.png')} // Local image
            contentFit="cover" // How the image should be resized
            transition={1000} // Transition duration in ms
          />
        </View>
      </View>

      <Search />

      <MiniApp />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  BorderBackground: {
    padding: 20,
    borderRadius: 20,
    width: "100%",
    backgroundColor: Colors.light.lightgray,
  },
  ProfileHeader: {
    padding: 10,
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    // height: 150,
    width: "100%",
    backgroundColor: Colors.light.lightgray,
  },
  ProfileImage: {
    aspectRatio: 1,
    backgroundColor: "#0553",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
