import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, TextField } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";

const Shop = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [beers, setBeers] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);


  useEffect(() => {
    fetchBeers();
  }, []);

  const fetchBeers = async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch('http://ubeer-api/api/beer/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setBeers(data);
  };

  const addToCart = async (beer, quantity) => {
    const token = await getAccessTokenSilently();
    const response = await fetch('http://ubeer-api/api/user/cart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ beerId: beer._id, quantity })
    });

    if (response.ok) {
      const cart = await response.json();
      setCart(cart.items);
    } else {
      console.error('Failed to add item to cart');
    }
  };

  const handleQuantityChange = (beerId, quantity) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [beerId]: quantity,
    }));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>Shop</Typography>
      <Grid container spacing={4}>
      {console.log(beers)}
        {beers.map(beer => (
            
          <Grid item key={beer._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={beer.image}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {beer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {beer.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {beer.price} €
                </Typography>
              </CardContent>
              <CardActions>
                <TextField
                  label="Quantity"
                  type="number"
                  defaultValue={1}
                  inputProps={{ min: 1 }}
                  onChange={(e) => handleQuantityChange(beer._id, parseInt(e.target.value) || 1)}
                />
                <Typography variant="h7" color="text.primary">
                  {beer.price * (quantities[beer._id] || 1)}€
                </Typography>                
                <Button size="small" color="primary" onClick={() => addToCart(beer, quantities[beer._id] || 1)}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Shop;
