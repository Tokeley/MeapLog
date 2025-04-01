import { HashRouter as Router } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Routes from './Routes';

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box
            minH="100vh"
            width="100vw" // Use viewport width explicitly
            display="flex"
            flexDirection="column"
            alignItems="center" // Center children horizontally
          >
            <Box width="100%" maxW="1200px" px={4}>
              <Navbar />
            </Box>
            <Box flex="1" width="100%" maxW="1200px" px={4}>
              <Routes />
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;