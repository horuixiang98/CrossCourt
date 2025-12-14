import Account from "@/components/Account";
import { useSession } from "@/providers/SessionProvider";
import { View } from "react-native";

function HomeScreen() {
  const { session } = useSession();
  return (
    <View>
      <Account session={session} />
    </View>
  );
}

export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
