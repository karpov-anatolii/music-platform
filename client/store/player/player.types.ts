import { ITrack } from "../track/track.types";

export interface PlayerState {
  active: null | ITrack;
  volume: number;
  duration: number;
  currentTime: number;
  pause: boolean;
}
