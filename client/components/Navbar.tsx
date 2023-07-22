import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AlbumIcon from "@mui/icons-material/Album";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Router, useRouter } from "next/router";
import { Button } from "@mui/material";
import avatarLogo from "../assets/img/user-avatar.svg";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import Image from "next/image";
import { useActions } from "@/hooks/useActions";
import { logout } from "@/action/user";

type Anchor = "left";
const menuItems = [
  { text: "Main", href: "/", icon: <HomeIcon /> },
  {
    text: "Albums' list",
    href: `/albums?userId=all&limit=${process.env.NEXT_PUBLIC_API_URL}&offset=0`,
    icon: <AlbumIcon />,
  },
];

export default function Navbar() {
  const user = useTypedSelector((state) => state.user.user);
  const router = useRouter();
  const { removeUser } = useActions();
  const avatar = user?.picture
    ? `${process.env.NEXT_PUBLIC_API_URL + user.picture}`
    : avatarLogo;
  const [state, setState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState(open);
    };

  const list = () => (
    <Box
      sx={{ width: 220 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map(({ text, href, icon }, index) => (
          <ListItem key={href} disablePadding onClick={() => router.push(href)}>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && (
          <ListItem
            key={user?._id}
            disablePadding
            onClick={() =>
              router.push(
                `/albums?userId=${user?._id}&limit=${process.env.NEXT_PUBLIC_API_URL}&offset=0 `
              )
            }
          >
            <ListItemButton>
              <ListItemIcon>
                <AlbumIcon />
              </ListItemIcon>
              <ListItemText primary="Your Albums" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem
          key={"/user/login"}
          disablePadding
          onClick={() => {
            logout().then((res) => {
              removeUser();
              router.push("/user/login");
            });
          }}
        >
          <ListItemButton>
            <ListItemIcon>{user ? <LogoutIcon /> : <LoginIcon />}</ListItemIcon>
            <ListItemText primary={user ? "Logout" : "Login"} />
          </ListItemButton>
        </ListItem>

        {!user && (
          <ListItem
            key={"/user/registration"}
            disablePadding
            onClick={() => router.push("/user/registration")}
          >
            <ListItemButton>
              <ListItemIcon>
                <HowToRegIcon />
              </ListItemIcon>
              <ListItemText primary="Registration" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Toolbar
          sx={{
            display: "flex",
            position: "absolute",
            left: "0",
            backgroundColor: "#121212",
            width: "100%",
          }}
          className="nav_toolbar"
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
            sx={{ mr: 2, ...(state && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className="nav_logo"
            onClick={() => router.push("/")}
            variant="h6"
            noWrap
            component="div"
          >
            Music Platform
          </Typography>
          <Box className="nav_box_menu">
            <Button
              className="nav_but_albums"
              color="secondary"
              sx={{ marginLeft: "auto" }}
              onClick={() => {
                router.push(
                  `/albums?userId=all&limit=${process.env.NEXT_PUBLIC_API_URL}&offset=0`
                );
              }}
            >
              Albums
            </Button>
            <Button
              className="nav_but_login"
              color="secondary"
              onClick={() => {
                logout().then((res) => {
                  removeUser();
                  router.push("/user/login");
                });
              }}
            >
              {user ? "Logout" : "Login"}
            </Button>
            {user && (
              <Typography
                className="nav_but_hello"
                variant="subtitle1"
                sx={{ mx: "10px" }}
                component="div"
              >
                Hello, {user.name}!
              </Typography>
            )}
            {user && (
              <Button
                color="secondary"
                onClick={() => {
                  router.push(
                    `/albums?userId=${user._id}&limit=${process.env.NEXT_PUBLIC_API_URL}&offset=0 `
                  );
                }}
              >
                Your Albums
              </Button>
            )}
          </Box>
          <Box sx={{ width: "30px", height: "30px" }}>
            <Image
              style={{
                cursor: user ? "pointer" : "auto",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              priority
              width={30}
              height={30}
              src={avatar}
              alt="avatar"
              onClick={() => user && router.push("/user/profile")}
            />
          </Box>
        </Toolbar>
        <Drawer anchor={"left"} open={state} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
