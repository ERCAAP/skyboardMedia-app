import Svg, { Path, Circle } from "react-native-svg";

type PlayIconProps = {
  size?: number;
  color?: string;
};

export function PlayIcon({ size = 24, color = "#FF3B30" }: PlayIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} opacity="0.1" />
      <Path
        d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z"
        fill={color}
      />
    </Svg>
  );
}
