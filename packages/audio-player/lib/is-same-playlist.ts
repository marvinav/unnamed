import { IPlaylist } from '../types';

export function isSamePlaylist(origin: IPlaylist, target: IPlaylist) {
    return origin.path === target.path && origin.updatedAt === target.updatedAt;
}
