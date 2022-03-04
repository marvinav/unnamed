import 'regenerator-runtime/runtime';
import { IcyCastReader } from './';

import { sample } from './sample.mock';

function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let index = 0; index < length; index++) {
        bytes[index] = binaryString.codePointAt(index);
    }
    return bytes;
}

function createIcyHeader(header: string) {
    const headerArray = [...header].map((x) => x.codePointAt(0));
    const result = new Uint8Array(Math.ceil(headerArray.length / 16) * 16 + 1);
    result.set([Math.ceil(headerArray.length / 16)], 0);
    result.set(headerArray, 1);
    const nullBytesLength = headerArray.length % 16;
    if (nullBytesLength > 0) {
        result.set(Array.from<number>({ length: 16 - nullBytesLength }).fill(0), headerArray.length + 1);
    }
    return result;
}

it('Convert sample to Uint8Array', () => {
    const testSample = base64ToArrayBuffer(sample);
    expect(testSample.length).toBe(528_216);
});

it('Convert song title to Uint8Array', () => {
    const titleFull = '1234567890123456';
    const titleShouldBeFilledHigh = '1234567890123456789';
    const titleShouldBeFilledLow = '1234567';
    expect(createIcyHeader(titleFull).length).toBe(17);
    expect(createIcyHeader(titleFull)[0]).toBe(1);
    expect(createIcyHeader(titleShouldBeFilledHigh).length).toBe(33);
    expect(createIcyHeader(titleShouldBeFilledLow).length).toBe(17);
});

test('Read file all in one chunk class', async () => {
    const testSample = base64ToArrayBuffer(sample);
    let position = 0;
    const icyInt = 8000;
    const titles = ['first-title', 'second-title'];
    const firstTitleArray = createIcyHeader(titles[0]);
    const firstTitleName = String.fromCharCode.apply(undefined, firstTitleArray.slice(1));
    const secondTitleArray = createIcyHeader(titles[1]);
    const secondTitleName = String.fromCharCode.apply(undefined, secondTitleArray.slice(1));
    const secondTitleStart = testSample.length / 2;

    const totalIcesHeaders = Math.floor(testSample.length / icyInt);
    const totalIcesHeadersLength = firstTitleArray.length + secondTitleArray.length + totalIcesHeaders - 2;

    const icyBuffer = new Uint8Array(totalIcesHeadersLength + testSample.length);
    const insertedHeaders: Uint8Array[] = [];

    let offset = 0;

    for (let index = 0; index < totalIcesHeaders; index++) {
        const header = index * icyInt > secondTitleStart ? secondTitleArray : firstTitleArray;
        const alreadyInserted = insertedHeaders.find((x) => x === header);
        const headerToInsert = alreadyInserted ? [0] : header;
        if (!alreadyInserted) {
            insertedHeaders.push(header);
        }
        icyBuffer.set(testSample.slice(icyInt * index, icyInt * (index + 1)), offset);
        offset += icyInt;
        icyBuffer.set(headerToInsert, offset);
        offset += headerToInsert.length;
    }
    icyBuffer.set(testSample.slice(icyInt * totalIcesHeaders), offset);

    expect(icyBuffer[1]).toBe(testSample[1]);
    expect(icyBuffer[7994]).toBe(testSample[7994]);
    expect(icyBuffer[7999]).toBe(testSample[7999]);
    expect(icyBuffer[8000]).toBe(firstTitleArray[0]);
    expect(icyBuffer[8001]).toBe(firstTitleArray[1]);
    expect(icyBuffer[8000 + firstTitleArray.length]).toBe(testSample[8000]);
    expect(icyBuffer[8000 + firstTitleArray.length + 1]).toBe(testSample[8001]);
    expect(icyBuffer[16_000 + firstTitleArray.length]).toBe(0);
    expect(icyBuffer[16_000 + firstTitleArray.length + 1]).toBe(testSample[16_000]);
    expect(icyBuffer[16_000 + firstTitleArray.length + 2]).toBe(testSample[16_001]);
    expect(icyBuffer[16_000 + firstTitleArray.length + 3]).toBe(testSample[16_002]);
    expect(icyBuffer[icyBuffer.length - 1]).toBe(testSample[testSample.length - 1]);

    let sendBytesLength = 0;
    const read = async () => {
        const rndChunkSize = icyBuffer.length + 10;
        const end = position + rndChunkSize >= icyBuffer.length ? icyBuffer.length : position + rndChunkSize;
        const result = new Uint8Array(end - position);
        result.set(icyBuffer.slice(position, end));
        position += rndChunkSize;
        sendBytesLength += result.length;
        return {
            value: result,
            done: position >= icyBuffer.length,
        };
    };

    const mockFetch = async (_info: RequestInfo, _init: RequestInit) => {
        const headers = new Headers();
        headers.set('icy-metaint', icyInt.toString());
        return {
            headers,
            body: {
                getReader: () => {
                    return { read };
                },
            },
        } as Response;
    };

    global.fetch = mockFetch;
    const cast = new IcyCastReader('https://localhost', undefined);

    let totalLength = 0;
    const receivedBuffer = new Uint8Array(testSample.length);
    const wrap = async () => {
        return new Promise<{ received: number; send: number }>(function (resolve, _reject) {
            cast.start(async (b, h) => {
                expect(h).toBe(totalLength >= secondTitleStart ? secondTitleName : firstTitleName);
                receivedBuffer.set(b, totalLength);
                totalLength += b.length;
            }, resolve);
        });
    };

    const { received, send } = await wrap();
    expect(received).toBe(icyBuffer.length);
    expect(send).toBe(testSample.length);
    expect(sendBytesLength).toBe(icyBuffer.length);
    expect(totalLength).toBe(testSample.length);
    for (const [index, element] of receivedBuffer.entries()) {
        expect(element).toBe(testSample[index]);
    }
});
