import React from "react";
import { StyleSheet } from "react-native";

import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";

import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View>
        <Text
          style={{ fontFamily: FontFamily.regular }}
          className="font-bold   font-cairo    text-9xl"
        >
          اهلا{" "}
        </Text>
        <Text lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>

        <View darkColor="rgba(255,255,255,0.05)" lightColor="rgba(0,0,0,0.05)">
          <MonoText>{path}</MonoText>
        </View>

        <Text lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View>
        <ExternalLink href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}
