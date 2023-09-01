/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type States = {
  'ID State': string;
  State: string;
  'ID Year': number;
  year: string;
  Population: number;
  'Slug State': string;
};

function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState<States[]>([]);
  const [text, setText] = useState('');

  const getUSADataFromApi = async () => {
    try {
      const response = await fetch(
        'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest',
      );
      const json = await response.json();
      setStates(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUSADataFromApi();
  }, []);

  const filteredStates = states.sort((a, b) => b.Population - a.Population);
  const filterByName = states.filter(state =>
    state.State.toLowerCase().includes(text.toLowerCase()),
  );

  filterByName.sort((a, b) => {
    return a.State.localeCompare(b.State);
  });

  return (
    <View style={{flex: 1, padding: 24, paddingTop: 44}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <TextInput
            style={{height: 40, borderWidth: 1, padding: 10, marginBottom: 8}}
            placeholder="Filter"
            value={text}
            onChangeText={setText}
          />
          <FlatList
            data={text === '' ? filteredStates : filterByName}
            renderItem={({item}) => <Text>{item['State']}</Text>}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
