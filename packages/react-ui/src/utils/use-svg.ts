import dompurify from 'dompurify';
import { useState } from 'react';

export interface UseSvgProperties {
    src: string;
}

export const useSvg: (properties: UseSvgProperties) => SVGSVGElement = ({ src }) => {
    const [svg] = useState(
        replaceFill(new DOMParser().parseFromString(dompurify.sanitize(src), 'image/svg+xml').firstElementChild),
    );

    return svg;
};

function replaceFill(document_: SVGSVGElement | Element) {
    if (document_.nodeName === 'svg') {
        document_.setAttribute('preserveAspectRatio', 'none');
        document_.setAttribute('width', '100%');
        document_.setAttribute('height', '100%');
        document_.removeAttribute('id');
    } else if (document_.nodeName === 'path' && document_.getAttribute('fill') != 'none') {
        document_.setAttribute('fill', 'currentColor');
    }
    for (const ch in document_.children) {
        replaceFill(document_.children[ch]);
    }
    return document_ as SVGSVGElement;
}
