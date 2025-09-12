import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogin } from '@tabler/icons-react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getIsLoggedIn,
  removeUser,
} from '../../redux/slices/User';
import classes from './HeaderMegaMenu.module.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'Profile' },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const isLoggedIn = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();

  const navItems = navLinks.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) =>
        `${classes.link} ${isActive ? classes.activeLink : ''}`
      }
      onClick={closeDrawer}
    >
      {link.label}
    </NavLink>
  ));

  return (
    <Box pb={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Text component={Link} to="/" className={classes.logo}>
            Being  <Text component="span">Zero</Text>
          </Text>

          <Group h="100%" gap={0} visibleFrom="sm">
            {isLoggedIn && navItems}
          </Group>

          <Group visibleFrom="sm">
            {isLoggedIn ? (
              <Button variant="default" onClick={() => dispatch(removeUser())}>
                Logout
              </Button>
            ) : (
              <Button
                variant="default"
                component={Link}
                to="/login"
                leftSection={<IconLogin />}
              >
                Log in
              </Button>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          {isLoggedIn && (
            <Box className={classes.drawerLinks}>
              {navItems}
            </Box>
          )}
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {isLoggedIn ? (
              <Button fullWidth onClick={() => { dispatch(removeUser()); closeDrawer(); }}>
                Logout
              </Button>
            ) : (
              <Button component={Link} to="/login" fullWidth onClick={closeDrawer}>
                Login
              </Button>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
