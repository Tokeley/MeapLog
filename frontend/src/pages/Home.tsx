import { Box, Container, Heading, Text, SimpleGrid, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ProjectTimeline from '../components/ProjectTimeline';

const Home = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Welcome to the MEAP Blog
          </Heading>
          <Text fontSize="xl" color="gray.600">
            A place for organising and tracking progress on my capstone project: MEAP
          </Text>
        </Box>

        <Box p={6} borderWidth="1px" borderRadius="lg">
          <Heading as="h2" size="lg" mb={4}>
            Project Timeline
          </Heading>
          <ProjectTimeline />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
          >
            <RouterLink to="/blog">
              <Heading as="h2" size="lg" mb={4}>
                Blog Posts
              </Heading>
              <Text color="gray.600">
                Read about the latest updates and progress on the MEAP project.
              </Text>
            </RouterLink>
          </Box>

          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
          >
            <RouterLink to="/papers">
              <Heading as="h2" size="lg" mb={4}>
                Research Papers
              </Heading>
              <Text color="gray.600">
                Explore the research papers and resources related to the project.
              </Text>
            </RouterLink>
          </Box>
        </SimpleGrid>

        <Box p={6} borderWidth="1px" borderRadius="lg">
          <Heading as="h2" size="lg" mb={4}>
            About MEAP
          </Heading>
          <Text color="gray.600">
            MEAP (Mechatronic Ensemble Arrangement and Performance) is a system designed to bridge
            the gap between musicians and mechatronic musical instruments. It provides a
            user-friendly interface for controlling mechatronic ensembles through digital audio
            workstations (DAWs), making it easier for musicians to explore the creative
            possibilities of these instruments.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Home; 