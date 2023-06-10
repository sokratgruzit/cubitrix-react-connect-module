const INIT_STATE = {
  isConnected: false,
  providerType: "",
  walletModalOpen: false,
  account: "",
  chainId: undefined,
  otpEnabled: false,
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

  if (action.type === "UPDATE_STATE") {
    return {
      ...state,
      ...action,
    };
  }
  return state;
};
