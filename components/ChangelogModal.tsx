import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface ChangelogModalProps {
  changelogKey: string;
  version: string;
  title: string;
  changes: string[];
  color: any;
  onClose?: () => void;
}

export default function ChangelogModal({
  changelogKey,
  version,
  title,
  changes,
  color,
  onClose,
}: ChangelogModalProps) {
  const [showChangelog, setShowChangelog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkChangelogStatus = async () => {
      try {
        const shown = await AsyncStorage.getItem(changelogKey);
        if (!shown) {
          setShowChangelog(true);
        }
      } catch (e) {
        // ignore
      }
    };
    checkChangelogStatus();
  }, [changelogKey]);

  const handleClose = async () => {
    setShowChangelog(false);
    try {
      await AsyncStorage.setItem(changelogKey, "true");
    } catch (e) {
      // ignore
    }
    if (onClose) {
      onClose();
    }
  };

  const handleViewDetails = async () => {
    setShowChangelog(false);
    try {
      await AsyncStorage.setItem(changelogKey, "true");
    } catch (e) {
      // ignore
    }
    router.push("/changelog");
  };

  return (
    <Modal
      visible={showChangelog}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable
          style={[styles.modalContainer, { backgroundColor: color.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: color.text }]}>{title}</Text>
          <Text style={[styles.version, { color: color.primary }]}>
            {version}
          </Text>
          <View style={styles.changesContainer}>
            {changes.map((change, index) => (
              <View key={index} style={styles.changeItem}>
                <Text style={[styles.bullet, { color: color.primary }]}>•</Text>
                <Text style={[styles.changeText, { color: color.darkText }]}>
                  {change}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: color.primary }]}
              onPress={handleClose}
            >
              <Text
                style={[styles.primaryButtonText, { color: color.background }]}
              >
                حسنًا
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: color.bg20 }]}
              onPress={handleViewDetails}
            >
              <Text style={[styles.secondaryButtonText, { color: color.text }]}>
                عرض التفاصيل
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontFamily: "Cairo-Black",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
  },
  version: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  changesContainer: {
    marginBottom: 20,
  },
  changeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  changeText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  buttonContainer: {
    gap: 10,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    textAlign: "center",
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    textAlign: "center",
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
});
