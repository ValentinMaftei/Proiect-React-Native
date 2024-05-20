import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Navigation from './navigation';
import RefreshContext from './components/RefreshContext';
import React, {useState} from 'react';


export default function App() {
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <RefreshContext.Provider value={{ refresh: false, toggleRefresh }}>
      <Navigation />
    </RefreshContext.Provider>
  );
}