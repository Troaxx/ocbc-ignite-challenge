import React from "react";
import { FormInput, Loader } from "../../components";
import './AddClientForm.css';

const AddClientForm = ({ formData, handleChange, handleSubmit, loading, error }) => {
  return (
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
      {loading ? (<Loader />) : (
        <button className="button add-client-button" type="submit">
          Add Client
        </button>
      )}
    </form>
  );
};

export default AddClientForm;