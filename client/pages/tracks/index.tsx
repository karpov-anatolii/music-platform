import {
  Box,
  Button,
  Grid,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import MainLayout from "./../../layout/MainLayout";
import { useRouter } from "next/router";
import { ITrack } from "@/store/track/track.types";
import TrackList from "@/components/TrackList";
import avatarLogo from "./../../assets/img/user-avatar.svg";
import { wrapper } from "@/store/store";
import {
  getRunningQueriesThunk,
  getTracks,
  useGetTracksQuery,
  useSearchTrackQuery,
} from "@/store/track/tracksApi";
import { useActions } from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import Image from "next/image";
import { IUser } from "@/store/user/user.types";

const Index: React.FC<{ cookies: any }> = ({ cookies }) => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const { setPause, setActive } = useActions();

  let [page, setPage] = useState(1);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [totalCount, setTotalCount] = useState(0);
  const count = Math.ceil(totalCount / limit);
  const [offset, setOffset] = useState(0);

  const handleChange = (event: any, value: number) => {
    setOffset(value * limit - limit);
    setPage(value);
  };

  const user = useTypedSelector((store) => store.user.user);
  let tracks: ITrack[];

  let activeAlbumId = router.query.albumId!;

  let {
    data: getTracks, //{ tracks, album, author,docCount };
    isLoading: getTracksIsLoading,
    error: getTracksError,
  } = useGetTracksQuery(
    { limit, offset, activeAlbumId },
    {
      selectFromResult: ({ data, error, isLoading }) => {
        data = query ? undefined : data;
        return {
          data,
          error,
          isLoading,
        };
      },
      skip: Boolean(query),
    }
  );

  const {
    data: searchTrack, //{ tracks, album, author };
    isLoading: searchIsLoading,
    error: searchError,
  } = useSearchTrackQuery(
    { limit, offset, activeAlbumId, query },
    {
      skip: !Boolean(query),
    }
  );

  useEffect(() => {
    if (getTracks?.docCount) {
      setTotalCount(getTracks?.docCount);
    }
    if (searchTrack?.docCount) {
      setTotalCount(searchTrack?.docCount);
    }
  }, [getTracks, searchTrack]);

  tracks = getTracks?.tracks ? getTracks.tracks : searchTrack?.tracks ?? [];
  let authorPicture = getTracks?.author.picture
    ? getTracks?.author.picture
    : searchTrack?.author.picture;
  const avatar = authorPicture
    ? `${process.env.NEXT_PUBLIC_API_URL! + authorPicture}`
    : avatarLogo;
  let author: IUser | undefined = getTracks?.author
    ? getTracks?.author
    : searchTrack?.author;

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  if (getTracksError || searchError) {
    return (
      <MainLayout cookies={cookies}>
        <h1 style={{ margin: "50px" }}>Error!</h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={"Tracks list - music platform"} cookies={cookies}>
      <Button
        color="secondary"
        variant="contained"
        style={{ margin: "0 0 20px" }}
        onClick={() => router.push(`/albums?userId=${user ? user._id : "all"}`)}
      >
        Back to Albums
      </Button>
      <Grid container justifyContent="center">
        <Card
          className="card_transparent"
          style={{ width: "900px", marginBottom: "100px" }}
        >
          <Box p={3}>
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
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
                  Owner: {author?.name}
                </Typography>
                <Box
                  sx={{ width: "30px", height: "30px", marginRight: "10px" }}
                >
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
              <Typography
                mt={2}
                variant="h4"
                color="text.primary"
                component="h1"
              >
                {getTracks?.album.name}
              </Typography>
            </Grid>
          </Box>

          <Box p={3}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="h5" color="text.secondary" component="h2">
                Tracks&apos; list
              </Typography>
              {user && user._id == getTracks?.author?._id && (
                <Button
                  size="small"
                  variant="contained"
                  style={{ fontSize: 16, margin: "0 0 20px" }}
                  onClick={() => {
                    setActive(null);
                    setPause();
                    router.push(
                      `/tracks/create?albumId=${getTracks?.album._id}`
                    );
                  }}
                >
                  Upload track
                </Button>
              )}
            </Grid>
          </Box>
          <Grid container alignItems="center" justifyContent="center">
            <TextField
              style={{ width: "90%", margin: "0px auto" }}
              size="small"
              label="Search"
              value={query}
              onChange={search}
            />
          </Grid>
          {getTracksIsLoading || searchIsLoading ? (
            <h1 style={{ margin: "50px" }}>Loading...</h1>
          ) : (
            <TrackList tracks={tracks} author={author} />
          )}
          <Pagination
            sx={{ padding: "20px" }}
            count={count}
            page={page}
            color="primary"
            variant="outlined"
            onChange={handleChange}
          />
        </Card>
      </Grid>
    </MainLayout>
  );
};

export default Index;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const res = store.dispatch(
      getTracks.initiate({
        limit: Number(context.query.limit) || 10,
        offset: Number(context.query.offset) || 0,
        activeAlbumId: context.query.albumId || "",
      })
    );
    const cookies = context.req.headers.cookie ?? null;
    const result = await Promise.all(store.dispatch(getRunningQueriesThunk()));
    return {
      props: { cookies },
    };
  }
);
