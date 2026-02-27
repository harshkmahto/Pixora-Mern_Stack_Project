const BASE_URL = import.meta.env.VITE_API_URL;

const SummaryApi = {
  auth: {
    register: {
      url: `${BASE_URL}/api/auth/register`,
      method: "post",
    },
    login: {
      url: `${BASE_URL}/api/auth/login`,
      method: "post",
    },
    logout: {
      url: `${BASE_URL}/api/auth/logout`,
      method: "post",
    },
    getProfile: {
      url: `${BASE_URL}/api/auth/profile`,
      method: "get",
    },
    updateProfile: {
      url: `${BASE_URL}/api/auth/profile`,
      method: "put",
    },
    adminOnly: {
      url: `${BASE_URL}/api/auth/admin-only`,
      method: "get",
    },
    allUsers: {
      url: `${BASE_URL}/api/auth/all-users`,
      method: "get",
    },
  },

  services: {
    // Admin
    createService: {
      url: `${BASE_URL}/api/services`,
      method: "post",
    },
    getAllServices: {
      url: `${BASE_URL}/api/services`,
      method: "get",
    },
    updateService: (id) => ({
      url: `${BASE_URL}/api/services/${id}`,
      method: "put",
    }),
    deleteService: (id) => ({
      url: `${BASE_URL}/api/services/${id}`,
      method: "delete",
    }),

    // User
    getPublicServices: {
      url: `${BASE_URL}/api/services/public`,
      method: "get",
    },
    getPublicServiceById: (id) => ({
      url: `${BASE_URL}/api/services/public/${id}`,
      method: "get",
    }),
  },

  personalDetails: {
  create: {
    url: `${BASE_URL}/api/personal-details`,
    method: "post",
  },
  getAll: {
    url: `${BASE_URL}/api/personal-details`,
    method: "get",
  },
  update: (id) => ({
    url: `${BASE_URL}/api/personal-details/${id}`,
    method: "put",
  }),
  delete: (id) => ({
    url: `${BASE_URL}/api/personal-details/${id}`,
    method: "delete",
  }),
  select: (id) => ({
    url: `${BASE_URL}/api/personal-details/select/${id}`,
    method: "put",
  }),
},

bookings: {
  // =============================
  // USER APIs
  // =============================

  // CREATE BOOKING
  create: {
    url: `${BASE_URL}/api/bookings`,
    method: "post",
  },

  // GET MY BOOKINGS
  getMy: {
    url: `${BASE_URL}/api/bookings/my`,
    method: "get",
  },

  // GET MY BOOKING BY ID
  getMyById: (id) => ({
    url: `${BASE_URL}/api/bookings/my/${id}`,
    method: "get",
  }),


  // =============================
  // ADMIN APIs
  // =============================

  // GET ALL BOOKINGS
  getAll: {
    url: `${BASE_URL}/api/bookings`,
    method: "get",
  },

  // GET BOOKING BY ID
  getById: (id) => ({
    url: `${BASE_URL}/api/bookings/${id}`,
    method: "get",
  }),

  // UPDATE BOOKING STATUS
  updateStatus: (id) => ({
    url: `${BASE_URL}/api/bookings/${id}/status`,
    method: "put",
  }),
},

};

export default SummaryApi;