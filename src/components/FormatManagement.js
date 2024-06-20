import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth0 } from "@auth0/auth0-react";

const FormatManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [formats, setFormats] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentFormat, setCurrentFormat] = useState({ name: '', volume: '', unit: '' });



  const fetchFormats = useCallback( async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch('https://ubeer-api/api/format/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setFormats(data);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchFormats();
  }, [fetchFormats]);

  const handleOpen = (format = { name: '', volume: '', unit: '' }) => {
    setCurrentFormat(format);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setCurrentFormat({ ...currentFormat, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = await getAccessTokenSilently();

    // Validation des données avant l'envoi
    if (!currentFormat.name || !currentFormat.volume || !currentFormat.unit) {
      alert("Please fill all the required fields.");
      return;
    }

    const method = currentFormat.id ? 'PUT' : 'POST';
    const url = currentFormat.id ? `https://ubeer-api/api/format/${method.toLowerCase()}/${currentFormat.id}` : `https://localhost:4000/api/format/${method.toLowerCase()}/`;

    await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: currentFormat.name,
        volume: parseFloat(currentFormat.volume),
        unit: currentFormat.unit
      })
    });
    fetchFormats();
    handleClose();
  };

  const handleDelete = async (id) => {
    const token = await getAccessTokenSilently();
    await fetch(`https://ubeer-api/api/format/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchFormats();
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>Manage Formats</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Format</Button>
      <List>
        {formats.map((format) => (
          <ListItem key={format.id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(format)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(format.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={format.name} secondary={`${format.volume} ${format.unit}`} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentFormat.id ? 'Edit Format' : 'Add Format'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            value={currentFormat.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Volume"
            name="volume"
            type="number"
            value={currentFormat.volume}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Unit"
            name="unit"
            value={currentFormat.unit}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{currentFormat.id ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormatManagement;
