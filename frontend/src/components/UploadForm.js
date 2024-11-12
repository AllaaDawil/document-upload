import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]); // Store search results
  const [noResults, setNoResults] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload', formData);
      alert('File uploaded successfully!');
      setFile(null); // Reset file input
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed.');
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return; // Don't search if query is empty

    try {
      // Send the search query to the server
      const response = await axios.get(`http://localhost:5000/files`);
      const allFiles = response.data;

      // Filter files that match the search query
      const matchedFiles = allFiles.filter(file =>
        file.toLowerCase().includes(searchQuery.toLowerCase())
      );

      
     
      // Append matched files to existing results without clearing
      setResults(prevResults => [...prevResults, ...matchedFiles]);
      setNoResults(matchedFiles.length === 0);
    } catch (error) {
      console.error('Error searching for files:', error);
      alert('Search failed.');
    }
  };

  const handleClear = () => {
    setResults([]); // Clear the results list
    setSearchQuery(''); // Clear the search input
  };

  const handleDownload = (filename) => {
    window.open(`http://localhost:5000/download/${filename}`, '_blank');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, margin: 'auto', marginTop: 10, }}>
      <Typography variant="h5">Upload Documents</Typography>
      
      <Button variant="contained" component="label">
        Select File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {file && (
        <Typography variant="body2">Selected file: {file.name}</Typography>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleUpload} 
        disabled={!file}
      >
        Upload
      </Button>

      <TextField
        label="Search for Document"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>

      {/* Clear List Button */}
      <Button variant="outlined" color="secondary" onClick={handleClear}>
        Clear List
      </Button>

      <Box mt={3}>
  {results.length > 0 ? (
    results.map((file, index) => (
      <Box key={index} display="flex" alignItems="center" justifyContent="space-between">
        <Typography>{file}</Typography>
        <Button onClick={() => handleDownload(file)} variant="outlined" size="small">
          Download
        </Button>
      </Box>
    ))
  ) : (
    noResults && 
    <Typography color='error'>
        Invalid file name
    </Typography>
  )}
  </Box>
</Box>
  );
}

export default UploadForm;
