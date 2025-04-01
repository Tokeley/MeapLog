import { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  InputGroup,
  InputRightElement,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { getBlogTags, getPaperTags } from '../utils/api';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  type: 'blog' | 'paper';
}

const tagColors = [
  'blue',
  'green',
  'red',
  'purple',
  'orange',
  'teal',
  'cyan',
  'pink',
  'yellow',
  'linkedin',
];

const TagSelector = ({ selectedTags, onTagsChange, type }: TagSelectorProps) => {
  const [newTag, setNewTag] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = type === 'blog' ? await getBlogTags() : await getPaperTags();
        setAvailableTags(tags.filter(tag => !selectedTags.includes(tag)));
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, [type, selectedTags]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      onTagsChange([...selectedTags, tag.trim()]);
      setNewTag('');
      setSuggestions([]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTag(value);
    
    if (value.trim()) {
      const filtered = availableTags.filter(tag =>
        tag.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const getTagColor = (tag: string) => {
    const index = availableTags.indexOf(tag) % tagColors.length;
    return tagColors[index];
  };

  return (
    <Box>
      <InputGroup>
        <Input
          value={newTag}
          onChange={handleInputChange}
          placeholder="Add a tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newTag.trim()) {
              e.preventDefault();
              handleAddTag(newTag);
            }
          }}
        />
        <InputRightElement>
          <Button
            size="sm"
            onClick={() => handleAddTag(newTag)}
            isDisabled={!newTag.trim()}
          >
            Add
          </Button>
        </InputRightElement>
      </InputGroup>

      {suggestions.length > 0 && (
        <Wrap mt={2} spacing={2}>
          {suggestions.map((tag) => (
            <WrapItem key={tag}>
              <Tag
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme={getTagColor(tag)}
                cursor="pointer"
                onClick={() => handleAddTag(tag)}
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}

      <Wrap mt={4} spacing={2}>
        {selectedTags.map((tag) => (
          <WrapItem key={tag}>
            <Tag
              size="md"
              borderRadius="full"
              variant="solid"
              colorScheme={getTagColor(tag)}
            >
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(tag)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default TagSelector; 