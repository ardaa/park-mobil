import React from 'react';
import Svg, { Path, G, Rect } from 'react-native-svg';
import { IconProps } from './types';

export const MasterpassIcon: React.FC<IconProps> = ({ width = 70, height = 50, ...props }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 152.407 108" {...props}>
      <G>
        <Rect width={152.407} height={108} fill="none" />
        <G>
          {/* Orange center rectangle */}
          <Rect x={60.4117} y={25.6968} width={31.5} height={56.6064} fill="#ff5f00" />
          
          {/* Left red circle */}
          <Path
            d="M62.412 54a35.938 35.938 0 0113.75-28.303 36 36 0 100 56.606A35.938 35.938 0 0162.412 54"
            fill="#eb001b"
          />
          
          {/* Right orange circle */}
          <Path
            d="M134.407 54a35.999 35.999 0 01-58.245 28.303 36.005 36.005 0 000-56.606A35.999 35.999 0 01134.407 54"
            fill="#f79e1b"
          />
          
          {/* Small text marks */}
          <Path
            d="M130.972 76.308v-1.159h.467v-.236h-1.19v.236h.468v1.159h.255zm2.31 0v-1.397h-.364l-.42.961-.42-.961h-.365v1.397h.258v-1.054l.394.909h.267l.393-.911v1.056h.257z"
            fill="#f79e1b"
          />
        </G>
      </G>
    </Svg>
  );
};
