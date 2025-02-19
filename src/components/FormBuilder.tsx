import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Type definition for a question
interface Question {
  id: string;
  type: 'short' | 'mcq' | 'checkbox' | 'file';
  question: string;
  options?: string[];
  file?: File | null;
}

const FormBuilder: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newOptions, setNewOptions] = useState<{ [key: string]: string }>({});

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedQuestions = [...questions];
    const [moved] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, moved);
    setQuestions(reorderedQuestions);
  };

  const addQuestion = (type: Question['type']) => {
    if (!newQuestion.trim()) return;
    setQuestions(prev => [
      ...prev,
      {
        id: `question-${prev.length + 1}`,
        type,
        question: newQuestion,
        options: type === 'mcq' || type === 'checkbox' ? [] : undefined,
      },
    ]);
    setNewQuestion('');
  };

  const addOption = (index: number) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index && q.options ? { ...q, options: [...q.options, newOptions[q.id] || ''] } : q
    );
    setQuestions(updatedQuestions);
    setNewOptions(prev => ({ ...prev, [questions[index].id]: '' }));
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Form Builder
      </Typography>
      <TextField
        label="New Question"
        fullWidth
        margin="normal"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="contained" onClick={() => addQuestion('short')}>Short Answer</Button>
        <Button variant="contained" onClick={() => addQuestion('mcq')}>MCQ</Button>
        <Button variant="contained" onClick={() => addQuestion('checkbox')}>Checkbox</Button>
        <Button variant="contained" onClick={() => addQuestion('file')}>File Upload</Button>
      </Box>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {questions.map((q, index) => (
                <Draggable key={q.id} draggableId={q.id} index={index}>
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                      <Typography variant="h6">{q.question}</Typography>
                      {q.type === 'short' && <TextField fullWidth margin="normal" />}
                      {(q.type === 'mcq' || q.type === 'checkbox') && (
                        <Box>
                          {q.options?.map((option, i) => (
                            <FormControlLabel key={`${q.id}-option-${i}`} control={<Checkbox />} label={option} />
                          ))}
                          <TextField
                            label="New Option"
                            fullWidth
                            margin="normal"
                            value={newOptions[q.id] || ''}
                            onChange={(e) => setNewOptions(prev => ({ ...prev, [q.id]: e.target.value }))}
                          />
                          <Button variant="contained" onClick={() => addOption(index)}>Add Option</Button>
                        </Box>
                      )}
                      {q.type === 'file' && (
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setQuestions(prev => prev.map((q, i) => i === index ? { ...q, file } : q));
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default FormBuilder;

