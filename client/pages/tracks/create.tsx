import React, { useEffect, useRef, useState } from "react";
import MainLayout from "@/layout/MainLayout";
import StepWrapper from "@/components/StepWrapper";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../../styles/Create.module.scss";
import FileUpload from "@/components/FileUpload";
import useInput from "@/hooks/useInput";
import { useAddTrackMutation } from "@/store/track/tracksApi";
import { useRouter } from "next/router";
import { useActions } from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { wrapper } from "@/store/store";
import sizeFormat from "@/action/sizeFormat";
import Image from "next/image";
import mic from "../../assets/img/mic1.jpg";

const Create = ({ cookies }: any) => {
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<any>();
  const [audio, setAudio] = useState<File>();
  const name = useInput("");
  const artist = useInput("");
  const text = useInput("");
  const [addTrack, { isLoading: isUpdating }] = useAddTrackMutation();
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const { setPause, setActive } = useActions();
  const albumId = String(router?.query?.albumId);
  const user = useTypedSelector((store) => store.user.user);

  useEffect(() => {
    if (!picture) {
      setPreview("");
      return;
    } else {
      // create the preview
      const objectUrl = URL.createObjectURL(picture);
      setPreview(objectUrl);
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [picture]);

  const next = async () => {
    if (activeStep !== 2) {
      setActiveStep((prev) => prev + 1);
    } else {
      if (!name.value) {
        alert("Enter the name of track");
        return;
      }
      if (!artist.value) {
        alert("Enter artist's name");
        return;
      }
      if (!audio) {
        alert("Upload track!");
        return;
      }
      if (audio && albumId) {
        const formData = new FormData();
        formData.append("name", name.value);
        formData.append("text", text.value);
        formData.append("artist", artist.value);
        formData.append("picture", picture);
        formData.append("audio", audio);
        formData.append("albumId", albumId);

        try {
          console.log("FORM DATA picture=", picture);
          const payload = await addTrack(formData).unwrap();
          console.log("fulfilled, payload=", payload);
          setActive(null);
          router.push(`/tracks?albumId=${albumId}`);
        } catch (error) {
          console.error("rejected", error);
        }
      }
    }
  };
  const back = () => {
    setActiveStep((prev) => prev - 1);
  };
  return (
    <MainLayout cookies={cookies}>
      <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={isUpdating}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Button
        color="secondary"
        variant="contained"
        style={{ margin: "0 0 20px" }}
        onClick={() => router.push(`/albums?userId=${user ? user._id : "all"}`)}
      >
        Back to Albums
      </Button>
      <Grid container justifyContent={"space-between"}>
        <Button
          color="secondary"
          variant="contained"
          disabled={activeStep === 0}
          onClick={back}
        >
          Back
        </Button>
        <Button color="secondary" variant="contained" onClick={next}>
          Forward
        </Button>
      </Grid>
      <Grid container justifyContent="center">
        <StepWrapper activeStep={activeStep}>
          {activeStep === 0 && (
            <Grid className={styles.container} container direction={"column"}>
              <TextField
                {...name}
                className={styles.textfield}
                label={"Track's name"}
              />
              <TextField
                {...artist}
                className={styles.textfield}
                label={"Artist's name"}
              />
              <TextField
                {...text}
                className={styles.textfield}
                label={"Track's text"}
                multiline
                rows={3}
              />
            </Grid>
          )}
          {activeStep === 1 && (
            <FileUpload setFile={setPicture} accept={"image/*"}>
              <Grid container direction={"column"} alignItems={"center"}>
                <Button variant="contained">Upload image</Button>

                <Image
                  style={{ objectFit: "contain" }}
                  width={300}
                  height={300}
                  src={picture ? preview : mic}
                  alt="music-platform creating track"
                />
              </Grid>
            </FileUpload>
          )}
          {activeStep === 2 && (
            <FileUpload setFile={setAudio} accept={"audio/*"}>
              <Grid container direction={"column"} alignItems={"center"}>
                <Button variant="contained">Upload audio</Button>
                {audio && (
                  <div>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      component="h2"
                      className={styles.upload_audio_text}
                    >
                      {audio.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      component="h4"
                      className={styles.upload_audio_text}
                    >
                      {sizeFormat(audio.size)}
                    </Typography>
                  </div>
                )}
              </Grid>
            </FileUpload>
          )}
        </StepWrapper>
        <Grid
          sx={{ marginBottom: "30px" }}
          container
          justifyContent={"space-between"}
        >
          <Button
            color="secondary"
            variant="contained"
            disabled={activeStep === 0}
            onClick={back}
          >
            Back
          </Button>
          <Button color="secondary" variant="contained" onClick={next}>
            Forward
          </Button>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Create;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const cookies = context.req.headers.cookie ?? null;
    return {
      props: { cookies },
    };
  }
);
