import React, { useState } from "react";
import { useNavigate } from "react-router";
import { addClient } from "../../services/firebaseApi";
import { useFetchClients } from "../../context/FetchClientsContext";
 
import './AddClientPage.css';
import { AddClientForm } from "../../components";

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
      <AddClientForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AddClientPage;