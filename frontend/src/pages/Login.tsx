import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/');
      alert('Login successful');
    } catch (error) {
      alert('Login failed: Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Login
          </Heading>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap={4} width="100%">
            <Box width="100%">
              <Text mb={2}>Username</Text>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                width="100%"
              />
            </Box>

            <Box width="100%">
              <Text mb={2}>Password</Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                width="100%"
              />
            </Box>

            <Box width="100%">
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
              >
                Login
              </Button>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Login; 