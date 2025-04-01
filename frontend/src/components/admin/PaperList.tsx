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
import { DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { ResearchPaper } from '../../types';
import { getPapers, deletePaper } from '../../utils/api';

const PaperList = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const data = await getPapers();
        setPapers(data);
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handleDelete = async (paperId: string) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;

    try {
      await deletePaper(paperId);
      setPapers(papers.filter((p) => p._id !== paperId));
    } catch (error) {
      console.error('Error deleting paper:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <RouterLink to="/admin/papers/new">
          <Button colorScheme="blue">New Paper</Button>
        </RouterLink>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Authors</Th>
              <Th>Year</Th>
              <Th>Status</Th>
              <Th>Tags</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {papers.map((paper) => (
              <Tr key={paper._id}>
                <Td>{paper.title}</Td>
                <Td>{paper.authors.join(', ')}</Td>
                <Td>{paper.year}</Td>
                <Td>
                  <Badge colorScheme={paper.isRead ? 'green' : 'yellow'}>
                    {paper.isRead ? 'Read' : 'Unread'}
                  </Badge>
                </Td>
                <Td>
                  <HStack gap={2}>
                    {paper.tags.map((tag) => (
                      <Badge key={tag} colorScheme="blue">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Td>
                <Td>
                  <HStack gap={2}>
                    <RouterLink to={`/admin/papers/${paper._id}/edit`}>
                      <Button colorScheme="blue">Edit</Button>
                    </RouterLink>
                    <IconButton
                      aria-label="Delete paper"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(paper._id)}
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

export default PaperList; 