import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  IconButton,
  useDisclosure,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { BlogPost } from '../types';
import { getBlogPost, deleteBlogPost } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import MDEditor from '@uiw/react-markdown-editor';

const BlogPostView = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogPost(id!);
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deleteBlogPost(id!);
      window.location.href = '/blog';
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Post not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="xl">
            {post.title}
          </Heading>
          {user?.isAdmin && (
            <HStack>
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
                onClick={handleDelete}
              />
            </HStack>
          )}
        </Box>

        <HStack>
          <Badge colorScheme={post.status === 'published' ? 'green' : 'yellow'}>
            {post.status}
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} colorScheme="blue">
              {tag}
            </Badge>
          ))}
        </HStack>

        <Text color="gray.600">
          By {post.author.username} on{' '}
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>

        <Box className="markdown-content">
          <MDEditor.Markdown source={post.content} />
        </Box>
      </VStack>
    </Container>
  );
};

export default BlogPostView; 