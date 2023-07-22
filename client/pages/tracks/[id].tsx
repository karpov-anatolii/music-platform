import { downloadFile } from "@/action/file";
import sizeFormat from "@/action/sizeFormat";
import { useActions } from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import MainLayout from "@/layout/MainLayout";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import avatarLogo from "./../../assets/img/user-avatar.svg";
import mic from "../../assets/img/mic1.jpg";
import { useListenTrackMutation } from "@/store/track/tracksApi";

const TrackPage = ({ serverTrack, cookies, author, album }: any) => {
  const [track, setTrack] = useState(serverTrack);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [downLoadidng, setDownLoading] = useState(false);
  const { pause, volume, active, duration, currentTime } = useTypedSelector(
    (state) => state.player
  );
  const [listenTrack] = useListenTrackMutation();
  const imageSrc = track.picture
    ? process.env.NEXT_PUBLIC_API_URL + track.picture
    : mic;
  let activeName;
  if (active) activeName = active.name;
  const { setActive } = useActions();

  const addComment = async () => {
    if (!username || !text)
      return alert("Please, enter your name and comment!");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}tracks/comment`,
        {
          username: username,
          text: text,
          trackId: track._id,
        }
      );
      setTrack({ ...track, comments: [...track.comments, response.data] });
      setUsername("");
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  const dateComment = (comment: any) => {
    let timestamp = comment?._id.toString().substring(0, 8);
    const date = new Date(parseInt(timestamp, 16) * 1000);
    return date.toLocaleDateString();
  };

  const dateTrack = (track: any) => {
    let timestamp = track?._id.toString().substring(0, 8);
    const date = new Date(parseInt(timestamp, 16) * 1000);
    return date.toLocaleDateString();
  };

  const avatar = author.picture
    ? `${process.env.NEXT_PUBLIC_API_URL + author.picture}`
    : avatarLogo;

  return (
    <MainLayout
      title={"Music platform - " + track.name + "-" + track.artist}
      keywords={"music, artists," + track.name + "," + track.artist}
      cookies={cookies}
    >
      <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={downLoadidng}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Button
        color="secondary"
        variant="contained"
        style={{ margin: "0 0 20px" }}
        onClick={() => router.push(`/tracks?albumId=${track.albumId}`)}
      >
        Back to Tracks
      </Button>
      <Grid container style={{ margin: "20px 0 100px" }}>
        <Card
          className="card_transparent"
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <Image
              style={{ objectFit: "contain" }}
              width={300}
              height={300}
              src={imageSrc}
              alt={`Music Platform  ${track.name}`}
            />

            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                flex: "1 0 auto",
              }}
            >
              <Box
                sx={{
                  marginBottom: "15px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="h3"
                >
                  Owner: {author.name}
                </Typography>
                <Box sx={{ width: "30px", height: "30px" }}>
                  <Image
                    style={{
                      objectFit: "cover",
                      marginLeft: "15px",
                      borderRadius: "50%",
                    }}
                    priority
                    width={30}
                    height={30}
                    src={avatar}
                    alt="Owner of tracks"
                  />
                </Box>
              </Box>
              <Typography component="h1" variant="h4">
                {track.name}
              </Typography>
              <Typography
                mb={3}
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Author - {track.artist}
              </Typography>
              <Button
                color="primary"
                variant="contained"
                style={{ margin: "0 0 20px", width: "auto" }}
                onClick={() => {
                  setDownLoading(true);
                  downloadFile(track).then((res) => setDownLoading(false));
                }}
              >
                Download ({sizeFormat(track.size)})
              </Button>

              {(!active || activeName != track.name) && (
                <Button
                  color="primary"
                  variant="contained"
                  style={{ margin: "0 0 20px", width: "auto" }}
                  onClick={() => {
                    setActive(track);
                    listenTrack(track._id);
                  }}
                >
                  PLAY
                </Button>
              )}

              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Album - {album.name}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
              >
                Listens - {track.listens}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
              >
                Uploaded - {dateTrack(track)}
              </Typography>
            </CardContent>
          </Box>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: "1 0 auto",
            }}
          >
            {track.text && (
              <>
                <Typography mt={3} component="div" variant="h6">
                  Track&apos;s text
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  {track.text}
                </Typography>
              </>
            )}
          </CardContent>

          <Typography mt={4} variant="h5" component="div">
            Comments
          </Typography>
          <TextField
            sx={{ margin: "20px 0 10px " }}
            label="Your name"
            fullWidth
            value={username}
            onChange={(newValue) => {
              setUsername(newValue.target.value);
            }}
          />
          <TextField
            sx={{ margin: "10px 0 " }}
            label="Comment"
            fullWidth
            value={text}
            onChange={(newValue) => {
              setText(newValue.target.value);
            }}
            multiline
            rows={4}
          />
          <Button
            sx={{ margin: "10px 0 30px ", alignSelf: "end" }}
            variant="contained"
            onClick={addComment}
          >
            Submit
          </Button>

          <ul>
            {track.comments.map((comment: any) => (
              <li key={comment._id}>
                <Card
                  sx={{
                    backgroundColor: "#00000000",
                    width: "100%",
                    margin: "15px 0",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flex: "1 0 auto",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography component="div" variant="h6">
                        {comment.username}
                      </Typography>
                      <Typography component="div" variant="subtitle2">
                        {dateComment(comment)}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{ width: "100%" }}
                      component="div"
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      {comment.text}
                    </Typography>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Card>
      </Grid>
    </MainLayout>
  );
};

export default TrackPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "tracks/" + params?.id
  );
  const cookies = req.headers.cookie ?? null;
  return {
    props: {
      serverTrack: response.data.serverTrack,
      cookies,
      author: response.data.author,
      album: response.data.album,
    },
  };
};
