import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  HStack,
  Badge,
  Text,
} from '@chakra-ui/react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from '@chakra-ui/table';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { BlogPost } from '../../types';
import { getBlogPosts, deleteBlogPost } from '../../utils/api';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deleteBlogPost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <RouterLink to="/admin/blog/new">
          <Button colorScheme="blue">New Post</Button>
        </RouterLink>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Tags</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts.map((post) => (
              <Tr key={post._id}>
                <Td>{post.title}</Td>
                <Td>
                  <Badge colorScheme={post.status === 'published' ? 'green' : 'yellow'}>
                    {post.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack gap={2}>
                    {post.tags.map((tag) => (
                      <Badge key={tag} colorScheme="blue">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Td>
                <Td>{new Date(post.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <HStack gap={2}>
                    <RouterLink to={`/admin/blog/${post._id}`}>
                      <IconButton
                        aria-label="Edit post"
                        size="sm"
                      >
                        <EditIcon />
                      </IconButton>
                    </RouterLink>
                    <IconButton
                      aria-label="Delete post"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(post._id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default BlogList; 