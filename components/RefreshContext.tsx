import React from 'react';

const RefreshContext = React.createContext({
  refresh: false,
  toggleRefresh: () => {},
});

export default RefreshContext;