import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth0 } from "@auth0/auth0-react";

const BeerManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [beers, setBeers] = useState([]);
  const [breweries, setBreweries] = useState([]);
  const [formats, setFormats] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentBeer, setCurrentBeer] = useState({ id: '', name: '', style: '', price: '', type: '', abv: '', ibu: '', description: '', breweryId: '', formatId: '', imageUrl: '' });

  const fetchBreweries = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch('https://ubeer-api/api/brewery/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setBreweries(data);
  }, [getAccessTokenSilently]);

  const fetchFormats = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch('https://ubeer-api/api/format/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setFormats(data);
  }, [getAccessTokenSilently]);

  const fetchBeers = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch('https://ubeer-api/api/beer/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setBeers(data);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchBreweries();
    fetchFormats();
    fetchBeers();
  }, [fetchBeers, fetchBreweries, fetchFormats]);

  const handleOpen = (beer = { id: '', name: '', style: '', price: '', type: '', abv: '', ibu: '', description: '', breweryId: '', formatId: '', imageUrl: '' }) => {
    setCurrentBeer(beer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setCurrentBeer({ ...currentBeer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = await getAccessTokenSilently();

    // Validation des données avant l'envoi
    if (!currentBeer.name || !currentBeer.style || !currentBeer.price || !currentBeer.type || !currentBeer.abv || !currentBeer.ibu || !currentBeer.breweryId || !currentBeer.formatId) {
      alert("Please fill all the required fields.");
      return;
    }

    const method = currentBeer.id ? 'PUT' : 'POST';
    const url = currentBeer.id ? `https://ubeer-api/api/beer/put/${currentBeer.id}` : `https://localhost:4000/api/beer/post`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: currentBeer.name,
        style: currentBeer.style,
        type: currentBeer.type,
        abv: parseFloat(currentBeer.abv),
        ibu: parseInt(currentBeer.ibu, 10),
        description: currentBeer.description,
        price: parseFloat(currentBeer.price),
        imageUrl: currentBeer.imageUrl,
        breweryId: parseInt(currentBeer.breweryId, 10),
        formatId: parseInt(currentBeer.formatId, 10)
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      alert(`Error: ${errorData.message}`);
      return;
    }

    fetchBeers();
    handleClose();
  };

  const handleDelete = async (id) => {
    const token = await getAccessTokenSilently();
    await fetch(`https://ubeer-api/api/beer/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchBeers();
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>Manage Beers</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Beer</Button>
      <List>
        {beers.map((beer) => (
          <ListItem key={beer.id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(beer)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(beer.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={beer.name} secondary={`${beer.style}, ${beer.type}`} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentBeer.id ? 'Edit Beer' : 'Add Beer'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            value={currentBeer.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Style"
            name="style"
            value={currentBeer.style}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Type"
            name="type"
            value={currentBeer.type}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="ABV"
            name="abv"
            value={currentBeer.abv}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="IBU"
            name="ibu"
            value={currentBeer.ibu}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={currentBeer.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Image URL"
            name="imageUrl"
            value={currentBeer.imageUrl}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            value={currentBeer.price}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Brewery</InputLabel>
            <Select
              name="breweryId"
              value={currentBeer.breweryId}
              onChange={handleChange}
            >
              {breweries.map((brewery) => (
                <MenuItem key={brewery.id} value={brewery.id}>{brewery.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Format</InputLabel>
            <Select
              name="formatId"
              value={currentBeer.formatId}
              onChange={handleChange}
            >
              {formats.map((format) => (
                <MenuItem key={format.id} value={format.id}>{format.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{currentBeer.id ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BeerManagement;
