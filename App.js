import { StatusBar } from 'expo-status-bar';
import SvgUri from 'expo-svg-uri';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Keyboard } from 'react-native';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Input } from 'react-native-elements';

export default function App() {

  let [searchedCountry, setSearchedCountry] = useState()
  let [allCountryList, setAllCountryList] = useState([])
  let [inputCountryList, setInputCountryList] = useState([])
  let [input, setInput] = useState("")
  let [error, setError] = useState("")


  useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setAllCountryList(data)
      })
  }, [])

  const inputChange = (text) => {
    // console.log(text);
    setInput(text)
    if (text === "") {
      setInputCountryList([])
      return
    }
    const fileteredCountries = allCountryList.filter((country) => {
      return country.name.toLowerCase().includes(text.toLowerCase())
    })

    if (fileteredCountries.length === 0) {
      setError("No Country Found")
      setInputCountryList([])
      return
    }
    setError("")
    setInputCountryList(fileteredCountries)
  }

  const getCountry = (e) => {
    const countryClicked = e._dispatchInstances.memoizedProps.children[0]._owner.key
    const country = allCountryList.filter((country) => {
      return (country.name.toLowerCase() === countryClicked.toLowerCase())
    })

    Keyboard.dismiss()
    setSearchedCountry(country[0])
    setInputCountryList([])
    setInput(country[0].name)
  }

  return (
    <SafeAreaView style={styles.container}>


      {/* <Text>This App is made by Aniket Agarwal with ❤</Text>
      <Text>This is my first React-Native App</Text> */}

      <Input
        onChangeText={inputChange}
        value={input}
        style={styles.colorLight}
        placeholder='Enter A Country to Search'
      />

      {error !== "" ? <Text style={styles.err}>{error}</Text> : null}
      {inputCountryList.map((country) => {
        return <Button onPress={getCountry} title={country.name} key={country.name} color="#111"></Button>
      })}

      {searchedCountry ?
        <View style={styles.result}>
          <SvgUri
            width="250"
            height="150"
            source={{
              uri: searchedCountry.flag
            }}
          />
          <Text style={styles.countryTitle}>{searchedCountry.name}</Text>
          <Text style={styles.countryData}>Capital: {searchedCountry.capital}</Text>
          <Text style={styles.countryData}>Population: {searchedCountry.population}</Text>
          <Text style={styles.countryData}>Area: {searchedCountry.area}</Text>
          <Text style={styles.countryData}>Currency: {searchedCountry.currencies[0].name} ({searchedCountry.currencies[0].symbol}{searchedCountry.currencies[0].code})</Text>
          <Text style={styles.countryData}>Language: {searchedCountry.languages[0].name}</Text>

        </View> : null}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 50,
  },
  colorLight: {
    color: '#fff'
  },
  err: {
    textAlign: 'center',
    color: '#fff'
  },
  countryTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: 20,
  },
  countryData: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    paddingVertical:4,
  },
  result: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
