import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SvgXml as SvgImage} from 'react-native-svg';

export type TIconProps = {
    size?: number;
    xml: string;
    opacity?: number;
    style?: StyleProp<ViewStyle>;
    fill?: string;
};

export const Icon = (props: TIconProps) => {
    const {size, xml, opacity, style, fill} = props;
    return <SvgImage xml={xml} width={size ? size : '100%'} height={size ? size : '100%'} fillOpacity={opacity ? opacity : 1} fill={fill ? fill : undefined} style={{...(style as any)}} />;
};

export default Icon;
