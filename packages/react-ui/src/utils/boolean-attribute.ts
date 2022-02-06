export function parseBooleanAttribute(attributeValue?: string) {
    return attributeValue != undefined;
}

export function createBooleanAttribute(attributeValue?: boolean) {
    if (attributeValue) {
        return '';
    }
    return;
}
