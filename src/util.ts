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

import moment, {Moment} from 'moment';

export const cloneDate = (md: Moment): Moment => {
    return moment(`${md.format('MM')}-${md.format('DD')}-${md.format('YYYY')}`, 'MM-DD-YYYY');
};

export const sameDate = (md1: Moment, md2: Moment): boolean => {
    return `${md1.format('MM')}-${md1.format('DD')}-${md1.format('YYYY')}` === `${md2.format('MM')}-${md2.format('DD')}-${md2.format('YYYY')}`;
};

export const BACK_ICON = `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 34.980469 3.992188 C 34.71875 3.996094 34.472656 4.105469 34.292969 4.292969 L 14.292969 24.292969 C 13.902344 24.683594 13.902344 25.316406 14.292969 25.707031 L 34.292969 45.707031 C 34.542969 45.96875 34.917969 46.074219 35.265625 45.980469 C 35.617188 45.890625 35.890625 45.617188 35.980469 45.265625 C 36.074219 44.917969 35.96875 44.542969 35.707031 44.292969 L 16.414063 25 L 35.707031 5.707031 C 36.003906 5.417969 36.089844 4.980469 35.929688 4.601563 C 35.769531 4.21875 35.394531 3.976563 34.980469 3.992188 Z"/></svg>`;
export const FORWARD_ICON = `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 14.988281 3.992188 C 14.582031 3.992188 14.21875 4.238281 14.0625 4.613281 C 13.910156 4.992188 14 5.421875 14.292969 5.707031 L 33.585938 25 L 14.292969 44.292969 C 14.03125 44.542969 13.925781 44.917969 14.019531 45.265625 C 14.109375 45.617188 14.382813 45.890625 14.734375 45.980469 C 15.082031 46.074219 15.457031 45.96875 15.707031 45.707031 L 35.707031 25.707031 C 36.097656 25.316406 36.097656 24.683594 35.707031 24.292969 L 15.707031 4.292969 C 15.519531 4.097656 15.261719 3.992188 14.988281 3.992188 Z"/></svg>`;
export const DOWN_ICON = `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 44.988281 13.984375 C 44.726563 13.992188 44.476563 14.101563 44.292969 14.292969 L 25 33.585938 L 5.707031 14.292969 C 5.519531 14.097656 5.261719 13.992188 4.992188 13.988281 C 4.582031 13.992188 4.21875 14.238281 4.0625 14.613281 C 3.910156 14.992188 4 15.421875 4.292969 15.707031 L 24.292969 35.707031 C 24.683594 36.097656 25.316406 36.097656 25.707031 35.707031 L 45.707031 15.707031 C 46.003906 15.421875 46.09375 14.980469 45.9375 14.601563 C 45.777344 14.222656 45.402344 13.976563 44.988281 13.984375 Z"/></svg>`;

export const doNothing = (o?: any) => {
    return o;
};
