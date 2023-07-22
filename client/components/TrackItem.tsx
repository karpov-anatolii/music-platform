import { ITrack } from "@/store/track/track.types";
import React from "react";
import {
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import styles from "../styles/TrackItem.module.scss";
import { IconButton } from "@mui/material";
import { PlayArrow, Pause, Delete, Mic } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useActions } from "@/hooks/useActions";
import {
  useDeleteTrackMutation,
  useDownloadTrackMutation,
  useListenTrackMutation,
} from "@/store/track/tracksApi";
import sizeFormat from "@/action/sizeFormat";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InfoIcon from "@mui/icons-material/Info";
import { downloadFile } from "@/action/file";
import { IUser } from "@/store/user/user.types";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import Image from "next/image";
import mic from "../assets/img/mic1.jpg";

interface TrackItemProps {
  track: ITrack;
  active?: boolean;
  author: IUser | undefined;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  active = false,
  author,
}) => {
  const user = useTypedSelector((state) => state.user.user);
  const router = useRouter();
  const [downLoadidng, setDownLoading] = React.useState(false);
  const { setActive } = useActions();
  const [deleteTrack] = useDeleteTrackMutation();
  const [listenTrack] = useListenTrackMutation();
  const imageSrc = track.picture
    ? process.env.NEXT_PUBLIC_API_URL + track.picture
    : mic;

  const playTrack = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActive(track);

    if (track) {
      listenTrack(track._id);
    }
  };

  const handleDeleteTrack = (
    e: React.SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    if (confirm("Do you really want to delete this track?")) deleteTrack(id);
  };

  const handleDownloadTrack = (
    e: React.SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    setDownLoading(true);
    downloadFile(track).then((res) => setDownLoading(false));
  };

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={downLoadidng}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card
        sx={{ backgroundColor: "#00000000", flexWrap: "wrap" }}
        className={styles.track}
        onClick={() => router.push("/tracks/" + track._id)}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              margin: "15px 0",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <IconButton onClick={playTrack}>
              {active ? <Pause /> : <PlayArrow />}
            </IconButton>
            <Image
              style={{ objectFit: "contain", cursor: "pointer" }}
              priority
              width={70}
              height={70}
              src={imageSrc}
              alt="music-platform"
            />
          </Box>
          <Box
            sx={{
              margin: "0 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "start",
            }}
          >
            <Typography variant="h6" color="text.primary" component="h2">
              {track.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="h3"
            >
              {track.artist}
            </Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              Listens - {track.listens}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {sizeFormat(track.size)}

            <IconButton
              onClick={(e) => {
                handleDownloadTrack(e, track._id);
              }}
            >
              <FileDownloadIcon />
            </IconButton>
          </Typography>
          <IconButton onClick={() => router.push("/tracks/" + track._id)}>
            <InfoIcon />
          </IconButton>
          {user?._id == author?._id && (
            <IconButton onClick={(e) => handleDeleteTrack(e, track._id)}>
              <Delete className="icon_delete" />
            </IconButton>
          )}
        </Box>
      </Card>
    </>
  );
};

export default TrackItem;
