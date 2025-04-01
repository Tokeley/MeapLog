import {
  Box,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Checkbox,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface FilterBarProps {
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  showReadFilter?: boolean;
  isReadOnly?: boolean;
  onReadFilterChange?: (value: boolean) => void;
}

const FilterBar = ({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  showReadFilter = false,
  isReadOnly = false,
  onReadFilterChange,
}: FilterBarProps) => {
  const unusedTags = availableTags.filter(tag => !selectedTags.includes(tag));

  return (
    <Box p={4} bg="gray.50" borderRadius="md">
      <HStack spacing={4} wrap="wrap">
        <Text fontWeight="bold">Filters:</Text>
        
        {showReadFilter && onReadFilterChange && (
          <Checkbox
            isChecked={isReadOnly}
            onChange={(e) => onReadFilterChange(e.target.checked)}
          >
            To be read
          </Checkbox>
        )}

        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <Tag
              key={tag}
              size="md"
              borderRadius="full"
              variant="solid"
              colorScheme="blue"
            >
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => onTagRemove(tag)} />
            </Tag>
          ))
        ) : (
          <Text color="gray.500">No filters selected</Text>
        )}

        {unusedTags.length > 0 && (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
              Add Filter
            </MenuButton>
            <MenuList>
              {unusedTags.map((tag) => (
                <MenuItem key={tag} onClick={() => onTagSelect(tag)}>
                  {tag}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Box>
  );
};

export default FilterBar; 