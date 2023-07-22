import { IAlbum } from "@/store/album/album.types";
import {
  Grid,
  Box,
  Card,
  CardMedia,
  Typography,
  styled,
  IconButton,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import { useActions } from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteAlbumMutation } from "@/store/album/albumApi";

interface AlbumListProps {
  albums: IAlbum[];
}

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
  const user = useTypedSelector((state) => state.user.user);
  const { setActiveAlbum } = useActions();
  const [deleteAlbum] = useDeleteAlbumMutation();
  const activeAlbum = useTypedSelector((state) => state.album.activeAlbum);

  const router = useRouter();
  const Item = styled("div")(({ theme }: any) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    border: "none",
    borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
    padding: theme.spacing(2),
    borderRadius: "4px",
    textAlign: "center",
  }));

  const handleDeleteAlbum = (
    e: React.SyntheticEvent<HTMLButtonElement>,
    albumId: string
  ) => {
    e.stopPropagation();
    if (
      confirm("Do you really want to delete this album with all its tracks?")
    ) {
      deleteAlbum(albumId);
      router.reload();
    }
  };

  return (
    <Grid container direction="row">
      <Box p={2} sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {albums.map((album) => (
            <Grid item xs={6} md={4} key={album._id}>
              <Item sx={{ padding: "0" }}>
                <Card
                  sx={{ maxWidth: 345 }}
                  onClick={() => {
                    setActiveAlbum(album);
                    router.push(
                      `/tracks?albumId=${album._id}&limit=${process.env.NEXT_PUBLIC_PAGE_LIMIT}&offset=0`
                    );
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      album.picture
                        ? process.env.NEXT_PUBLIC_API_URL + album.picture
                        : process.env.NEXT_PUBLIC_API_URL +
                          "image/album-image.jpg"
                    }
                    alt={album.name}
                  />

                  <Box sx={{ padding: "10px" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                      variant="body2"
                      color="text.secondary"
                    >
                      Owner: {album.author}{" "}
                      {user?._id == album.authorId && (
                        <IconButton
                          aria-label="delete"
                          onClick={(e) => handleDeleteAlbum(e, album._id)}
                        >
                          <DeleteIcon className="icon_delete" />
                        </IconButton>
                      )}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {album.name}
                    </Typography>
                  </Box>
                </Card>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  );
};

export default AlbumList;
