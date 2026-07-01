import { memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import type { MarkerPressEvent } from "react-native-maps";
import { Marker } from "react-native-maps";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import type { Location } from "@/lib/types";
import { getMarkerColor } from "@/lib/utils";

export type LocationMarkerProps = {
  location: Location;
  onPress?: (location: Location, event: MarkerPressEvent) => void;
};

const PinSvg = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size * 1.2} viewBox="0 0 40 50" fill="none">
    <Defs>
      <LinearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor={color} stopOpacity="1" />
        <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
      </LinearGradient>
    </Defs>
    {/* Shadow */}
    <Circle cx="20" cy="46" r="6" fill="rgba(0,0,0,0.2)" />
    {/* Pin body */}
    <Path
      d="M20 2C12.268 2 6 8.268 6 16c0 8.5 14 28 14 28s14-19.5 14-28c0-7.732-6.268-14-14-14z"
      fill="url(#pinGradient)"
    />
    {/* White circle in center */}
    <Circle cx="20" cy="16" r="6" fill="white" />
    {/* Inner dot */}
    <Circle cx="20" cy="16" r="3" fill={color} />
  </Svg>
);

export const LocationMarker = memo(function LocationMarker({ location, onPress }: LocationMarkerProps) {
  const color = getMarkerColor(location);
  const isFeatured = location.featured || location.totalScreens > 3;
  const pinSize = isFeatured ? 50 : 40;

  return (
    <Marker
      identifier={location.id}
      coordinate={{ latitude: location.lat, longitude: location.lng }}
      tracksViewChanges={false}
      onPress={(event) => onPress?.(location, event)}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={styles.container}>
        {/* Modern Pin */}
        <View style={styles.pinContainer}>
          <PinSvg color={color} size={pinSize} />
        </View>

        {/* Info Badge */}
        <View
          style={[
            styles.badge,
            {
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              borderColor: color,
              transform: [{ translateY: -8 }],
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: color }]}>
            {isFeatured ? location.name : `${location.totalScreens} Ekran`}
          </Text>
        </View>

        {/* Pulse animation for featured */}
        {isFeatured && (
          <View
            style={[
              styles.pulse,
              {
                backgroundColor: color,
                opacity: 0.3,
              },
            ]}
          />
        )}
      </View>
    </Marker>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  pinContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  pulse: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -10,
  },
});
