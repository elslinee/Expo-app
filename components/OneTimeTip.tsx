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
import { FontFamily } from "@/constants/FontFamily";

interface OneTimeTipProps {
  tipKey: string;
  title: string;
  description: string;
  buttonText?: string;
  color: any;
  onClose?: () => void;
}

export default function OneTimeTip({
  tipKey,
  title,
  description,
  buttonText = "فهمت",
  color,
  onClose,
}: OneTimeTipProps) {
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const checkTipStatus = async () => {
      try {
        const shown = await AsyncStorage.getItem(tipKey);
        if (!shown) {
          setShowTip(true);
        }
      } catch (e) {
        // ignore
      }
    };
    checkTipStatus();
  }, [tipKey]);

  const handleClose = async () => {
    setShowTip(false);
    try {
      await AsyncStorage.setItem(tipKey, "true");
    } catch (e) {
      // ignore
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={showTip}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <View
          style={[styles.modalContainer, { backgroundColor: color.background }]}
        >
          <Text style={[styles.modalTitle, { color: color.darkText }]}>
            {title}
          </Text>
          <View style={styles.descriptionContainer}>
            {description.split("\n").map((line, index) => {
              // Check if line starts with a number (Arabic or English)
              const isNumbered =
                /^[\d\u0660-\u0669\u06F0-\u06F9]+[\.\)]\s/.test(line.trim());
              if (isNumbered) {
                return (
                  <View key={index} style={styles.listItem}>
                    <Text style={[styles.listNumber, { color: color.primary }]}>
                      {line.trim().split(/[\s\.\)]/)[0]}
                    </Text>
                    <Text style={[styles.listText, { color: color.darkText }]}>
                      {line
                        .trim()
                        .replace(
                          /^[\d\u0660-\u0669\u06F0-\u06F9]+[\.\)]\s/,
                          ""
                        )}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <Text
                    key={index}
                    style={[styles.modalDescription, { color: color.darkText }]}
                  >
                    {line}
                  </Text>
                );
              }
            })}
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: color.primary }]}
              onPress={handleClose}
            >
              <Text style={[styles.modalButtonText, { color: color.white }]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
    opacity: 0.8,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  listNumber: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginRight: 8,
    minWidth: 20,
  },
  listText: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    lineHeight: 24,
    flex: 1,
    opacity: 0.8,
  },
  modalButtonContainer: {
    alignItems: "center",
  },
  modalButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
});
