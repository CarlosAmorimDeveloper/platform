import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TaskForm, TaskList } from '@/components';

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 4 }}>
        Minhas Tarefas
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TaskForm />
      </Box>
      <TaskList />
    </Container>
  );
}
