// Function to handle drawing money from cash and credit
export const handleDraw = (newValue, client) => {
  let remainingDraw = newValue;
  let updatedCash = client.cash;
  let updatedCredit = client.credit;

  if (remainingDraw <= updatedCash) {
    updatedCash -= remainingDraw;
    remainingDraw = 0;
  } else {
    remainingDraw -= updatedCash;
    updatedCash = 0;
  }

  if (remainingDraw > 0) {
    if (remainingDraw <= updatedCredit) {
      updatedCredit -= remainingDraw;
    } else {
      return { error: 'You cannot draw more than available cash and credit.' };
    }
  }

  return { cash: updatedCash, credit: updatedCredit };
};

// Function to handle transferring money between clients
export const handleTransfer = async (newValue, client, targetClientId, clients, updateClient) => {
  let updatedCash = client.cash;

  if (newValue > updatedCash) {
    return { error: 'You cannot transfer more than available cash.' };
  }

  updatedCash -= newValue;

  const targetClient = clients.find(c => c.id === targetClientId);
  if (!targetClient) {
    return { error: 'Target client not found.' };
  }

  const targetUpdatedCash = (parseFloat(targetClient.cash) || 0) + newValue;
  await updateClient(targetClientId, { cash: targetUpdatedCash });

  return { cash: updatedCash };
};

// Function to get the handler for a given action type
export const getActionHandler = (actionType) => {
  const actionHandlers = {
    
    credit: (newValue) => ({ credit: newValue }),

    draw: (newValue, client) => {
      const result = handleDraw(newValue, client);
      if (result.error) return { error: result.error };
      return result;
    },

    deposit: (newValue, client) => ({ cash: client.cash + newValue }),

    transfer: async (newValue, client, targetClientId, clients, updateClient) => {
      const result = await handleTransfer(newValue, client, targetClientId, clients, updateClient);
      if (result.error) return { error: result.error };
      return result;
    }
  };

  return actionHandlers[actionType];
};
