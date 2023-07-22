import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useRouter } from "next/router";
import { wrapper } from "@/store/store";
import { useActions } from "@/hooks/useActions";
import {
  getRunningQueriesThunk,
  albumApi,
  getAlbums,
  useAddAlbumMutation,
  useGetAlbumsQuery,
} from "@/store/album/albumApi";
import AlbumList from "@/components/AlbumList";
import { MuiFileInput } from "mui-file-input";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { text } from "stream/consumers";

const Index = ({ serverAlbums, docCount, cookies }: any) => {
  const user = useTypedSelector((state) => state.user.user);
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [album, setAlbum] = React.useState("");
  const [file, setFile] = React.useState<any>();
  const [addAlbum, { isLoading: isUpdating }] = useAddAlbumMutation();
  const { setAlbums } = useActions();
  const userId = router.query.userId;
  let [page, setPage] = useState(1);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [totalCount, setTotalCount] = useState(docCount);
  const count = Math.ceil(totalCount / limit);
  const [offset, setOffset] = useState(0);

  const handleChange = (event: any, value: number) => {
    setOffset(value * limit - limit);
    setPage(value);
  };

  const handleChangeAlbum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbum(e.target.value);
  };
  const handleChangeFile = (newValue: any) => {
    setFile(newValue);
  };

  useEffect(() => {
    router.push(`/albums?userId=${userId}&limit=${limit}&offset=${offset}`);
  }, [page]);

  const handleSubmitAlbum = async () => {
    if (album && user) {
      const formData = new FormData();
      formData.append("name", album);
      formData.append("author", user.name);
      formData.append("authorId", user._id);
      formData.append("picture", file);

      try {
        const payload = await addAlbum(formData).unwrap();
        console.log("fulfilled, payload=", payload);
        handleClose();
        router.reload();
      } catch (error) {
        console.error("rejected", error);
      }
    } else {
      !album && alert("Please, enter album's name");
    }
  };
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 400,
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <MainLayout title={"Tracks list - music platform"} cookies={cookies}>
      <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={isUpdating}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Button
        color="secondary"
        variant="contained"
        style={{ margin: "0 0 20px" }}
        onClick={() => router.push(`/`)}
      >
        Back to Main
      </Button>
      <Grid container justifyContent="center">
        <Card
          className="card_transparent"
          style={{ width: "900px", marginBottom: "100px" }}
        >
          <Box p={3}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="h4" color="text.primary" component="h1">
                Albums&apos; list
              </Typography>
              {user && (
                <Button
                  variant="contained"
                  style={{ padding: "5px 10px" }}
                  onClick={handleOpen}
                >
                  Create new album
                </Button>
              )}
            </Grid>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
            ></Grid>
          </Box>

          {!serverAlbums ? (
            <h1 style={{ margin: "50px" }}>Loading...</h1>
          ) : (
            <>
              <AlbumList albums={serverAlbums} />
              <Pagination
                sx={{ padding: "20px" }}
                count={count}
                page={page}
                color="primary"
                variant="outlined"
                onChange={handleChange}
              />
            </>
          )}
        </Card>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              color="text.primary"
            >
              Create a new album
            </Typography>
            <TextField
              fullWidth
              size="medium"
              label="Album's name"
              variant="outlined"
              value={album}
              onChange={handleChangeAlbum}
            />
            <Typography
              id="modal-modal-title"
              variant="subtitle1"
              component="h4"
              color="text.secondary"
            >
              You can upload the cover for this album (optional)
            </Typography>
            <MuiFileInput
              value={file}
              onChange={handleChangeFile}
              getInputText={(file) =>
                file?.name ? file?.name : "Album's cover"
              }
            />
            <Button variant="contained" onClick={handleSubmitAlbum}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>
    </MainLayout>
  );
};

export default Index;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params, query, ...etc }) => {
      const response = await store.dispatch(
        albumApi.endpoints.getAlbums.initiate({
          limit: Number(query.limit) || 10,
          offset: Number(query.offset) || 0,
          userId: query.userId,
        })
      );
      const cookies = req.headers.cookie || null;
      await Promise.all(store.dispatch(albumApi.util.getRunningQueriesThunk()));

      return {
        props: {
          serverAlbums: response?.data?.albums || null,
          docCount: response?.data?.docCount || null,
          cookies,
        },
      };
    }
);
