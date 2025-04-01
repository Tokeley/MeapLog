import { Box } from '@chakra-ui/react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import BlogList from '../components/admin/BlogList';
import PaperList from '../components/admin/PaperList';
import BlogForm from '../components/admin/BlogForm';
import PaperForm from '../components/admin/PaperForm';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInBlogSection = location.pathname.includes('/admin/blog');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Heading as="h1" size="xl">
          Admin Dashboard
        </Heading>

        <HStack gap={4}>
          <Button
            onClick={() => navigate('/admin/blog')}
            colorScheme={isInBlogSection ? 'blue' : 'gray'}
            variant={isInBlogSection ? 'solid' : 'outline'}
          >
            Blog Posts
          </Button>
          <Button
            onClick={() => navigate('/admin/papers')}
            colorScheme={!isInBlogSection ? 'blue' : 'gray'}
            variant={!isInBlogSection ? 'solid' : 'outline'}
          >
            Research Papers
          </Button>
        </HStack>

        <Box>
          <Routes>
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/:id" element={<BlogForm />} />
            <Route path="papers" element={<PaperList />} />
            <Route path="papers/new" element={<PaperForm />} />
            <Route path="papers/:id" element={<PaperForm />} />
          </Routes>
        </Box>
      </VStack>
    </Container>
  );
};

export default Admin; 