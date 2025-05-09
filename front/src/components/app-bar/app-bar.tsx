import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import appLogo from "/logo-hd.svg";
import styles from "./app-bar.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEventTypes } from "../../util/getEventTypes";

const pages = ["Home", "Music", "Arts & Theatre", "Other"];

interface UserData {
  email: string;
  id: string;
  name: string;
  role: string;
}

interface EventType {
  Id: string;
  Title: string;
}

function ResponsiveAppBar({
  userData,
  onLogout,
}: {
  userData: UserData | null;
  onLogout: React.MouseEventHandler;
}) {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [menuItems, setMenuItems] = useState<EventType[]>([]);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getEventTypes();
      setMenuItems(result);
    };
    fetchData();
  }, []);

  const params = useParams();
  return (
    <AppBar
      position="static"
      style={{
        width: "100%",
        backgroundColor: "#000000",
        borderBottom: "5px solid #00F5D0",
        borderBottomRightRadius: "15px",
        boxSizing: "border-box",
      }}
    >
      <Container>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  color="#9C9583"
                >
                  <Typography color="#9C9583" textAlign="center">
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <div className={styles.logoContainer}>
            <Link to="/">
              <img
                src={appLogo}
                alt="logo"
                className={styles.imgLogo}
                onClick={() => setActive(-1)}
              />
            </Link>
          </div>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          ></Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", justifyContent: "center" },
            }}
          >
            {menuItems.map((page, index) => (
              <Link
                to={"http://localhost:5173/category/" + page.Id}
                key={page.Id}
              >
                <Button
                  key={page.Id}
                  onClick={() => {
                    handleCloseNavMenu(), setActive(index);
                  }}
                  sx={{
                    my: 2,
                    display: "block",
                    boxSizing: "border-box",
                    borderBottom: "3px solid transparent",
                    color:
                      params.id && page.Id === params.id
                        ? "#00F5D0"
                        : "#9C9583",
                    "&:hover": {
                      borderBottom: "3px solid #00F5D0",
                      background: "transparent",
                      borderBottomRightRadius: "15px",
                      color: "#00F5D0",
                      transition: "all 0.1s slide-in",
                    },
                  }}
                >
                  {page.Title}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {userData ? (
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "#00F5D0", color: "black" }}>
                  {userData.name[0]}
                </Avatar>
              </IconButton>
            ) : (
              <div className={styles.row}>
                <Link to={"/login"}>
                  {" "}
                  <Button
                    key="login"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to={"/register"}>
                  {" "}
                  <Button
                    key="register"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userData?.role == "USER" ? (
                <MenuItem
                  key="profile"
                  onClick={() => navigate("/profile")}
                  onMouseUp={handleCloseUserMenu}
                >
                  <Typography textAlign="center">
                    Profile & Purchases
                  </Typography>
                </MenuItem>
              ) : (
                <MenuItem
                  key="profile"
                  onClick={() => navigate("/dashboard")}
                  onMouseUp={handleCloseUserMenu}
                >
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
              )}

              <MenuItem
                key="logout"
                onClick={onLogout}
                onMouseUp={handleCloseUserMenu}
              >
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
