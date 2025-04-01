import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { useMemo } from 'react';

const deliverables = {
  '1': 'Instrument report, abstract spec',
  '2': 'Preliminary Report, MVP (single note)',
  '3': 'Architecture, protocol, YAML template',
  '4': 'MEAP prototype (single instrument)',
  '5': 'Enhanced prototype (multi-instrument)',
  '6': 'Audio delay plugin',
  '7': 'Beta MEAP, feedback report',
  '8': 'Final MEAP, report and presentation',
};

interface Task {
  id: string;
  name: string;
  deliverable: string;
  startDate: Date;
  endDate: Date;
}

const tasks: Task[] = [
  {
    id: '1',
    name: 'Familiarisation',
    deliverable: deliverables['1'],
    startDate: new Date('2025-03-24'),
    endDate: new Date('2025-04-20'),
  },
  {
    id: '2',
    name: 'Research',
    deliverable: deliverables['2'],
    startDate: new Date('2025-04-14'),
    endDate: new Date('2025-05-18'),
  },
  {
    id: '3',
    name: 'Design',
    deliverable: deliverables['3'],
    startDate: new Date('2025-05-12'),
    endDate: new Date('2025-06-08'),
  },
  {
    id: '4',
    name: 'Core Implementation',
    deliverable: deliverables['4'],
    startDate: new Date('2025-06-02'),
    endDate: new Date('2025-07-13'),
  },
  {
    id: '5',
    name: 'Preview Mode & UI',
    deliverable: deliverables['5'],
    startDate: new Date('2025-07-07'),
    endDate: new Date('2025-08-17'),
  },
  {
    id: '6',
    name: 'Second VST Plugin',
    deliverable: deliverables['6'],
    startDate: new Date('2025-08-11'),
    endDate: new Date('2025-08-24'),
  },
  {
    id: '7',
    name: 'Testing & Refinement',
    deliverable: deliverables['7'],
    startDate: new Date('2025-08-18'),
    endDate: new Date('2025-09-14'),
  },
  {
    id: '8',
    name: 'Finalisation & Deliverables',
    deliverable: deliverables['8'],
    startDate: new Date('2025-09-08'),
    endDate: new Date('2025-10-15'),
  },
];

const ProjectTimeline = () => {
  const today = new Date();
  const chartStart = new Date('2025-03-01');
  const chartEnd = new Date('2025-10-31');
  
  const totalDays = useMemo(() => {
    return Math.ceil((chartEnd.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24));
  }, [chartEnd, chartStart]);

  const getTaskPosition = (date: Date) => {
    const daysFromStart = (Math.ceil((date.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24)));
    const position = (daysFromStart / totalDays) * 100;
    console.log(`Date: ${date.toLocaleDateString()}, Days from start: ${daysFromStart}, Position: ${position}%`);
    return position;
  };

  const getTodayPosition = () => {
    console.log('Today:', today.toLocaleDateString());
    console.log('Chart start:', chartStart.toLocaleDateString());
    console.log('Chart end:', chartEnd.toLocaleDateString());
    console.log('Total days:', totalDays);
    const position = getTaskPosition(today);
    console.log('Today position:', position);
    return position;
  };

  return (
    <Box
      width="100%"
      maxW="container.xl"
      overflowX="auto"
      mx="auto"
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      position="relative"
      minH="400px"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack spacing={0} position="relative" height="40px">
          <Box width="200px" flexShrink={0}>
            <Text fontWeight="bold">Task</Text>
          </Box>
          <Box flex={1} position="relative">
            <HStack spacing={0} position="absolute" width="100%" top="0">
              {Array.from({ length: 8 }, (_, i) => {
                const month = new Date(2025, i + 2); // March (2) to October (9)
                return (
                  <Box
                    key={i}
                    flex={1}
                    borderLeft="1px"
                    borderColor="gray.200"
                    p={2}
                    textAlign="center"
                  >
                    <Text fontSize="sm">{month.toLocaleString('default', { month: 'short' })}</Text>
                  </Box>
                );
              })}
            </HStack>
          </Box>
        </HStack>

        {/* Today indicator */}
        <Box
          position="absolute"
          left={`calc(185px + ${getTodayPosition()}%)`}
          top="0"
          bottom="0"
          width="2px"
          bg="red.500"
          zIndex={2}
        />
        <Text
          position="absolute"
          left={`calc(165px + ${getTodayPosition()}%)`}
          top="-20px"
          fontSize="xs"
          color="red.500"
          whiteSpace="nowrap"
          fontWeight="bold"
        >
          Today ({today.toLocaleDateString()})
        </Text>

        {/* Tasks */}
        <Box position="relative">
          {tasks.map((task) => (
            <HStack
              key={task.id}
              spacing={0}
              position="relative"
              height="40px"
              _hover={{ bg: 'gray.50' }}
            >
              <Box width="200px" flexShrink={0} p={2}>
                <Text fontWeight="medium">{task.name}</Text>
              </Box>
              <Box flex={1} position="relative" height="100%">
                <Box
                  position="absolute"
                  left={`${getTaskPosition(task.startDate)}%`}
                  width={`${getTaskPosition(task.endDate) - getTaskPosition(task.startDate)}%`}
                  height="20px"
                  top="50%"
                  transform="translateY(-50%)"
                  bg="blue.500"
                  borderRadius="md"
                  opacity={0.8}
                />
              </Box>
            </HStack>
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

export default ProjectTimeline;