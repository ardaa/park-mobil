import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Image } from "react-native";

export function ParketLogo(props: { size?: number; color?: string }) {
  /*
  <svg xmlns="http://www.w3.org/2000/svg" width="42.089" height="47.35" viewBox="0 0 42.089 47.35">
  <path id="Path_1" data-name="Path 1" d="M52.389,143.57s24.128-2.232,24.457,10.78c.417,16.491-23.289,13.6-23.289,13.6" transform="translate(-38.763 -139.378)" fill="none" stroke="#fff" stroke-width="8"/>
  <path id="Path_2" data-name="Path 2" d="M65.152,153.315s-15.371-1.6-19.378,5.666-2.635,24.855-2.635,24.855" transform="translate(-39.295 -136.758)" fill="none" stroke="#fff" stroke-width="7"/>
</svg>

  */
  const { size = 100, color = "#FFF" } = props;
  
  
  return (
    <Image 
        source={require('../../assets/images/logo-notext.png')} 
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
  );
} 