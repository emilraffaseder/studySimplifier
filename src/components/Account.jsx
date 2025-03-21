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
import { Visibility, VisibilityOff, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import ProfileImageUpload from './ProfileImageUpload'
import { useTheme } from '../context/ThemeContext'
import { formatDate } from '../utils/formatters'

function Account() {
  const { user, loading, error, changePassword, updateUserProfile } = useAuth()
  const { theme } = useTheme()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmProfilePassword, setShowConfirmProfilePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    confirmPassword: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [profileAlert, setProfileAlert] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

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
  const handleClickShowConfirmProfilePassword = () => setShowConfirmProfilePassword(!showConfirmProfilePassword);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmitPassword = async (e) => {
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

  const handleStartEditProfile = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      confirmPassword: ''
    });
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfileAlert({ type: '', message: '' });
  };

  const handleSubmitProfileChanges = async (e) => {
    e.preventDefault();
    
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      setProfileAlert({ type: 'error', message: 'Bitte fülle alle Felder aus.' });
      return;
    }
    
    if (!profileData.confirmPassword) {
      setProfileAlert({ type: 'error', message: 'Bitte gib dein Passwort zur Bestätigung ein.' });
      return;
    }
    
    try {
      setIsProfileSubmitting(true);
      const response = await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        password: profileData.confirmPassword
      });
      
      if (response && response.success) {
        setProfileAlert({ type: 'success', message: 'Profil erfolgreich aktualisiert!' });
        setIsEditingProfile(false);
        setProfileData({
          firstName: '',
          lastName: '',
          email: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(response?.msg || 'Unbekannter Fehler beim Aktualisieren des Profils');
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error);
      setProfileAlert({
        type: 'error',
        message: error.response?.data?.msg || error.message || 'Fehler beim Aktualisieren des Profils.'
      });
    } finally {
      setIsProfileSubmitting(false);
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Persönliche Informationen
                    </Typography>
                    {!isEditingProfile ? (
                      <IconButton color="primary" onClick={handleStartEditProfile}>
                        <EditIcon />
                      </IconButton>
                    ) : null}
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {profileAlert.message && (
                    <Alert 
                      severity={profileAlert.type} 
                      sx={{ mb: 2 }}
                      onClose={() => setProfileAlert({ type: '', message: '' })}
                    >
                      {profileAlert.message}
                    </Alert>
                  )}
                  
                  {isEditingProfile ? (
                    <form onSubmit={handleSubmitProfileChanges}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Vorname"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileInputChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Nachname"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileInputChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="E-Mail"
                            name="email"
                type="email"
                            value={profileData.email}
                            onChange={handleProfileInputChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="confirm-profile-password">Passwort zur Bestätigung</InputLabel>
                            <OutlinedInput
                              id="confirm-profile-password"
                              name="confirmPassword"
                              type={showConfirmProfilePassword ? 'text' : 'password'}
                              value={profileData.confirmPassword}
                              onChange={handleProfileInputChange}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirmProfilePassword}
                                    edge="end"
                                  >
                                    {showConfirmProfilePassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Passwort zur Bestätigung"
                              required
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              type="submit"
                              disabled={isProfileSubmitting}
                              startIcon={<SaveIcon />}
                              sx={{ flex: 1 }}
                            >
                              {isProfileSubmitting ? 'Wird gespeichert...' : 'Änderungen speichern'}
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleCancelEditProfile}
                              sx={{ flex: 1 }}
                            >
                              Abbrechen
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  ) : (
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
                  )}
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
                  
                  <form onSubmit={handleSubmitPassword}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel htmlFor="current-password">Aktuelles Passwort</InputLabel>
                          <OutlinedInput
                            id="current-password"
                            name="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordInputChange}
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
                            onChange={handlePasswordInputChange}
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
                            onChange={handlePasswordInputChange}
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