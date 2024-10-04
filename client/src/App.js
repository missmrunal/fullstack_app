import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
 import './App.css';

const CandidateManager = () => {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [age, setAge] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log(candidates)

  const apiUrl = 'http://localhost:8000';

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${apiUrl}/`);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCandidate = { name, position, age };

    if (editingIndex !== null) {
      // Edit existing candidate
      try {
        await axios.put(`${apiUrl}/edit/${candidates[editingIndex].id}`, newCandidate);
        fetchCandidates();
      } catch (error) {
        console.error('Error updating candidate:', error);
      }
    } else {
      // Add new candidate
      try {
        await axios.post(`${apiUrl}/insert`, newCandidate);
        fetchCandidates();
      } catch (error) {
        console.error('Error adding candidate:', error);
      }
    }
    resetForm();
    handleClose();
  };

  const handleEdit = (index) => {
    const candidate = candidates[index];
    setName(candidate.name);
    setPosition(candidate.position);
    setAge(candidate.age);
    setEditingIndex(index);
    handleShow();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/delete/${id}`);
      fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setPosition('');
    setAge('');
    setEditingIndex(null);
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  return (
    <div className='box'>
      <h1>Candidate Management</h1>
      <Button variant="primary" onClick={handleShow}>
        Add Candidate
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? 'Edit Candidate' : 'Add Candidate'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPosition">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingIndex !== null ? 'Update Candidate' : 'Add Candidate'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <h2>Candidates List</h2>
      <ul>
{candidates.map((candidate,index)=>{
  return(
    <li key={candidate.id}>
    {candidate.name} - {candidate.position} - {candidate.age} years 
    <Button variant="warning" onClick={() => handleEdit(index)}>Edit</Button>
    <Button variant="danger" onClick={() => handleDelete(candidate.id)}>Delete</Button>
  </li>
  )
})}
      </ul>
    </div>
  );
};

export default CandidateManager;