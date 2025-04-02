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
  IconButton,
  useDisclosure,
  CloseButton,
  Link,
  Tooltip,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/modal';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { ResearchPaper } from '../types';
import { getPapers, getPaperTags, togglePaperRead, deletePaper } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import MDEditor from '@uiw/react-markdown-editor';
import { Checkbox } from '@chakra-ui/checkbox';
import FilterBar from '../components/FilterBar';

const Papers = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [papersData, tagsData] = await Promise.all([
          getPapers(),
          getPaperTags()
        ]);
        setPapers(papersData);
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
    let filtered = [...papers];

    if (selectedTags.length > 0) {
      filtered = filtered.filter(paper => 
        selectedTags.every(tag => paper.tags.includes(tag))
      );
    }

    if (isReadOnly) {
      filtered = filtered.filter(paper => !paper.isRead);
    }

    setFilteredPapers(filtered);
  }, [papers, selectedTags, isReadOnly]);

  const handleToggleRead = async (paperId: string) => {
    try {
      const updatedPaper = await togglePaperRead(paperId);
      setPapers(papers.map((p) => (p._id === paperId ? updatedPaper : p)));
    } catch (error) {
      console.error('Error toggling paper read status:', error);
    }
  };

  const handleDelete = async (paperId: string) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;

    try {
      await deletePaper(paperId);
      setPapers(papers.filter((p) => p._id !== paperId));
    } catch (error) {
      console.error('Error deleting paper:', error);
    }
  };

  const handleViewNotes = (paper: ResearchPaper) => {
    setSelectedPaper(paper);
    onOpen();
  };

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
            Research Papers
          </Heading>
          {user?.isAdmin && (
            <RouterLink to="/admin/papers/new">
              <Button colorScheme="blue">Add Paper</Button>
            </RouterLink>
          )}
        </Box>

        <FilterBar
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagSelect={(tag) => setSelectedTags([...selectedTags, tag])}
          onTagRemove={(tag) => setSelectedTags(selectedTags.filter(t => t !== tag))}
          showReadFilter={true}
          isReadOnly={isReadOnly}
          onReadFilterChange={setIsReadOnly}
        />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {filteredPapers.map((paper) => (
            <Box
              key={paper._id}
              p={6}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="lg"
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <VStack align="stretch" gap={4}>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Heading as="h2" size="md">
                    {paper.title}
                  </Heading>
                  {user?.isAdmin && (
                    <HStack>
                      <RouterLink to={`/admin/papers/${paper._id}`}>
                        <IconButton
                          aria-label="Edit paper"
                          icon={<EditIcon />}
                          variant="ghost"
                        />
                      </RouterLink>
                      <IconButton
                        aria-label="Delete paper"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(paper._id)}
                      />
                    </HStack>
                  )}
                </Box>

                <Text color="gray.600">
                  {paper.authors.join(', ')} ({paper.year})
                </Text>

                <Tooltip label={paper.abstract} placement="top">
                  <Text color="gray.600" noOfLines={3} cursor="help">
                    {paper.abstract}
                  </Text>
                </Tooltip>

                <HStack>
                  <Checkbox
                    isChecked={paper.isRead}
                    onChange={() => handleToggleRead(paper._id)}
                  >
                    Read
                  </Checkbox>
                  {paper.tags.map((tag) => (
                    <Badge key={tag} colorScheme="blue">
                      {tag}
                    </Badge>
                  ))}
                </HStack>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewNotes(paper)}
                >
                  View Notes
                </Button>

                {paper.url && (
                  <Link href={paper.url} isExternal color="blue.500">
                    View Paper
                  </Link>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
              {selectedPaper?.title} - Notes
              <CloseButton onClick={onClose} />
            </ModalHeader>
            <ModalBody pb={6}>
              <MDEditor.Markdown source={selectedPaper?.notes || 'No notes available.'} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Papers; 