const API_VERSION = 'v1';

export const supabaseAPI = {
  v1: {
    auth: `/${API_VERSION}/auth`,
    rest: `/${API_VERSION}/rest`,
    storage: `/${API_VERSION}/storage`,
    realtime: `/${API_VERSION}/realtime`,
  },
};

