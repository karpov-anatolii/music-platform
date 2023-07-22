import { IAlbum } from "@/store/album/album.types";
import { ITrack } from "@/store/track/track.types";
import { IUser } from "@/store/user/user.types";
import { Grid, Box } from "@mui/material";
import React from "react";
import TrackItem from "./TrackItem";

interface TrackListProps {
  tracks: ITrack[];
  author: IUser | undefined;
}
const TrackList: React.FC<TrackListProps> = ({ tracks, author }) => {
  return (
    <Grid container direction="column">
      <Box sx={{ width: "100%" }} p={2}>
        {tracks.map((track) => (
          <TrackItem key={track._id} track={track} author={author} />
        ))}
      </Box>
    </Grid>
  );
};

export default TrackList;
