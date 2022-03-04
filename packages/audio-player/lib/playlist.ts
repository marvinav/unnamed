import { IPlaylist, ITrack, PlaylistChangedEvent } from '../types';

import { cloneTrack } from './track';

const defaultNotify: Playlist['_notify'] = (_event, _playlist) => {
    console.warn('Playlist did not attach to player');
};

export class Playlist {
    private _path: string;
    private _name: string;
    private _tracks: ITrack[];
    private _updatedAt: Date;
    private _notify: (event: PlaylistChangedEvent, playlist: Playlist) => void = defaultNotify;

    constructor(path: string, name: string, tracks: ITrack[], updatedAt?: Date) {
        this._path = path;
        this._name = name;
        this._tracks = tracks.map((t) => cloneTrack(t));
        this._updatedAt = updatedAt;
    }

    get path() {
        return this._path;
    }

    get name() {
        return this._name;
    }

    get tracks() {
        return this._tracks.map((t) => cloneTrack(t));
    }

    get updatedAt() {
        return this._updatedAt;
    }

    bindPlayer(notify: Playlist['_notify']) {
        this._notify = notify;
        this._notify('playlist-attached', this);
    }

    unbindPlayer() {
        this._notify = defaultNotify;
    }

    addTrack(track: ITrack, order?: number) {
        if (order) {
            this._tracks = [...this._tracks.slice(0, order), track, ...this._tracks.slice(order)];
        } else {
            this._tracks.push(track);
        }
        this._notify('playlist-tracks-changed', this);
    }

    removeTrack(trackOrder: number) {
        this._tracks = [...this._tracks.slice(0, trackOrder), ...this._tracks.slice(trackOrder + 1)];
        this._notify('playlist-tracks-changed', this);
    }

    static isSame(target: Playlist | IPlaylist, origin: Playlist | IPlaylist) {
        if (!target || !origin) {
            return false;
        }
        return target === origin;
    }
}
