import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth0 } from "@auth0/auth0-react";

const BreweryManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [breweries, setBreweries] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentBrewery, setCurrentBrewery] = useState({ name: '', city: '', address: '' });


  const fetchBreweries = useCallback (async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch('http://localhost:4000/api/brewery/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setBreweries(data);
  }, [getAccessTokenSilently]);


  useEffect(() => {
    fetchBreweries();
  }, [fetchBreweries]);

  const handleOpen = (brewery = { name: '', city: '', address: '' }) => {
    setCurrentBrewery(brewery);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setCurrentBrewery({ ...currentBrewery, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = await getAccessTokenSilently();

    // Validation des données avant l'envoi
    if (!currentBrewery.name || !currentBrewery.city || !currentBrewery.address) {
      alert("Please fill all the required fields.");
      return;
    }

    const method = currentBrewery.id ? 'PUT' : 'POST';
    const url = currentBrewery.id ? `http://localhost:4000/api/brewery/${method.toLowerCase()}/${currentBrewery.id}` : `http://localhost:4000/api/brewery/${method.toLowerCase()}/`;

    await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentBrewery)
    });
    fetchBreweries();
    handleClose();
  };

  const handleDelete = async (id) => {
    const token = await getAccessTokenSilently();
    await fetch(`http://localhost:4000/api/brewery/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchBreweries();
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>Manage Breweries</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Brewery</Button>
      <List>
        {breweries.map((brewery) => (
          <ListItem key={brewery.id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(brewery)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(brewery.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={brewery.name} secondary={`${brewery.city}, ${brewery.address}`} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentBrewery.id ? 'Edit Brewery' : 'Add Brewery'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            value={currentBrewery.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="City"
            name="city"
            value={currentBrewery.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            value={currentBrewery.address}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{currentBrewery.id ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BreweryManagement;
