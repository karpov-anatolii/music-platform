import FileUpload from "@/components/FileUpload";
import { useActions } from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import MainLayout from "@/layout/MainLayout";
import { wrapper } from "@/store/store";
import { IUser } from "@/store/user/user.types";
import {
  useDeleteAvatarMutation,
  useUploadAvatarMutation,
} from "@/store/user/userApi";
import {
  Card,
  Grid,
  Button,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import userAvatar from "../../assets/img/user-avatar.svg";

const Profile = ({ cookies }: any) => {
  const user: IUser = useTypedSelector((state: any) => state.user.user);
  const router = useRouter();
  const [uploadAvatar, { isLoading: isUpdating }] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();
  const { setUser } = useActions();
  const [picture, setPicture] = useState<File>();

  const imagePreview = user?.picture
    ? process.env.NEXT_PUBLIC_API_URL + user.picture
    : userAvatar;

  useEffect(() => {
    if (!picture) {
      return;
    }

    const formData = new FormData();
    formData.append("_id", user._id);
    formData.append("picture", picture);

    deleteAvatar({})
      .unwrap()
      .then((data: IUser) => {
        uploadAvatar(formData)
          .unwrap()
          .then((data: IUser) => {
            setUser(data);
            router.reload();
          })
          .catch((rejected) => alert(rejected.data.message));
      })
      .catch((rejected) => console.error(rejected));
  }, [picture]);

  return (
    <MainLayout title={"Registration - music platform"} cookies={cookies}>
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

      <Card className="card_transparent card_profile">
        <FileUpload setFile={setPicture} accept={"image/*"}>
          <Button variant="contained">Upload avatar</Button>
        </FileUpload>

        <Image
          priority
          style={{ objectFit: "contain", margin: "30px" }}
          width={200}
          height={200}
          src={imagePreview}
          alt="music-platform-profile"
        />

        <Button
          variant="contained"
          style={{ margin: " 50px" }}
          onClick={() => {
            deleteAvatar({})
              .unwrap()
              .then((data: IUser) => {
                setUser(data);
              })
              .catch((rejected) => console.error(rejected));
          }}
        >
          Delete avatar
        </Button>
      </Card>
    </MainLayout>
  );
};

export default Profile;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const cookies = context.req.headers.cookie ?? null;
    return {
      props: { cookies },
    };
  }
);
