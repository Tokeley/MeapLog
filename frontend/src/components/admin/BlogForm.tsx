import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  HStack,
  CloseButton,
  Button,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { BlogPost } from '../../types';
import { getBlogPost, createBlogPost, updateBlogPost } from '../../utils/api';
import MDEditor from '@uiw/react-markdown-editor';
import TagSelector from '../TagSelector';

const BlogForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    caption: '',
    content: '',
    status: 'draft',
    tags: [],
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getBlogPost(id);
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        await updateBlogPost(id, post as BlogPost);
      } else {
        await createBlogPost(post as BlogPost);
      }
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Heading as="h1" size="xl">
          {id ? 'Edit Blog Post' : 'New Blog Post'}
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="medium">Title *</Text>
              <Input
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                placeholder="Enter post title"
                required
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Caption</Text>
              <Input
                value={post.caption}
                onChange={(e) => setPost({ ...post, caption: e.target.value })}
                placeholder="Enter a brief caption for the blog post"
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Content *</Text>
              <Box minH="400px" borderWidth="1px" borderRadius="md">
                <MDEditor
                  value={post.content}
                  onChange={(val) => setPost({ ...post, content: val || '' })}
                  height="400px"
                />
              </Box>
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Status *</Text>
              <Select
                value={post.status}
                onChange={(e) => setPost({ ...post, status: e.target.value as 'draft' | 'published' })}
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Tags</Text>
              <TagSelector
                selectedTags={post.tags || []}
                onTagsChange={(tags) => setPost({ ...post, tags })}
                type="blog"
              />
            </Box>

            <HStack gap={4} justify="flex-end">
              <Button variant="outline" onClick={() => navigate('/admin/blog')}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                {id ? 'Update' : 'Create'}
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default BlogForm; 