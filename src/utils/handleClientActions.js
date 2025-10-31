export const handleDraw = (newValue, client) => {
  let remainingDraw = parseFloat(newValue) || 0;
  let updatedCash = parseFloat(client.cash) || 0;
  let updatedCredit = parseFloat(client.credit) || 0;

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

export const handleTransfer = async (newValue, client, targetClientId, clients, updateClient) => {
  const transferAmount = parseFloat(newValue) || 0;
  let updatedCash = parseFloat(client.cash) || 0;

  if (transferAmount > updatedCash) {
    return { error: 'You cannot transfer more than available cash.' };
  }

  updatedCash -= transferAmount;

  const targetClient = clients.find(c => c.id === targetClientId);
  if (!targetClient) {
    return { error: 'Target client not found.' };
  }

  const targetUpdatedCash = (parseFloat(targetClient.cash) || 0) + transferAmount;
  await updateClient(targetClientId, { cash: targetUpdatedCash });

  return { cash: updatedCash };
};

export const getActionHandler = (actionType) => {
  const actionHandlers = {
    
    credit: (newValue) => ({ credit: parseFloat(newValue) || 0 }),

    draw: (newValue, client) => {
      const result = handleDraw(newValue, client);
      if (result.error) return { error: result.error };
      return result;
    },

    deposit: (newValue, client) => {
      const depositAmount = parseFloat(newValue) || 0;
      const currentCash = parseFloat(client.cash) || 0;
      return { cash: currentCash + depositAmount };
    },

    transfer: async (newValue, client, targetClientId, clients, updateClient) => {
      const result = await handleTransfer(newValue, client, targetClientId, clients, updateClient);
      if (result.error) return { error: result.error };
      return result;
    }
  };

  return actionHandlers[actionType];
};
