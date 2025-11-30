import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export function ProfileHeader() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const getInitial = () => {
    if (user?.name && typeof user.name === "string" && user.name.length > 0) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const hasAvatar =
    user?.avatar &&
    typeof user.avatar === "string" &&
    user.avatar.trim().length > 0;

  return (
    <View style={styles.profileSection}>
      <View style={[styles.avatarContainer, { backgroundColor: colors.tint }]}>
        {hasAvatar ? (
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <ThemedText
            style={[styles.avatarText, { color: isDark ? "#000" : "#fff" }]}
          >
            {getInitial()}
          </ThemedText>
        )}
      </View>

      <ThemedText type="subtitle" style={styles.userName}>
        {user?.name && typeof user.name === "string" ? user.name : "User"}
      </ThemedText>

      <ThemedText style={styles.userEmail}>
        {user?.email && typeof user.email === "string" ? user.email : ""}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 46,
    textAlign: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.6,
  },
});
