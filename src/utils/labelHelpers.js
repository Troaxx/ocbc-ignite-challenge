export const getLabels = (actionType) => {
  switch (actionType) {
    case "draw":
      return {
        currentLabel: "Available Cash",
        inputLabel: "Amount to Draw",
        buttonLabel: "Draw Amount"
      };
    case "deposit":
      return {
        currentLabel: "Current Cash",
        inputLabel: "Amount to Deposit",
        buttonLabel: "Deposit Amount"
      };
    case "transfer":
      return {
        currentLabel: "Current Cash",
        inputLabel: "Amount to Transfer",
        buttonLabel: "Transfer Amount"
      };
    default:
      return {
        currentLabel: "Current Credit",
        inputLabel: "New Credit",
        buttonLabel: "Update Credit"
      };
  }
};