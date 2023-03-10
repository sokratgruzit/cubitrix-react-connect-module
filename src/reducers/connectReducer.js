const INIT_STATE = {
  isConnected: false,
  providerType: "",
  walletModalOpen: false,
  account: "",
  balance: 0,
  chainId: undefined,
  otpEnabled: false
};

export const connectReducer = (state = INIT_STATE, action) => {
  if (action.type === "TOGGLE_WALLET_CONNECT_MODAL") {
    return {
      ...state,
      walletModalOpen: action.payload,
    };
  }

  if (action.type === "GET_OPT_ENABLED") {
    return {
      ...state,
      otpEnabled: action.otp_enabled,
    };
  }

  if (action.type === "GET_ACCOUNT") {
    return {
      ...state,
      account: action.account,
    };
  }

  if (action.type === "GET_BALANCE") {
    return {
      ...state,
      balance: action.balance,
    };
  }

  if (action.type === "CONNECT") {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === "UPDATE_STATE") {
    return {
      ...state,
      ...action,
    };
  }
  return state;
};

