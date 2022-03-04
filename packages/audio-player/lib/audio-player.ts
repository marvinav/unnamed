import {
    EventHandler,
    Events,
    GetEventOption,
    IPlaylist,
    ITrack,
    PlaylistChangedEvent,
    TrackProcessor,
} from '../types';

import { Playlist } from './playlist';

/**
 * @class AudioPlayer
 */
export class AudioPlayer {
    private _mode: AudioPlayer['mode'] = 'none';
    private _defaultContext = new AudioContext();
    private _gainNode: GainNode;
    private _analyzer: AnalyserNode;
    private _playlist: Playlist;
    private readonly _processors: Record<ITrack['mimeType'], TrackProcessor<ITrack>> | Record<string, never>;

    private _subscriptions: {
        [key in Events | 'all']: Map<symbol, EventHandler<key extends Events ? key : Events>>;
    } = {
        'playlist-changed': new Map(),
        'track-end': new Map(),
        'track-start': new Map(),
        'mode-changed': new Map(),
        'state-changed': new Map(),
        all: new Map(),
    };

    private _currenTrack: {
        trackNumber: number;
        track: ITrack;
        position: number;
    };

    private _state: 'play' | 'stop' | 'pause';

    constructor(processors?: AudioPlayer['_processors']) {
        this._analyzer = this._defaultContext.createAnalyser();
        this._gainNode = this._defaultContext.createGain();
        this._gainNode.connect(this._analyzer);
        this._gainNode.connect(this._defaultContext.destination);
        this._processors = processors ?? {};
    }

    /**
     * Playlist track change mode
     */
    get mode(): 'loop' | 'loop-one' | 'none' {
        return this._mode;
    }

    /**
     * Get music player playlist
     */
    get playlist(): Playlist {
        return this._playlist;
    }

    /**
     * Get nodes
     */
    get nodes(): {
        analyzer: AnalyserNode;
        gain: GainNode;
    } {
        return {
            analyzer: this._analyzer,
            gain: this._gainNode,
        };
    }

    /**
     * Set Volume
     */
    setVolume(volume: number): void {
        console.log(volume);
        this._gainNode.gain.setValueAtTime(volume, 0);
    }

    /**
     * Get player current state
     * @returns Player state
     */
    get state(): {
        track: AudioPlayer['_currenTrack'];
        state: 'play' | 'stop' | 'pause';
    } {
        return {
            state: this._state,
            track: this._currenTrack,
        };
    }

    setMode(mode: AudioPlayer['mode']): void {
        if (mode != 'none') {
            throw new Error(`${mode} not implemented`);
        }
        this._mode = mode;
        this.notify('mode-changed', mode);
    }

    addProcessor(processor: TrackProcessor<ITrack>): void {
        this._processors[processor.type] = processor;
    }

    removeProcessor(mimeType: string): void {
        delete this._processors[mimeType];
    }

    /**
     * Set new playlist
     * If new playlist has different path or does not container current track, when will be call {@link AudioPlayer#stop}.
     *
     * @param playlist Playlist
     */
    setPlaylist = async (playlist: IPlaylist | Playlist): Promise<void> => {
        const currentTrack = playlist?.tracks?.findIndex((x) => {
            x.path === this._currenTrack?.track?.path;
        });

        const isSame = Playlist.isSame(this.playlist, playlist);
        if (!isSame || currentTrack < 0) {
            await this.stop();
        }

        if (currentTrack > -1) {
            this._currenTrack.trackNumber = currentTrack;
        }

        if (!isSame) {
            if (this._playlist) {
                this._playlist.unbindPlayer();
            }
            this._playlist =
                playlist instanceof Playlist
                    ? playlist
                    : new Playlist(playlist.path, playlist.name, playlist.tracks, playlist.updatedAt);

            const notify = (option: PlaylistChangedEvent, playlist: Playlist) => {
                if (this._playlist !== playlist) {
                    throw new Error('Playlist was unbind from player');
                }
                this.notify('playlist-changed', option);
            };
            this._playlist.bindPlayer(notify);
        }
    };

    /**
     * Play selected track. After track end will be call next track in playlist.
     * @param track Track option
     * @param track.relative If it is true, when playlist mode will be respected
     * @param track.trackNumber If relative, when trackNumber is shift relative to current track.
     * @returns Selected track.
     * - If mode is not respected and index of track is out of range, when {@link AudioPlayer.stop stop} will be called.
     * - If mode is `none`, respected and positive out of range, when will be called {@link AudioPlayer.stop stop}
     * - If mode is `none`, respected and negative out of range, when first track in playlist will be selected.
     * - If mode is respected and {@link AudioPlayer#state.track} equal `null`, when first track in playlist will be selected.
     */
    play = async (track: { trackNumber: number; relative: boolean }): Promise<ITrack> => {
        let _track: ITrack;
        let trackNumber: number = track.trackNumber;
        if (!track.relative) {
            _track = this._playlist.tracks[track.trackNumber];
        } else {
            trackNumber = this._currenTrack ? this.getNextTrack(this._currenTrack.trackNumber, track.trackNumber) : 0;
            _track = this._playlist.tracks[trackNumber];
        }

        if (!_track) {
            await this.stop();
            return;
        }

        this._currenTrack = { track: _track, position: 0, trackNumber };

        const preprocessor = this._processors[_track.mimeType];

        if (!preprocessor) {
            throw new Error('Preprocessor is not found');
        }

        await this._processors[_track.mimeType].play(this._defaultContext, this._gainNode, _track, async () => {
            this.notify('track-end');
            await this.play({ trackNumber: 1, relative: true });
        });
        this._analyzer.connect(this._defaultContext.destination);

        if (this._state != 'play') {
            this._state = 'play';
            this.notify('state-changed', 'play');
        }

        this.notify('track-start');
        return _track;
    };

    stop = async (): Promise<void> => {
        if (this._currenTrack) {
            await this._processors[this._currenTrack.track.mimeType].stop();
            this._currenTrack = undefined;
        }
        if (this._state != 'stop') {
            this._state = 'stop';
            this.notify('state-changed', this._state);
        }
    };

    pause = async (): Promise<void> => {
        if (this._currenTrack) {
            await this._processors[this._currenTrack.track.mimeType].pause();
        }
        if (this._state != 'pause') {
            this._state = 'pause';
            this.notify('state-changed', 'pause');
        }
    };

    getMetadata = (trackNumber: number): ITrack => {
        return this._playlist.tracks[trackNumber];
    };

    /**
     * Subscribe to playlist events
     * @param event Type of event to subscribe
     * @param eventHandler Callback then subscription fired
     * @param id Custom subscription id. If not set, random id will be generated
     * @returns Return subscription id
     */
    subscribe = <T extends Events | 'all'>(
        event_: T,
        eventHandler: T extends Events ? EventHandler<T> : EventHandler<Events>,
        id?: symbol,
    ): symbol => {
        const _id = id ?? Symbol();
        this._subscriptions[event_].set(_id, eventHandler as EventHandler<Events>);
        return _id;
    };

    /**
     * @param ev If missed, than remove subscription from all events
     * @returns number of delted subscriptions
     */
    unsubscribe = (subscriptionId: symbol, event_?: Events | 'all'): number => {
        if (event_) {
            return this._subscriptions[event_]?.delete(subscriptionId) ? 1 : 0;
        }
        let deletedSubscriptions = 0;
        for (const event in Object.getOwnPropertyNames(this._subscriptions)) {
            this._subscriptions[event as Events]?.delete(subscriptionId) && deletedSubscriptions++;
        }
        return deletedSubscriptions;
    };

    /**
     * Notify subscribers about event
     */
    private notify = <T extends Events>(event: T, option?: GetEventOption<T>) => {
        for (const [, action] of this._subscriptions['all']) {
            action(event, option);
        }
        for (const [, action] of this._subscriptions[event]) {
            (action as EventHandler<T>)(event, option);
        }
    };

    /**
     * Get next track in queue
     */
    private getNextTrack(trackNumber: number, step = 1) {
        if (this.mode === 'loop') {
            return this._playlist.tracks.length > trackNumber + step ? trackNumber + step : 0;
        }
        if (this.mode === 'loop-one') {
            return trackNumber;
        }
        if (this.mode === 'none') {
            return this._playlist.tracks.length > trackNumber + step ? trackNumber + step : undefined;
        }
    }
}
