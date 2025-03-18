import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import ProfileImageUpload from './ProfileImageUpload'
import { useTheme } from '../context/ThemeContext'
import { formatDate } from '../utils/formatters'

function Account() {
  const { user, loading, error, changePassword } = useAuth()
  const { theme } = useTheme()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Style classes based on theme
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-[#242424]'
  const inputBgClass = theme === 'light' ? 'bg-gray-100' : 'bg-[#1C1C1C]'
  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-700'
  const textClass = theme === 'light' ? 'text-gray-800' : 'text-white'
  const textMutedClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300'
  const focusClass = theme === 'light' ? 'focus:border-[#67329E]' : 'focus:border-[#67329E]'

  // Material UI Theme basierend auf dem aktuellen Theme
  const muiTheme = createTheme({
    palette: {
      mode: theme === 'light' ? 'light' : 'dark',
      primary: {
        main: '#67329E', // Themefarbe (Violet)
      },
      background: {
        default: theme === 'light' ? '#ffffff' : '#1C1C1C',
        paper: theme === 'light' ? '#ffffff' : '#242424',
      },
      text: {
        primary: theme === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
        secondary: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
      },
    },
  });

  const handleClickShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setAlert({ type: 'error', message: 'Bitte fülle alle Felder aus.' });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ type: 'error', message: 'Die neuen Passwörter stimmen nicht überein.' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Das neue Passwort muss mindestens 6 Zeichen lang sein.' });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      
      if (response && response.success) {
        setAlert({ type: 'success', message: response.msg || 'Passwort erfolgreich geändert!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(response?.msg || 'Unbekannter Fehler beim Ändern des Passworts');
      }
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.msg || error.message || 'Fehler beim Ändern des Passworts.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Laden...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 text-white p-4 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mein Konto</h1>
        
        <ProfileImageUpload />
        
        <Container maxWidth="lg" sx={{ p: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Persönliche Informationen
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Vorname"
                        value={user.firstName || ''}
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Nachname"
                        value={user.lastName || ''}
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="E-Mail"
                        value={user.email || ''}
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Konto erstellt am"
                        value={formatDate(user.createdAt) || ''}
                        fullWidth
                        disabled
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Passwort ändern
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {alert.message && (
                    <Alert 
                      severity={alert.type} 
                      sx={{ mb: 2 }}
                      onClose={() => setAlert({ type: '', message: '' })}
                    >
                      {alert.message}
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel htmlFor="current-password">Aktuelles Passwort</InputLabel>
                          <OutlinedInput
                            id="current-password"
                            name="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={handleInputChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowCurrentPassword}
                                  edge="end"
                                >
                                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Aktuelles Passwort"
                          />
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel htmlFor="new-password">Neues Passwort</InputLabel>
                          <OutlinedInput
                            id="new-password"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handleInputChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowNewPassword}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Neues Passwort"
                          />
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel htmlFor="confirm-password">Passwort bestätigen</InputLabel>
                          <OutlinedInput
                            id="confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handleInputChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowConfirmPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Passwort bestätigen"
                          />
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          color="primary" 
                          fullWidth
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Wird gespeichert...' : 'Passwort ändern'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default Account 