import { useActions } from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useListenTrackMutation } from "@/store/track/tracksApi";
import { Pause, PlayArrow, VolumeUp } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/Player.module.scss";
import TrackProgress from "./TrackProgress";
import UpdateIcon from "@mui/icons-material/Update";
import CloseIcon from "@mui/icons-material/Close";

let audio: HTMLAudioElement;

const Player = () => {
  const { pause, volume, active, duration, currentTime } = useTypedSelector(
    (state) => state.player
  );

  const {
    setPause,
    setPlay,
    setVolume,
    setCurrentTime,
    setActive,
    setDuration,
  } = useActions();

  const [audioError, setAudioError] = useState<Error>();
  const [listenTrack, resListenTrack] = useListenTrackMutation();
  useEffect(() => {
    if (!audio) {
      audio = new Audio(); //если audio нет , то мы его проинициализируем
    } else {
      setAudio();
    }
  }, [active]);

  const setAudio = () => {
    if (active) {
      audio.src = process.env.NEXT_PUBLIC_API_URL + active.audio;
      audio.volume = volume / 100;
      audio.onloadedmetadata = () => {
        setDuration(Math.ceil(audio.duration));
      };
      audio.ontimeupdate = () => {
        setCurrentTime(Math.ceil(audio.currentTime));
      };
    }
  };

  const play = async () => {
    setAudioError(undefined);
    await new Promise((r) => setTimeout(r, 100));
    if (pause) {
      setPlay();
      audio.play().catch((e: any) => {
        setAudioError(e);
      });
    } else {
      setPause();
      audio.pause();
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.volume = Number(e.target.value) / 100;
    setVolume(Number(e.target.value));
  };

  const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  if (!active) {
    //don't show player
    return null;
  }

  return (
    <>
      <div className={styles.player}>
        <Grid container spacing={2}>
          <IconButton
            sx={{ position: "absolute", top: "0", right: "0" }}
            onClick={() => {
              setActive(null);
              setPause();
              audio.pause();
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid item xs={12} md={4} sx={{ display: "flex" }}>
            <IconButton onClick={play}>
              {!pause ? <Pause /> : <PlayArrow />}
            </IconButton>
            <Box>
              <Typography variant="h6" component="h3">
                {active?.name}
              </Typography>
              <Typography variant="subtitle2" component="h4">
                {active?.artist}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={4} className="player_settings">
            <Box>
              <UpdateIcon />
              <TrackProgress
                left={currentTime}
                right={duration}
                onChange={changeCurrentTime}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={3} className="player_settings">
            <Box>
              <VolumeUp />
              <TrackProgress
                left={volume}
                right={100}
                onChange={changeVolume}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
      {audioError && (
        <div className="mt-4 text-red-600">
          AUDIO ERROR: {audioError.message}
        </div>
      )}
    </>
  );
};

export default Player;
