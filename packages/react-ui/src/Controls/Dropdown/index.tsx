import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface DropdownProperties {
    isOpen?: boolean;
    container: HTMLElement;
    containerRoot?: HTMLElement;
    width?: string;
}

const baseStyle: React.HTMLAttributes<HTMLDivElement>['style'] = {
    position: 'absolute',
    zIndex: 1000,
};

export const Dropdown: React.FC<DropdownProperties> = ({ children, isOpen = false, container, width }) => {
    const [style, setStyle] = useState<React.HTMLAttributes<HTMLDivElement>['style']>({
        visibility: 'hidden',
    });

    const setTop = useCallback(
        (style: { left: number }) => {
            const height = reference?.current?.clientHeight;

            setStyle({
                ...baseStyle,
                left: `${style?.left}px`,
                top: `${container.offsetTop - height}px`,
                visibility: 'visible',
            });
        },
        [container],
    );

    const setBottom = useCallback(
        (style: { left: number }) => {
            setStyle({
                ...baseStyle,
                left: `${style.left}px`,
                top: `${container.offsetTop + container.offsetHeight}px`,
                visibility: 'visible',
            });
        },
        [container],
    );

    const checkSpace = useCallback(() => {
        const height = reference?.current?.clientHeight;
        const clientWidth = reference?.current?.clientWidth;

        if (!container || height === undefined || clientWidth === undefined) {
            return;
        }

        const { top, bottom, width, x } = container.getBoundingClientRect();
        const center = x + width / 2;
        let leftClient = center - clientWidth / 2;
        leftClient = leftClient > 0 ? leftClient : 0;

        return {
            isUnder: top - height >= 0,
            isBottom: bottom + height <= window.innerHeight,
            left: leftClient,
        };
    }, [container]);

    const placeClient = useCallback(() => {
        if (isOpen) {
            const space = checkSpace();
            if (!space) {
                setStyle({ ...baseStyle, visibility: 'hidden' });
            }
            if (space.isUnder) {
                setTop(space);
            } else {
                setBottom(space);
            }
        } else {
            setStyle({ ...baseStyle, visibility: 'hidden' });
        }
    }, [checkSpace, setBottom, setTop, isOpen]);

    useEffect(() => {
        placeClient();
    }, [placeClient]);

    const onIntersection = useCallback(() => {
        placeClient();
    }, [placeClient]);

    const reference = useRef<HTMLDivElement>();

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection, { threshold: 0.99 });
        observer.observe(reference.current);
        return () => {
            observer.disconnect();
        };
    }, [onIntersection]);

    return (
        <div ref={reference} style={{ ...style, width }}>
            {children}
        </div>
    );
};
