//  COPYRIGHT:       PrimeObjects Software Inc. (C) 2018 All Right Reserved
//  COMPANY URL:     http://www.primeobjects.com/
//  CONTACT:         developer@primeobjects.com
//
//  This source is subject to the PrimeObjects License Agreements.
//
//  Our EULAs define the terms of use and license for each PrimeObject product.
//  Whenever you install a PrimeObject product or research PrimeObjects source code file, you will be prompted to review and accept the terms of our EULA.
//  If you decline the terms of the EULA, the installation should be aborted and you should remove any and all copies of our products and source code from your computer.
//  If you accept the terms of our EULA, you must abide by all its terms as long as our technologies are being employed within your organization and within your applications.
//
//  THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY
//  OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT
//  LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
//  FITNESS FOR A PARTICULAR PURPOSE.
//
//  ALL OTHER RIGHTS RESERVED
//
//  This base component is a template component that is provided from the platform
//  All app specific features should be provided in a seperate component that extends this base component

import React from 'react';
import {Text, View, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {COLORS} from 'primeobjects-helper-util';
import moment, {Moment} from 'moment';

export const cloneDate = (md: Moment): Moment => {
    return moment(`${md.format('MM')}-${md.format('DD')}-${md.format('YYYY')}`, 'MM-DD-YYYY');
};

export const sameDate = (md1: Moment, md2: Moment): boolean => {
    return `${md1.format('MM')}-${md1.format('DD')}-${md1.format('YYYY')}` === `${md2.format('MM')}-${md2.format('DD')}-${md2.format('YYYY')}`;
};

export type TIndicatorCode = 'empty' | 'filled' | 'full';

const STYLES: any = {
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY[100]
    },
    cell: {
        minHeight: 36,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    curMonthDay: {backgroundColor: COLORS.WHITE},
    otherMonthDay: {backgroundColor: COLORS.GRAY[100]},
    dayHeader: {
        flex: 1,
        color: COLORS.GRAY[800],
        fontSize: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    dayCell: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6
    },
    day: {
        flex: 2,
        color: COLORS.GRAY[800],
        fontSize: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 3,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 25
    },
    weekHeaderRow: {},
    dayRow: {},
    indicator: {
        position: 'absolute',
        right: 5,
        top: 5,
        borderRadius: 5,
        width: 5,
        height: 5
    }
};

export type TWeekViewProps = {
    type: 'header' | 'row';
    onClickDay?: (d: Moment) => void;
    getIndicatorCode?: (d: Moment) => TIndicatorCode;
    date?: Moment;
    curMonth?: string;
    curDate?: Moment;
    selDate?: Moment;
    dayStyle?: StyleProp<ViewStyle>;
    onLayout?: (layout: {x: number; y: number; width: number; height: number}) => void;
};

export const WeekView = (props: TWeekViewProps) => {
    const {type} = props;
    const today = moment();
    const selDate = props.selDate ? props.selDate : today;
    const curMonth = props.curMonth ? props.curMonth : today.format('MM');
    const date = props.date ? props.date : today;

    const onClickDay = (d: Moment) => {
        props.onClickDay && props.onClickDay(d);
    };

    const getIndicatorStyle = (indicator: TIndicatorCode) => {
        switch (indicator) {
            case 'full': {
                return {backgroundColor: COLORS.GREEN['800']};
            }
            case 'filled': {
                return {backgroundColor: COLORS.RED['800']};
            }
            default: {
                //empty
                return {backgroundColor: 'transparent'};
            }
        }
    };

    const onLayout = (event: any) => {
        const {x, y, width, height} = event.nativeEvent.layout;
        props.onLayout && props.onLayout({x, y, width, height});
    };

    const renderWeek = (d: Moment) => {
        d.add(d.isoWeekday() === 7 ? -1 : -d.isoWeekday() - 1, 'days');
        const v = [];
        for (let i = 0; i < 7; i++) {
            d.add(1, 'days');
            const md = cloneDate(d);
            const indicator = props.getIndicatorCode ? props.getIndicatorCode(md) : 'empty';
            const isSelDay = sameDate(selDate, md);
            const isToday = sameDate(moment(), md);
            const textStyle = [STYLES.day, props.dayStyle, (isToday || isSelDay) && {color: COLORS.WHITE}];

            v.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => onClickDay(md)}
                    style={[
                        STYLES.cell,
                        md.format('MM') === curMonth ? STYLES.curMonthDay : STYLES.otherMonthDay,
                        isSelDay && {backgroundColor: COLORS.SKY[600]},
                        isToday && {backgroundColor: COLORS.GREEN[600]}
                    ]}
                >
                    <View style={[STYLES.dayCell]}>
                        {/* <View style={{flex: 1, paddingTop: 0, paddingBottom: 0}} /> */}
                        <Text style={textStyle}>{md.format('DD')}</Text>
                        {/* <View style={{flex: 1, paddingTop: 0, paddingBottom: 0}} /> */}
                    </View>
                    <View style={[STYLES.indicator, getIndicatorStyle(indicator)]}></View>
                </TouchableOpacity>
            );
        }

        return (
            <View style={{...STYLES.row, ...STYLES.dayRow}} onLayout={onLayout}>
                {v}
            </View>
        );
    };

    return type == 'header' ? (
        <View style={{...STYLES.row, ...STYLES.weekHeaderRow}} onLayout={onLayout}>
            <View style={STYLES.cell}>
                <Text style={STYLES.dayHeader}>S</Text>
            </View>
            <View style={STYLES.cell}>
                <Text style={STYLES.dayHeader}>M</Text>
            </View>
            <View style={STYLES.cell}>
                <Text style={STYLES.dayHeader}>T</Text>
            </View>
            <View style={STYLES.cell}>
                <Text style={STYLES.dayHeader}>W</Text>
            </View>
            <View style={STYLES.cell}>
                <Text style={STYLES.dayHeader}>T</Text>
            </View>
            <View style={STYLES.cell}>
                <Text style={STYLES.dayHeader}>F</Text>
            </View>
            <View style={STYLES.cell}>
                <Text style={STYLES.dayHeader}>S</Text>
            </View>
        </View>
    ) : (
        renderWeek(cloneDate(date))
    );
};

export default WeekView;
