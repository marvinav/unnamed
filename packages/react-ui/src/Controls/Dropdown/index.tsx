import React, { ReactElement, ReactNode, useMemo, useRef, useState } from 'react';

export interface DropdownProperties {
    isOpen?: boolean;
    container: HTMLElement;
    containerRoot?: HTMLElement;
}

export const Dropdown: React.FC<DropdownProperties> = ({ children, isOpen = false, container }) => {
    const [coordinates, setCoordinates] = useState<{ x: number; y: number } | undefined>();
    const reference = useRef();

    React.useEffect(() => {
        if (container && isOpen) {
            setCoordinates({ x: container.offsetLeft, y: container.offsetTop });
        }
    }, [container, isOpen]);

    const style = useMemo<React.HTMLAttributes<HTMLDivElement>['style']>(() => {
        return coordinates
            ? {
                  position: 'absolute',
                  left: `${coordinates.x}px`,
                  top: `${coordinates.y}px`,
                  zIndex: 1000,
              }
            : {
                  display: 'none',
              };
    }, [coordinates]);

    return (
        isOpen && (
            <div ref={reference} style={style}>
                {children}
            </div>
        )
    );
};
