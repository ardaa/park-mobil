import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function GoogleLogo(props: { size?: number; color?: string }) {
  const { size = 24, color = "#FFF" } = props;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.35 10.04H12v3.92h5.31c-.49 2.37-2.54 4.04-5.31 4.04-3.31 0-6-2.69-6-6s2.69-6 6-6c1.49 0 2.85.55 3.9 1.45l2.78-2.78C17.14 3.19 14.71 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10 0-.66-.07-1.31-.19-1.92l-0.46-.04z"
        fill={color}
      />
    </Svg>
  );
} 