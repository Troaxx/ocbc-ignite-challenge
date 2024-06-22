import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import ICONS from "../../models/icons";
import { useFetchClients } from "../../context/FetchClientsContext";
import { deleteClient, updateClient } from "../../services/firebaseApi";
import { ErrorComponent, Loader, SingleClientBtn, SingleClientDetails } from "../../components";

import './SingleClientPage.css';

const SingleClientPage = () => {

  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, fetchClients, loading: clientsLoading, error: clientsError } = useFetchClients();
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const client = clients.find(cli => cli.id === clientId);
    if (client) setEditData(client);
  }, [clients, clientId]);

  const handleSaveClick = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await updateClient(clientId, editData);
      fetchClients();
      setEditMode(false);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteClient(clientId);
      fetchClients();
      navigate('/clientManage');
    } catch (error) {
      setActionError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (clientsLoading) return <Loader />;
  if (clientsError) return <ErrorComponent errorMessage={clientsError} />;
  if (!editData) return <p>Client not found</p>;

  return (
    <div className="card-container">
      {actionError && <ErrorComponent errorMessage={actionError} />}
      <span className={`pro ${editData.isActive ? 'active' : 'inactive'}`}>
        {editData.isActive ? 'Active' : 'Not Active'}
      </span>
      <img className="round-image" src={editData.image ? editData.image : '../../../assets/images/nophoto.png'} alt='Client-Profile' />
      <SingleClientDetails
        client={editData}
        editData={editData}
        editMode={editMode}
        handleChange={(e) => setEditData({ ...editData, [e.target.name]: e.target.value })}
      />
      <div className="buttons-container">
        {actionLoading ? (
          <Loader />
        ) : (
          <>
            <SingleClientBtn
              className="remove-color"
              onClick={handleDeleteClick}
              icon={ICONS.RemoveClient}
              label="Remove Client"
            />
            {editMode ? (
              <>
                <SingleClientBtn
                  className="save-button"
                  onClick={handleSaveClick}
                  icon={ICONS.Save}
                  label="Save"
                />
                <SingleClientBtn
                  className="cancel-button"
                  onClick={() => {
                    setEditMode(false);
                    setEditData(clients.find(cli => cli.id === clientId));
                  }}
                  icon={ICONS.Cancel}
                  label="Cancel"
                />
              </>
            ) : (
              <SingleClientBtn
                onClick={() => setEditMode(true)}
                icon={ICONS.Edit}
                label="Edit Client"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleClientPage;
