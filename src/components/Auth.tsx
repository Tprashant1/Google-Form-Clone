import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from '../supabaseClient';
import { Button, TextField, Box, Typography } from '@mui/material';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
      } else {
        alert(isSignUp ? 'Check your email for confirmation!' : 'Signed in successfully!');
        navigate('/form-builder'); // Redirect to FormBuilder page
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 300, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" fullWidth onClick={handleAuth} disabled={loading} sx={{ mt: 2 }}>
        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
      <Button fullWidth onClick={() => setIsSignUp(!isSignUp)} sx={{ mt: 1 }}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default Auth;
