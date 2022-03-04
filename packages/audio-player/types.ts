import { AudioPlayer as AudioPlayerImplementation } from './lib/audio-player';

export type AudioPlayer = AudioPlayerImplementation;

export type ITrack = IcyCastTrack | Mp3Track;

export type Events = 'mode-changed' | 'playlist-changed' | 'track-start' | 'track-end' | 'state-changed';

export type WithoutOptionEvent = null;

export type ModeChangedEvent = AudioPlayer['_mode'];

export type StateChangedEvent = AudioPlayer['_state'];

export type PlaylistMetaChangedSubEvent = 'playlist-meta-changed';
export type PlaylistTracksChangedSubEvent = 'playlist-tracks-changed';
export type PlaylistAttachedSubEvent = 'playlist-attached';

export type PlaylistChangedEvent =
    | PlaylistAttachedSubEvent
    | PlaylistMetaChangedSubEvent
    | PlaylistTracksChangedSubEvent;

export type GetEventOption<T extends Events> = T extends 'state-changed'
    ? StateChangedEvent
    : T extends 'mode-changed'
    ? ModeChangedEvent
    : T extends 'playlist-changed'
    ? PlaylistChangedEvent
    : undefined;

export type EventHandler<T extends Events> = (event_: T, option: GetEventOption<T>) => Promise<void> | void;

export interface BaseTrack {
    /**
     * Absolute file to path
     */
    path: string;

    /**
     * Total duration of file in ms.
     */
    duration?: number;

    /**
     * Media Metadata
     */
    mediaMetadata: Partial<MediaMetadata>;

    /**
     * Flag if it can be recorder
     */
    recordable: boolean;

    /**
     * The mime type of file
     */
    mimeType: string;
}

export interface Mp3Track extends BaseTrack {
    mimeType: 'mp3';
    recordable: false;
}

export interface IcyCastTrack extends BaseTrack {
    mimeType: 'icy-cast';
    recordable: true;
}

export interface IPlaylist {
    name: string;
    path: string;
    updatedAt: Date;
    tracks: ITrack[];
}

export interface TrackProcessor<T extends ITrack> {
    type: T['mimeType'];
    play: (context: AudioContext, node: GainNode, track: T, onEnd?: () => Promise<void>) => Promise<void>;
    stop: () => Promise<void>;
    pause: () => Promise<void>;
}
