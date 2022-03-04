import { ITrack, TrackProcessor } from '../types';

export class CommonPreprocessor implements TrackProcessor<ITrack> {
    _source: MediaElementAudioSourceNode;
    _audio = document.createElement('audio');
    _isPlayBlocked = false;
    _next: () => void;
    type: 'icy-cast' | 'mp3' = 'icy-cast';
    _playPromise: Promise<void>;
    private onEnd = async (onEnd: () => Promise<void>) => {
        this._audio.removeAttribute('src');
        this._audio.load();
        await onEnd();
    };

    play: (context: AudioContext, node: GainNode, track: ITrack, onEnd?: () => Promise<void>) => Promise<void> = async (
        c,
        n,
        t,
        onEnd,
    ) => {
        if (!this._source) {
            this._source = c.createMediaElementSource(this._audio);
            this._audio.setAttribute('crossorigin', 'anonymous');
            this._source.connect(n);
            // this._audio.addEventListener('playing', () => {
            //     if (this._next) {
            //         this._next();
            //         this._isPlayBlocked = false;
            //         this._next = undefined;
            //     }
            // });
        }

        const onEndHandler = async () => {
            await this.onEnd(onEnd);
            this._audio.removeEventListener('ended', onEndHandler);
        };

        this._audio.addEventListener('ended', onEndHandler);

        try {
            this._audio.load();
            await c.resume();
            this._audio.setAttribute('src', t.path);
            await this._audio.play();
        } catch {
            console.warn('The play() request was interrupted');
        }
    };

    stop: () => Promise<void> = async () => {
        this._audio.removeAttribute('src');
        this._audio.load();
    };

    pause: () => Promise<void> = async () => {
        this._audio.pause();
    };
}
