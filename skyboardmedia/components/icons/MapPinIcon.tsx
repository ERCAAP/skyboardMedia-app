import Svg, { Path, Circle } from "react-native-svg";

type MapPinIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
};

export function MapPinIcon({ size = 24, color = "#FF3B30", filled = true }: MapPinIconProps) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill={color}
        />
        <Circle cx="12" cy="9" r="2.5" fill="white" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </Svg>
  );
}
