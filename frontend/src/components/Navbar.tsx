import { Box, Flex, Button } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      px={4}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={8}>
          <RouterLink to="/">
            <Box fontWeight="bold" fontSize="xl">
              MEAP
            </Box>
          </RouterLink>
          <Flex gap={4}>
            <RouterLink to="/blog">
              <Box>Logs</Box>
            </RouterLink>
            <RouterLink to="/papers">
              <Box>Papers</Box>
            </RouterLink>
            {user?.isAdmin && (
              <RouterLink to="/admin">
                <Box>Admin</Box>
              </RouterLink>
            )}
          </Flex>
        </Flex>
        <Flex alignItems="center" gap={4}>
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <Button onClick={handleLogout} size="sm" colorScheme="red">
                Logout
              </Button>
            </>
          ) : (
            <RouterLink to="/login">
              <Button size="sm" colorScheme="blue">
                Login
              </Button>
            </RouterLink>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 