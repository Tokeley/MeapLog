import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  Heading,
  Text,
  HStack,
  Box,
} from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/form-control';
import {
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/input';
import {
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/tag';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/number-input';
import { Checkbox } from '@chakra-ui/checkbox';
import { Button } from '@chakra-ui/button';
import { ResearchPaper } from '../../types';
import { getPaper, createPaper, updatePaper } from '../../utils/api';
import MDEditor from '@uiw/react-markdown-editor';
import TagSelector from '../TagSelector';

const PaperForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paper, setPaper] = useState<Partial<ResearchPaper>>({
    title: '',
    authors: [],
    year: new Date().getFullYear(),
    abstract: '',
    url: '',
    notes: '',
    tags: [],
    isRead: false,
  });
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getPaper(id);
        setPaper(data);
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!paper.title || !paper.authors || paper.authors.length === 0 || !paper.year) {
        alert('Please fill in all required fields');
        return;
      }

      const paperToSubmit: Omit<ResearchPaper, '_id' | 'addedBy' | 'createdAt' | 'updatedAt'> = {
        title: paper.title,
        authors: paper.authors,
        year: paper.year,
        abstract: paper.abstract || '',
        url: paper.url || '',
        notes: paper.notes || '',
        tags: paper.tags || [],
        isRead: paper.isRead || false,
      };

      if (id) {
        await updatePaper(id, paperToSubmit);
      } else {
        await createPaper(paperToSubmit);
      }
      navigate('/papers');
    } catch (error) {
      console.error('Error saving paper:', error);
      alert('Error saving paper');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAuthor = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newAuthor.trim()) {
      e.preventDefault();
      setPaper((prev) => ({
        ...prev,
        authors: [...(prev.authors || []), newAuthor.trim()],
      }));
      setNewAuthor('');
    }
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    setPaper((prev) => ({
      ...prev,
      authors: prev.authors?.filter((author) => author !== authorToRemove),
    }));
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Heading as="h1" size="xl">
          {id ? 'Edit Research Paper' : 'New Research Paper'}
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={paper.title}
                onChange={(e) => setPaper({ ...paper, title: e.target.value })}
                placeholder="Enter paper title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Authors</FormLabel>
              <InputGroup>
                <Input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  onKeyDown={handleAddAuthor}
                  placeholder="Add an author and press Enter"
                  isRequired={false}
                />
                <InputRightElement>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (newAuthor.trim()) {
                        setPaper((prev) => ({
                          ...prev,
                          authors: [...(prev.authors || []), newAuthor.trim()],
                        }));
                        setNewAuthor('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>
              <HStack gap={2} mt={2} flexWrap="wrap">
                {paper.authors?.map((author) => (
                  <Tag key={author} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>{author}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveAuthor(author)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Year</FormLabel>
              <NumberInput
                value={paper.year}
                onChange={(value) => setPaper({ ...paper, year: parseInt(value) })}
                min={1900}
                max={new Date().getFullYear()}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Abstract</FormLabel>
              <MDEditor
                value={paper.abstract || ''}
                onChange={(val) => setPaper({ ...paper, abstract: val })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>URL</FormLabel>
              <Input
                value={paper.url}
                onChange={(e) => setPaper({ ...paper, url: e.target.value })}
                placeholder="Enter paper URL"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Box minH="200px" borderWidth="1px" borderRadius="md">
                <MDEditor
                  value={paper.notes}
                  onChange={(val) => setPaper({ ...paper, notes: val || '' })}
                  height="200px"
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <TagSelector
                selectedTags={paper.tags || []}
                onTagsChange={(tags) => setPaper({ ...paper, tags })}
                type="paper"
              />
            </FormControl>

            <FormControl>
              <Checkbox
                isChecked={paper.isRead}
                onChange={(e) => setPaper({ ...paper, isRead: e.target.checked })}
              >
                Mark as read
              </Checkbox>
            </FormControl>

            <HStack gap={4} justify="flex-end">
              <Button variant="outline" onClick={() => navigate('/admin/papers')}>
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

export default PaperForm; 