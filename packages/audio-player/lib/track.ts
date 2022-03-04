import { ITrack } from '../types';

export function cloneTrack(track: ITrack) {
    return { ...track, mediaMetadata: { ...track.mediaMetadata } };
}
