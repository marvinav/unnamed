import 'regenerator-runtime/runtime';
import { Playlist, AudioPlayer } from './index';

import { IPlaylist, Mp3Track, TrackProcessor } from '../audio-player/types';

const playlist: IPlaylist = {
    name: 'Test First',
    updatedAt: new Date(),
    path: 'test/first',
    tracks: [
        {
            mediaMetadata: { title: '', album: '', artist: '', artwork: [] },
            recordable: true,
            mimeType: 'icy-cast',
            path: 'test/first/s',
        },
    ],
};

const playlistSecond: IPlaylist = {
    name: 'Test Second',
    updatedAt: new Date(),
    path: 'test/second',
    tracks: [
        {
            mediaMetadata: { title: '1', album: '', artist: '', artwork: [] },
            recordable: false,
            mimeType: 'mp3',
            path: 'test/second/mp3/1',
        },
        {
            mediaMetadata: { title: '2', album: '', artist: '', artwork: [] },
            recordable: false,
            mimeType: 'mp3',
            path: 'test/second/mp3/2',
        },
        {
            mediaMetadata: { title: '3', album: '', artist: '', artwork: [] },
            recordable: false,
            mimeType: 'mp3',
            path: 'test/second/mp3/3',
        },
    ],
};

describe('Audio Player', () => {
    const mockAudioContext = {
        createAnalyser: () => {
            return {
                connect: jest.fn(),
            };
        },
        createGain: () => {
            return {
                connect: jest.fn(),
            };
        },
    };

    global.AudioContext = jest.fn().mockImplementation(() => {
        return mockAudioContext;
    });

    it('Add and remove subscription', () => {
        const action = jest.fn();
        const player = new AudioPlayer();
        const id = player.subscribe('playlist-changed', action);
        expect(id).toBeTruthy();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sub = (player as any)._subscriptions as AudioPlayer['_subscriptions'];
        expect(sub['playlist-changed'].size).toBe(1);
        expect(sub['playlist-changed'].get(id)).toBe(action);
        player.unsubscribe(id, 'playlist-changed');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sub = (player as any)._subscriptions as AudioPlayer['_subscriptions'];
        expect(sub['playlist-changed'].size).toBe(0);
    });

    it('Add and remove track for bound and unbound playlist ', async () => {
        const tracksChanged = jest.fn();
        const playlistAttached = jest.fn();
        const player = new AudioPlayer();
        const id = player.subscribe('playlist-changed', (event, option) => {
            if (option === 'playlist-tracks-changed') {
                tracksChanged();
            } else if (option === 'playlist-attached') {
                playlistAttached();
            }
        });
        expect(id).toBeTruthy();
        await player.setPlaylist(playlist);
        expect(playlistAttached).toBeCalledTimes(1);
        player.playlist.addTrack(playlist.tracks[0]);
        expect(playlistAttached).toBeCalledTimes(1);
        expect(tracksChanged).toBeCalledTimes(1);
        player.playlist.removeTrack(1);
        expect(tracksChanged).toBeCalledTimes(2);
        const playlistInstance = player.playlist;
        await player.setPlaylist(playlist);
        expect(playlistAttached).toBeCalledTimes(2);
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        playlistInstance.addTrack(playlistInstance.tracks[0]);
        expect(warnSpy).toBeCalledWith('Playlist did not attach to player');
        expect(tracksChanged).toBeCalledTimes(2);
    });

    it('Set playlists', async () => {
        const player = new AudioPlayer();
        expect(player.playlist).toBeUndefined();
        const playlistInstance = new Playlist(playlist.path, playlist.name, playlist.tracks, playlist.updatedAt);
        await player.setPlaylist(playlistInstance);
        expect(player.playlist).toBe(playlistInstance);
        await player.setPlaylist(playlistSecond);
        expect(player.playlist.path).toBe(playlistSecond.path);
    });

    it('Playlist-change subscriptions', async () => {
        const player = new AudioPlayer();
        const mockFunction = jest.fn();
        const id = player.subscribe('playlist-changed', mockFunction);
        await player.setPlaylist(playlist);
        expect(mockFunction).toBeCalled();
        const playlistInstance = new Playlist(playlist.path, playlist.name, playlist.tracks, playlist.updatedAt);
        await player.setPlaylist(playlistInstance);
        expect(mockFunction).toBeCalledTimes(2);
        expect(player.playlist).toBe(playlistInstance);
        player.unsubscribe(id, 'playlist-changed');
        await player.setPlaylist(playlistInstance);
        expect(mockFunction).toBeCalledTimes(2);
    });

    //TODO:
    it('Play music mode=none', async () => {
        const player = new AudioPlayer();
        const mockSubscription = jest.fn();

        player.subscribe('track-end', mockSubscription);
        let currentTrack: number;
        let onEndBox;

        const mockPlay = jest.fn<Promise<void>, Parameters<TrackProcessor<Mp3Track>['play']>>(
            async (c, n, t, onEnd?) => {
                onEndBox = async () => {
                    currentTrack++;
                    await onEnd();
                };
            },
        );

        const mockPause = jest.fn<Promise<void>, Parameters<TrackProcessor<Mp3Track>['pause']>>();

        const mockStop = jest.fn<Promise<void>, Parameters<TrackProcessor<Mp3Track>['stop']>>();

        const preprocessor: TrackProcessor<Mp3Track> = {
            type: 'mp3',
            play: mockPlay,
            pause: mockPause,
            stop: mockStop,
        };

        player.addProcessor(preprocessor);
        await player.setPlaylist(playlistSecond);
        player.setMode('none');
        expect(player.playlist.tracks.length).toBe(3);
        currentTrack = 0;
        const track = await player.play({ trackNumber: currentTrack, relative: false });
        expect(mockPlay).toBeCalledTimes(1);
        expect(track).toEqual(playlistSecond.tracks[currentTrack]);
        expect(player.state.track?.trackNumber).toBe(0);
        await onEndBox(); // End first, start second
        expect(mockSubscription).toBeCalledTimes(1);
        expect(currentTrack).toBe(1);
        await onEndBox(); // End second, start third
        expect(mockSubscription).toBeCalledTimes(2);
        expect(currentTrack).toBe(2);
        await onEndBox(); // End third, stop playlist
        expect(mockSubscription).toBeCalledTimes(3);
        expect(player.state.state).toBe('stop');
        expect(player.state.track).toBeUndefined();
        expect(mockStop).toBeCalledTimes(1);
        const trackAfterStop = await player.play({ trackNumber: 1, relative: false });
        expect(trackAfterStop).toEqual(playlistSecond.tracks[1]);
        expect(player.state.state).toBe('play');
        await onEndBox(); // End 2, play 3
        await onEndBox(); // End 3, stop playlist
        expect(player.state.state).toBe('stop');
        expect(player.state.track).toBeUndefined();
        expect(mockStop).toBeCalledTimes(2);
    });

    //TODO:
    // it('Play music with loop-one mode', async () => {
    //     const { mockPlay, modeChangedSub, player } = createPlayer();
    //     await player.setPlaylist(playlistThird);
    //     expect(player.playlist.tracks.length).toBe(3);
    //     player.setMode('loop-one');
    //     expect(player.mode).toBe('loop-one');
    //     // const track = await player.play({ trackNumber: 0, relative: false });
    //     expect(mockPlay).toBeCalledTimes(1);
    //     expect(modeChangedSub).toBeCalledTimes(1);
    // });
});
