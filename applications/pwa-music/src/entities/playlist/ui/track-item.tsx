import { VFC } from 'react';
import { Duration } from './duration';

export interface TrackItemProperties {
    id: string;
    order: number;
    title: string;
    meta?: {
        album?: string;
        artist?: string;
        year?: number;
    };
    duration?: number;
    path: string;
    type: 'radio' | 'mp3';
}

export const TrackItem: VFC<TrackItemProperties> = ({ id, title, duration, path, type, meta }) => {
    return (
        <article id={id}>
            <header>{title}</header>
            <Duration>{duration}</Duration>
        </article>
    );
};
