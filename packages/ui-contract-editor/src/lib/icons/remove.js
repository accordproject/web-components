import React from 'react';

export const type = () => 'removeList';

export const icon = hovering => (
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="conditional-icon-default" transform="translate(2.000000, 1.000000)" fillRule="nonzero">
            <g id="Oval">
                <use fill="black" fillOpacity="1" filter="url(#filter-2)" xlinkHref="#path-1"></use>
                <circle stroke={hovering ? '#949CA2' : '#B5BABE'} strokeWidth="1" strokeLinejoin="square" fill={hovering ? '#949CA2' : '#FFFFFF'} fillRule="evenodd" cx="7" cy="7" r="6.5"></circle>
            </g>
            <polygon xmlns="http://www.w3.org/2000/svg" id="+-copy" fill={hovering ? '#FFFFFF' : '#949CA2'} points="3 8 3 6 11.0000031 6 11.0000031 8"/>
        </g>
    </g>
);
