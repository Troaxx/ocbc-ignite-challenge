import React, { useState } from "react";
import { useNavigate } from "react-router";

import { FormInput, Loader } from "../../components";
import { addClient } from "../../services/firebaseApi";
import { useFetchClients } from "../../context/FetchClientsContext";

import './AddClientPage.css';

const AddClientPage = () => {
  const [formData, setFormData] = useState({
    age: '',
    city: '',
    id: '', 
    isActive: true,
    name: '',
    phone: '',
    cash: 0,
    credit: 100,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchClients } = useFetchClients();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await addClient(formData.id, formData); 
      fetchClients(); 
      navigate('/clientManage');
      setFormData({
        age: '',
        city: '',
        id: '', 
        isActive: true,
        name: '',
        phone: '',
        cash: '',
        credit: '',
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddClientPage">
      <form className="client-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Add New Client</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="form-card">
          <FormInput
            label="ID"
            type="text"
            value={formData.id}
            onChange={handleChange}
            name="id"
          />
          <FormInput
            label="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            name="name"
          />
          <FormInput
            label="Age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            name="age"
          />
          <FormInput
            label="City"
            type="text"
            value={formData.city}
            onChange={handleChange}
            name="city"
          />
          <FormInput
            label="Phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            name="phone"
          />
          <FormInput
            label="Cash"
            type="number"
            value={formData.cash}
            onChange={handleChange}
            name="cash"
          />
          <FormInput
            label="Credit"
            type="number"
            value={formData.credit}
            onChange={handleChange}
            name="credit"
          />
        </div>
        {loading ? (<Loader />) : (<button className="button add-client-button" type="submit">
          Add Client
        </button>)}
      </form>
    </div>
  );
};

export default AddClientPage;

