import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
  SimpleGrid,
  Badge,
  HStack,
  Wrap,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { BlogPost } from '../types';
import { getBlogPosts, getBlogTags } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, tagsData] = await Promise.all([
          getBlogPosts(),
          getBlogTags()
        ]);
        setPosts(postsData);
        setAvailableTags(tagsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...posts];

    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedTags]);

  if (isLoading) {
    return (
      <Box py={8}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <VStack gap={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="xl">
            Logs
          </Heading>
          {user?.isAdmin && (
            <RouterLink to="/admin/blog/new">
              <Button colorScheme="blue">New Post</Button>
            </RouterLink>
          )}
        </Box>

        <FilterBar
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagSelect={(tag) => setSelectedTags([...selectedTags, tag])}
          onTagRemove={(tag) => setSelectedTags(selectedTags.filter(t => t !== tag))}
        />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {filteredPosts.map((post) => (
            <Box
              key={post._id}
              p={6}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="lg"
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <VStack align="stretch" gap={4}>
                <RouterLink to={`/blog/${post._id}`}>
                  <Heading as="h2" size="md" _hover={{ color: 'blue.500' }}>
                    {post.title}
                  </Heading>
                </RouterLink>

                <Text color="gray.600">
                  By {post.author.username} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>

                <Text color="gray.600" noOfLines={3}>
                  {post.caption}
                </Text>

                <Box overflowX="hidden">
                  <HStack spacing={2} overflowX="hidden">
                    {post.tags.map((tag) => (
                      <Badge key={tag} colorScheme="blue" whiteSpace="nowrap">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>

                {user?.isAdmin && (
                  <HStack justify="flex-end">
                    <RouterLink to={`/admin/blog/${post._id}`}>
                      <IconButton
                        aria-label="Edit post"
                        icon={<EditIcon />}
                        variant="ghost"
                      />
                    </RouterLink>
                    <IconButton
                      aria-label="Delete post"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(post._id)}
                    />
                  </HStack>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Blog; 