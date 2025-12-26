import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2025 JustHi. All rights reserved.</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: Colors.light.background,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
});
