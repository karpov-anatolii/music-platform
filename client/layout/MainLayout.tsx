import React, { ReactNode, useEffect } from "react";
import Navbar from "./../components/Navbar";
import { Container, Grid } from "@mui/material";
import Player from "@/components/Player";
import Head from "next/head";
import { useActions } from "@/hooks/useActions";
import { useAuthQuery } from "@/store/user/userApi";
import { useTypedSelector } from "@/hooks/useTypedSelector";

interface MainLayoutProps {
  title?: string;
  description?: string;
  keywords?: string;
  children: ReactNode;
  cookies?: any;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  description,
  keywords,
  cookies,
}) => {
  const { setUser } = useActions();
  let regexp = new RegExp("token");

  let token: any;
  if (cookies?.match(regexp)) token = cookies.match(regexp)[0];

  let {
    data: getUser,
    isLoading: getUserIsLoading,
    error: getUserError,
  } = useAuthQuery(
    {},
    {
      skip: !token,
    }
  );
  useEffect(() => {
    setTimeout(() => setUser(getUser?.user), 0);
  }, [getUser]);

  return (
    <Grid className="main" container flexDirection="column">
      <div className="main-overlay"></div>
      <Head>
        <title>{title || "Music Platform"}</title>
        <meta
          name="description"
          content={
            "Music platform. Everyone may create an album and upload his own track here." +
            description
          }
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={keywords || "music, tracks, artists"} />
        <meta name="viewport" content="width-device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Container
        style={{
          width: "100%",
          minHeight: "500px",
          flexGrow: "1",
          paddingTop: "80px",
        }}
      >
        {children}
      </Container>
      <Player />
    </Grid>
  );
};

export default MainLayout;
