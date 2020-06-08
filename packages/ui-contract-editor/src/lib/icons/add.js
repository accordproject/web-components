import React from 'react';

export const type = () => 'addList';

export const icon = hovering => (
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="conditional-icon-default" transform="translate(2.000000, 1.000000)" fillRule="nonzero">
            <g id="Oval">
                <use fill="black" fillOpacity="1" filter="url(#filter-2)" xlinkHref="#path-1"></use>
                <circle stroke={hovering ? '#949CA2' : '#B5BABE '} strokeWidth="1" strokeLinejoin="square" fill={hovering ? '#949CA2' : '#FFFFFF'} fillRule="evenodd" cx="7" cy="7" r="6.5"></circle>
            </g>
            <polygon id="+-copy" fill={hovering ? '#FFFFFF' : '#949CA2'} points="6.24723247 6.24723247 6.24723247 3 7.75276753 3 7.75276753 6.24723247 11 6.24723247 11 7.75276753 7.75276753 7.75276753 7.75276753 11 6.24723247 11 6.24723247 7.75276753 3 7.75276753 3 6.24723247"></polygon>
        </g>
    </g>
);
