import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, IconButton, Box } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import { Add, Remove, Delete } from '@mui/icons-material';

const Cart = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('https://ubeer-api/api/user/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.items) {
          setCart(data.items);
        } else {
          console.error('Data is null or items is missing');
        }
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateCartItemQuantity = async (beerId, quantity) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('https://ubeer-api/api/user/cart', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ beerId, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.items) {
          setCart(data.items);
        } else {
          console.error('Data is null or items is missing');
        }
      } else {
        console.error('Failed to update item quantity');
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const removeCartItem = async (beerId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('https://ubeer-api/api/user/cart', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ beerId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.items) {
          setCart(data.items);
        } else {
          console.error('Data is null or items is missing');
        }
      } else {
        console.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.quantity * item.beerId.price, 0).toFixed(2);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>Your Cart</Typography>
      <List>
        {cart.map(item => (
          <ListItem key={item.beerId._id}>
            <ListItemText
              primary={`${item.beerId.name} - ${item.quantity} x ${item.beerId.price} €`}
            />
            <Box>
              <IconButton onClick={() => updateCartItemQuantity(item.beerId._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                <Remove />
              </IconButton>
              {item.quantity}
              <IconButton onClick={() => updateCartItemQuantity(item.beerId._id, item.quantity + 1)}>
                <Add />
              </IconButton>
              <IconButton onClick={() => removeCartItem(item.beerId._id)}>
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" gutterBottom>Total Price: {calculateTotalPrice()} €</Typography>
      <Button variant="contained" color="primary">Checkout</Button>
    </Container>
  );
};

export default Cart;
