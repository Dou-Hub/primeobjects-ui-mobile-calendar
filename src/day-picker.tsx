//  COPYRIGHT:       PrimeObjects Software Inc. (C) 2022 All Right Reserved
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

import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {Text, View, TouchableOpacity, StyleProp, ViewStyle, FlatList, TextStyle, LayoutChangeEvent, ScrollView} from 'react-native';
import {COLORS, doNothing} from 'primeobjects-helper-util';
import Week, {TIndicatorCode} from './week';
import {cloneDeep, isNil, ceil, map} from 'lodash';
import moment, {Moment} from 'moment';
import GestureRecognizer from 'react-native-swipe-gestures';
import Icon from './controls/icon';
import {BACK_ICON, DOWN_ICON, FORWARD_ICON} from './util';

export const weekCount = (year: number, month: number) => {
    var firstOfMonth = new Date(year, month - 1, 1);
    var lastOfMonth = new Date(year, month, 0);
    var used = firstOfMonth.getDay() + lastOfMonth.getDate();
    return ceil(used / 7);
};

const STYLES: Record<string, StyleProp<ViewStyle | TextStyle>> = {
    wrapper: {borderBottomWidth: 1, borderBottomColor: COLORS.GRAY[100], borderTopWidth: 1, borderTopColor: COLORS.GRAY[100]},
    backwardButton: {width: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: COLORS.GRAY['100']},
    forwardButton: {width: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: COLORS.GRAY['100']},
    calendarWrapper: {flexDirection: 'row', backgroundColor: COLORS.WHITE},
    monthHeaderWrapper: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.GRAY['100']},
    monthHeader: {textAlign: 'center', color: COLORS.GRAY['800'], fontSize: 14, fontWeight: 'bold'},
    monthInput: {width: 40, marginBottom: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0},
    yearInput: {width: 60, marginLeft: 10, marginBottom: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0},
    gestureRecognizer: {flex: 1, flexDirection: 'column'},
    headerEditButton: {paddingLeft: 10, paddingTop: 7, paddingBottom: 5, paddingRight: 10, justifyContent: 'center'},
    selector: {flex: 1, flexDirection: 'row', margin: 8, padding: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center'},
    header: {alignItems: 'center', flexDirection: 'row', height: 36},
    headerBackButton: {alignItems: 'center', justifyContent: 'center', height: '100%', padding: 10, paddingLeft: 0},
    headerTitle: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%', paddingRight: 30},
    headerText: {flex: 1, fontSize: 18, color: COLORS.GRAY[900], justifyContent: 'center', textAlign: 'center'}
};

export type TViewChangeAction = 'future' | 'past' | 'year' | 'month' | 'date';

export type TDayPickerProps = {
    showMonthHeader?: boolean;
    curDate?: Moment;
    selDate?: Moment;
    onChangeView?: (action: TViewChangeAction, d: Moment) => void;
    onSelectDate?: (d: Moment) => void;
    getIndicatorCode?: (d: Moment) => TIndicatorCode;
    onLayout?: (event: LayoutChangeEvent) => void;
    wrapperStyle?: StyleProp<ViewStyle>;
    dayStyle?: StyleProp<ViewStyle>;
    monthHeaderWrapperStyle?: StyleProp<ViewStyle>;
    monthHeaderStyle?: StyleProp<ViewStyle>;
    monthlyView?: boolean;
    startYear?: number;
    endYear?: number;
};

export const DayPicker = (props: TDayPickerProps) => {
    const {dayStyle} = props;
    const showMonthHeader = props.showMonthHeader ? props.showMonthHeader : true;
    const today = moment();
    const [curDate, setCurDate] = useState(props.curDate ? props.curDate : today);
    const [selDate, setSelDate] = useState(props.selDate ? props.selDate : today);
    const [height, setHeight] = useState(0);
    const [editView, setEditView] = useState('day');
    const [monthlyView, setMonthlyView] = useState(props.monthlyView == true);

    const startYear = props.startYear && props.startYear > 1900 ? props.startYear : 1950;
    const endYear = props.endYear && props.endYear > startYear ? props.endYear : 2050;
    const curMonth = curDate.format('MM');
    const yearFlatList = useRef(null);

    const monthHeaderWrapperStyle = [STYLES.monthHeaderWrapper, props.monthHeaderWrapperStyle];
    const totalWeeks = weekCount(parseInt(curDate.format('YYYY')), parseInt(curDate.format('MM')));

    // console.log({DayPickerCurDate: curDate.format('LLLL')});

    useEffect(() => {
        if (editView == 'year' && yearFlatList.current) {
            const yearIndex = ceil((curDate.toDate().getFullYear() - startYear) / 3) - 1;
            const yearOffset = (yearIndex < 0 ? 0 : yearIndex) * 53;

            (yearFlatList.current as any).scrollTo({x: 0, y: yearOffset, animated: true});
        }
    }, [editView, yearFlatList.current]);

    const onSelectDate = (newDate: Moment) => {
        setSelDate(newDate);
        props.onSelectDate && props.onSelectDate(newDate);
    };

    const onChangeView = (action: TViewChangeAction, newDate: Moment) => {
        setCurDate(newDate);
        props.onChangeView && props.onChangeView(action, newDate);
    };

    const goFuture = () => {
        let newDate = cloneDeep(curDate);
        if (monthlyView) {
            newDate.add(1, 'months');
        } else {
            newDate.add(14, 'days');
        }
        onChangeView('future', newDate);
    };

    const goPast = () => {
        let newDate = cloneDeep(curDate);
        if (monthlyView) {
            newDate.add(-1, 'months');
        } else {
            newDate.add(-14, 'days');
        }

        onChangeView('past', newDate);
    };

    const onClickDay = (newSelDate: Moment) => {
        onChangeView('date', newSelDate);
        onSelectDate(newSelDate);
    };

    const onLayoutDailyPicker = (event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        setHeight(height);
    };

    const renderMonthView = () => {
        if (!monthlyView) return null;
        const startDate = moment(`${curDate.format('MM')}-01-${curDate.format('YYYY')}`, 'MM-DD-YYYY');

        return [
            <Week
                type="row"
                getIndicatorCode={props.getIndicatorCode}
                dayStyle={dayStyle}
                key={'week1'}
                curDate={curDate}
                selDate={selDate}
                date={cloneDeep(startDate)}
                curMonth={curMonth}
                onClickDay={onClickDay}
            />,
            <Week
                type="row"
                getIndicatorCode={props.getIndicatorCode}
                dayStyle={dayStyle}
                key={'week2'}
                curDate={curDate}
                selDate={selDate}
                date={cloneDeep(startDate).add(7, 'days')}
                curMonth={curMonth}
                onClickDay={onClickDay}
            />,
            <Week
                type="row"
                getIndicatorCode={props.getIndicatorCode}
                dayStyle={dayStyle}
                key={'week3'}
                curDate={curDate}
                selDate={selDate}
                date={cloneDeep(startDate).add(14, 'days')}
                curMonth={curMonth}
                onClickDay={onClickDay}
            />,
            <Week
                type="row"
                getIndicatorCode={props.getIndicatorCode}
                dayStyle={dayStyle}
                key={'week4'}
                curDate={curDate}
                selDate={selDate}
                date={cloneDeep(startDate).add(21, 'days')}
                curMonth={curMonth}
                onClickDay={onClickDay}
            />,
            totalWeeks >= 5 && (
                <Week
                    type="row"
                    getIndicatorCode={props.getIndicatorCode}
                    dayStyle={dayStyle}
                    key={'week5'}
                    curDate={curDate}
                    selDate={selDate}
                    date={cloneDeep(startDate).add(28, 'days')}
                    curMonth={curMonth}
                    onClickDay={onClickDay}
                />
            ),
            totalWeeks >= 6 && (
                <Week
                    type="row"
                    getIndicatorCode={props.getIndicatorCode}
                    dayStyle={dayStyle}
                    key={'week6'}
                    curDate={curDate}
                    selDate={selDate}
                    date={cloneDeep(startDate).add(35, 'days')}
                    curMonth={curMonth}
                    onClickDay={onClickDay}
                />
            )
        ];
    };

    const renderWeeksView = () => {
        if (monthlyView) return null;
        return [
            <Week
                type="row"
                getIndicatorCode={props.getIndicatorCode}
                dayStyle={dayStyle}
                key={'week1'}
                curDate={curDate}
                selDate={selDate}
                date={cloneDeep(curDate).add(-7, 'days')}
                curMonth={curMonth}
                onClickDay={onClickDay}
            />,
            <Week
                type="row"
                getIndicatorCode={props.getIndicatorCode}
                dayStyle={dayStyle}
                key={'week2'}
                curDate={curDate}
                selDate={selDate}
                date={cloneDeep(curDate)}
                curMonth={curMonth}
                onClickDay={onClickDay}
            />
        ];
    };

    const renderMonthHeader = () => {
        return (
            showMonthHeader && (
                <View style={monthHeaderWrapperStyle}>
                    <TouchableOpacity onPress={onClickEditMonth}>
                        <Text style={STYLES.headerText}>{`${curDate.format('MMMM')}`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.headerEditButton as any} onPress={onClickEditMonth}>
                        <Icon xml={DOWN_ICON} size={16} fill={COLORS.GRAY['300']} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClickEditYear}>
                        <Text style={STYLES.headerText}>{`${curDate.format('YYYY')}`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.headerEditButton as any} onPress={onClickEditYear}>
                        <Icon xml={DOWN_ICON} size={16} fill={COLORS.GRAY['300']} />
                    </TouchableOpacity>
                </View>
            )
        );
    };

    const onClickEditMonth = () => {
        setEditView('month');
    };

    const onClickEditYear = () => {
        setEditView('year');
    };

    const toggleDayPickerView = () => {
        setMonthlyView(!monthlyView);
    };

    const renderDaySelector = () => {
        return (
            editView == 'day' && (
                <View style={[STYLES.calendarWrapper]} onLayout={onLayoutDailyPicker}>
                    <TouchableOpacity style={STYLES.backwardButton} onPress={goPast}>
                        <Icon xml={BACK_ICON} size={26} fill={COLORS.GRAY['300']} />
                    </TouchableOpacity>
                    <View style={STYLES.gestureRecognizer}>
                        {renderMonthHeader()}
                        <GestureRecognizer
                            onSwipeUp={goFuture}
                            onSwipeDown={goPast}
                            onSwipeLeft={goFuture}
                            onSwipeRight={goPast}
                            config={{
                                velocityThreshold: 0.2,
                                directionalOffsetThreshold: 50
                            }}
                            style={STYLES.gestureRecognizer}
                        >
                            <Week dayStyle={dayStyle} type="header" />
                            {renderMonthView()}
                            {renderWeeksView()}
                        </GestureRecognizer>
                        <TouchableOpacity style={{padding: 10, alignItems: 'center'}} onPress={toggleDayPickerView}>
                            <View style={{backgroundColor: COLORS.GRAY['200'], width: 30, height: 5}} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={STYLES.forwardButton} onPress={goFuture}>
                        <Icon xml={FORWARD_ICON} size={26} fill={COLORS.GRAY['300']} />
                    </TouchableOpacity>
                </View>
            )
        );
    };

    const onClickMonth = (newMonth: number) => {
        const newDate = cloneDeep(curDate);
        newDate.month(newMonth);
        setEditView('day');
        onChangeView('month', newDate);
    };

    const onClickYear = (newYear: number) => {
        const newDate = cloneDeep(curDate);
        newDate.year(newYear);
        setEditView('month');
        onChangeView('year', newDate);
    };

    const renderMonthSelector = () => {
        return (
            editView == 'month' && (
                <View style={[STYLES.calendarWrapper, {flexDirection: 'column', padding: 10}, !monthlyView && {height: 165}]}>
                    <View style={STYLES.header}>
                        <TouchableOpacity
                            style={STYLES.headerBackButton}
                            onPress={() => {
                                setEditView('day');
                            }}
                        >
                            <Icon xml={BACK_ICON} size={18} fill={COLORS.GRAY['300']} />
                        </TouchableOpacity>
                        <View style={STYLES.headerTitle}>
                            <Text style={STYLES.headerText}>Please select a month</Text>
                        </View>
                    </View>
                    <FlatList
                        data={moment.monthsShort()}
                        renderItem={({item, index}) => {
                            const isCurMonth = parseInt(curDate.format('MM')) == index + 1;
                            return (
                                <TouchableOpacity
                                    style={[STYLES.selector, isCurMonth ? {borderColor: COLORS.SKY['400'], backgroundColor: COLORS.SKY['300']} : {borderColor: COLORS.GRAY['100']}]}
                                    onPress={() => onClickMonth(index)}
                                >
                                    <Text style={isCurMonth ? {color: COLORS.WHITE, fontWeight: '700'} : {fontWeight: '400', color: COLORS.GRAY['600']}}>{item}</Text>
                                </TouchableOpacity>
                            );
                        }}
                        //Setting the number of column
                        numColumns={3}
                        keyExtractor={(item, index) => {
                            doNothing(item);
                            return `${index}`;
                        }}
                    />
                </View>
            )
        );
    };

    const renderYears = () => {
        const rows = [];
        for (let i = 0; i < endYear - startYear; i = i + 3) {
            rows.push(
                <View style={{flexDirection: 'row'}}>
                    {map([1, 2, 3], (item, index) => {
                        const isCurYear = parseInt(curDate.format('YYYY')) == i + index + startYear;
                        doNothing(item);
                        return (
                            <TouchableOpacity
                                key={`${i + index}`}
                                style={[STYLES.selector, isCurYear ? {borderColor: COLORS.SKY['400'], backgroundColor: COLORS.SKY['300']} : {borderColor: COLORS.GRAY['100']}]}
                                onPress={() => onClickYear(i + index + startYear)}
                            >
                                <Text style={isCurYear ? {color: COLORS.WHITE, fontWeight: '700'} : {fontWeight: '400', color: COLORS.GRAY['600']}}>{startYear + i + index}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }
        return rows;
    };

    const renderYearSelector = () => {
        // const yearIndexNumber = ceil((curDate.toDate().getFullYear() - startYear) / 3) - 2;
        // const yearIndex = yearIndexNumber < 0 ? 0 : yearIndexNumber;
        // console.log({yearIndex, endYear, startYear});

        return (
            editView == 'year' && (
                <View style={[STYLES.calendarWrapper, {padding: 10, flexDirection: 'column'}, !monthlyView && {height: 165}]}>
                    <View style={STYLES.header}>
                        <TouchableOpacity
                            style={STYLES.headerBackButton}
                            onPress={() => {
                                setEditView('day');
                            }}
                        >
                            <Icon xml={BACK_ICON} size={18} fill={COLORS.GRAY['300']} />
                        </TouchableOpacity>
                        <View style={STYLES.headerTitle}>
                            <Text style={STYLES.headerText}>Please select a year</Text>
                        </View>
                    </View>
                    <ScrollView
                        ref={ref => {
                            if (!isNil(ref)) {
                                yearFlatList.current = ref as any;
                            }
                        }}
                        style={{flexDirection: 'column', height: height - 85}}
                    >
                        {renderYears()}
                    </ScrollView>
                </View>
            )
        );
    };

    const onLayout = (event: LayoutChangeEvent) => {
        props.onLayout && props.onLayout(event);
    };

    return (
        <View style={[STYLES.wrapper, props.wrapperStyle]} onLayout={onLayout}>
            {renderDaySelector()}
            {renderMonthSelector()}
            {renderYearSelector()}
        </View>
    );
};

export default DayPicker;
