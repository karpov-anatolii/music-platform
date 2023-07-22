import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useRouter } from "next/router";
import { wrapper } from "@/store/store";
import sizeFormat from "@/action/sizeFormat";
import { useSearchTracksQuery } from "@/store/track/tracksApi";
import { IUser } from "@/store/user/user.types";

const Index = ({ cookies }: any) => {
  const user: IUser | null = useTypedSelector((state) => state.user.user);
  const router = useRouter();
  const [query, setQuery] = useState<string>("");

  const {
    data: searchTracks, //[ track];
    isLoading: searchIsLoading,
    error: searchError,
  } = useSearchTracksQuery(
    { limit: 5, offset: 0, query },
    {
      skip: !Boolean(query),
    }
  );
  let tracks = searchTracks ?? [];

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <MainLayout cookies={cookies}>
      <Grid className="main_index_grid">
        <Card
          className="card_transparent"
          style={{ width: "90%", padding: "20px", marginBottom: "30px" }}
        >
          <Grid
            container
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6" component="h1">
              Wellcome {user && user.name}!{" "}
            </Typography>
            <Typography variant="subtitle1" component="h1">
              This is the best track&apos;s collection!
            </Typography>

            <Stack spacing={2} sx={{ margin: "30px 0", width: "90%" }}>
              <Autocomplete
                id="free-solo-demo"
                onChange={(e, value) => router.push(`/tracks/${value?.id}`)}
                track-search
                options={tracks.map((option) => ({
                  id: option._id,
                  label: option.name,
                }))}
                renderInput={(params) => (
                  <TextField
                    value={query}
                    onChange={search}
                    {...params}
                    label="track-search"
                  />
                )}
              />
            </Stack>

            <Button
              sx={{ margin: "20px 0 30px" }}
              variant="contained"
              onClick={() => {
                router.push(
                  `/albums?userId=all&limit=${process.env.NEXT_PUBLIC_API_URL}&offset=0`
                );
              }}
            >
              All album&apos;s list
            </Button>
            {user ? (
              <Grid>
                <Card
                  sx={{ padding: "30px 20px", backgroundColor: "#00000000" }}
                >
                  <Typography variant="h6" component="h2">
                    Your assets:
                  </Typography>
                  <Typography variant="subtitle1" component="h3">
                    <ul>
                      <li>Albums:{user.albums.length}</li>
                      <Button
                        sx={{ margin: "10px" }}
                        variant="contained"
                        onClick={() => {
                          router.push(`/albums?userId=${user._id} `);
                        }}
                      >
                        Your album&apos;s list
                      </Button>
                      <li> Disk space:{sizeFormat(user.diskSpace)}</li>
                      <li> Used space:{sizeFormat(user.usedSpace)}</li>

                      <Button
                        sx={{ margin: "10px" }}
                        variant="contained"
                        onClick={() => router.push("/user/profile")}
                      >
                        Profile
                      </Button>
                    </ul>
                  </Typography>
                </Card>
              </Grid>
            ) : (
              <Grid>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="h4"
                >
                  Please, login in order to create your own albums.
                </Typography>
              </Grid>
            )}
            {!user && (
              <>
                <Button
                  sx={{ margin: "10px" }}
                  variant="contained"
                  onClick={() => {
                    router.push("/user/registration");
                  }}
                >
                  Registration
                </Button>

                <Button
                  sx={{ margin: "10px" }}
                  variant="contained"
                  onClick={() => {
                    router.push("/user/login");
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Grid>
        </Card>
      </Grid>
    </MainLayout>
  );
};

export default Index;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params, query, ...etc }) => {
      let cookies = req.headers.cookie ?? null;
      return {
        props: { cookies },
      };
    }
);
