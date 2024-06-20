import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [beers, setBeers] = useState([]);
  const [breweries, setBreweries] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [selectedBrewery, setSelectedBrewery] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);

  useEffect(() => {
    fetchBeers();
    fetchBreweries();
    fetchFormats();
  }, []);

  const fetchBeers = async () => {
    try {
      const response = await fetch('/api/beer/get');
      const data = await response.json();
      setBeers(data);
    } catch (error) {
      console.error('Error fetching beers:', error);
    }
  };

  const fetchBreweries = async () => {
    try {
      const response = await fetch('/api/brewery/get');
      const data = await response.json();
      setBreweries(data);
    } catch (error) {
      console.error('Error fetching breweries:', error);
    }
  };

  const fetchFormats = async () => {
    try {
      const response = await fetch('/api/format/get');
      const data = await response.json();
      setFormats(data);
    } catch (error) {
      console.error('Error fetching formats:', error);
    }
  };

  const handleBeerSubmit = async (event) => {
    event.preventDefault();
    console.log(selectedBeer);
    try {
      const method = selectedBeer?.id ? 'PUT' : 'POST';
      const url = selectedBeer?.id ? `/api/beer/put/${selectedBeer.id}` : '/api/beer/post';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedBeer)
      });
      if (response.ok) {
        fetchBeers();
        setSelectedBeer(null);
      } else {
        console.error('Error saving beer:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving beer:', error);
    }
  };

  const handleBrewerySubmit = async (event) => {
    event.preventDefault();
    try {
      const method = selectedBrewery?.id ? 'PUT' : 'POST';
      const url = selectedBrewery?.id ? `/api/brewery/put/${selectedBrewery.id}` : '/api/brewery/post';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedBrewery)
      });
      if (response.ok) {
        fetchBreweries();
        setSelectedBrewery(null);
      } else {
        console.error('Error saving brewery:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving brewery:', error);
    }
  };

  const handleFormatSubmit = async (event) => {
    event.preventDefault();
    try {
      const method = selectedFormat?.id ? 'PUT' : 'POST';
      const url = selectedFormat?.id ? `/api/format/put/${selectedFormat.id}` : '/api/format/post';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedFormat)
      });
      if (response.ok) {
        fetchFormats();
        setSelectedFormat(null);
      } else {
        console.error('Error saving format:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving format:', error);
    }
  };

  const handleDeleteBeer = async (id) => {
    try {
      const response = await fetch(`/api/beer/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchBeers();
      } else {
        console.error('Error deleting beer:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting beer:', error);
    }
  };

  const handleDeleteBrewery = async (id) => {
    try {
      const response = await fetch(`/api/brewery/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchBreweries();
      } else {
        console.error('Error deleting brewery:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting brewery:', error);
    }
  };

  const handleDeleteFormat = async (id) => {
    try {
      const response = await fetch(`/api/format/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchFormats();
      } else {
        console.error('Error deleting format:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting format:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      
      <section>
        <h2>Manage Beers</h2>
        <form onSubmit={handleBeerSubmit}>
          {/* Beer form inputs */}
          <button type="submit">{selectedBeer ? 'Update Beer' : 'Add Beer'}</button>
        </form>
        <ul>
          {beers.map((beer) => (
            <li key={beer.id}>
              {beer.name} - {beer.style}
              <button onClick={() => setSelectedBeer(beer)}>Edit</button>
              <button onClick={() => handleDeleteBeer(beer.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      
      <section>
        <h2>Manage Breweries</h2>
        <form onSubmit={handleBrewerySubmit}>
          {/* Brewery form inputs */}
          <button type="submit">{selectedBrewery ? 'Update Brewery' : 'Add Brewery'}</button>
        </form>
        <ul>
          {breweries.map((brewery) => (
            <li key={brewery.id}>
              {brewery.name} - {brewery.city}
              <button onClick={() => setSelectedBrewery(brewery)}>Edit</button>
              <button onClick={() => handleDeleteBrewery(brewery.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      
      <section>
        <h2>Manage Formats</h2>
        <form onSubmit={handleFormatSubmit}>
          {/* Format form inputs */}
          <button type="submit">{selectedFormat ? 'Update Format' : 'Add Format'}</button>
        </form>
        <ul>
          {formats.map((format) => (
            <li key={format.id}>
              {format.name} - {format.volume} {format.unit}
              <button onClick={() => setSelectedFormat(format)}>Edit</button>
              <button onClick={() => handleDeleteFormat(format.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
