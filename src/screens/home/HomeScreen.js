//Refresh en la FlatList
import { View, Text, SafeAreaView, ScrollView, FlatList, RefreshControl, StatusBar, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback } from "react";

//Imports
import BuscarBar from "../../components/SearchBar";
import ProductCard from "../../components/ProductCard";
import ProductScreen from "../product/ProductScreen";
import { SearchBar } from "@rneui/themed";

//Product Service
import { getProducts } from "../../services/product/ProductServices";
import { getFavorites } from "../../services/favorites/FavoriteServices";
import { ref } from "firebase/storage";

const initProduct = {
  name: "",
  location: "",
  description: "",
  available: false,
  price: 0,
};

export default function Home({ navigation}) {
  const [productosData, setProductos] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [product, setProduct] = useState(initProduct);

  const [openModal, setOpenModal] = useState(false);
  const[refresh,setRefresh] = useState(false)
  const[filter,setFilter] = useState("")

  async function fetchProducts() {
    setProductos(await getProducts());
    setFavorites(await getFavorites());
    setRefresh(false)
  }

  //Render Card(Cambiar on Press a Detalles wdel producto)
  const renderCard = ({ item }) => {
    let auxFav = false;
    if (favorites.length != 0) {
      if (favorites.lastIndexOf(item.id) != -1){
        console.log(item.name)
        auxFav = true;
      }  
    }
    return (
      <ProductCard
        item={{ ...item, id: item.id }}
        onPress={async () => {
          setProduct(item);
          onCardPress();
        }}
        backgroundColor={{ backgroundColor:"#d1d5db" }}
        isFav={auxFav}
        onStore={false}
      />
    );
  };

  //Card Press
  const onCardPress = () => {
    setOpenModal(true);
  };

  //Modal Close
  const onModalClose = () => {
    setOpenModal(false);
  };

  //Refresh Handler
  const onRefresh = async () =>{
    setRefresh(true)
    setProductos(await getProducts())
    setRefresh(false)
  }

  const filterProducts = (filter) =>{
    setRefresh(true)
    setProductos(productosData.filter((i) =>{
      if(i.name.lastIndexOf(filter) != -1)
        return true
      return false
    }))
    setRefresh(false)
  }
  
  useEffect(async () => {
    await fetchProducts();
  }, []);

  //Render Home
  return (
    <View style={{ backgroundColor: "#eee", flex: 1,  marginTop: StatusBar.currentHeight || 0, }}>
      <View style={{ backgroundColor: "white", padding: 15 }}>
        {/* <HeaderTabs /> */}
        <SearchBar
          placeholder="Realiza una busqueda..."
          onChangeText={filterProducts}
          value={filter}
          lightTheme={true}
        />
      </View>
      {/*Listas no deben estar denro de un scroll view */}
      <View
        style={{ backgroundColor: "#eee", marginBottom:5 }}
      >
        <TouchableOpacity>
          <Text onPress={onRefresh}
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "#44403c",
              alignSelf: "center",
              padding: 20,
              alignContent:"center",
            }}>
            Bienvenido a Mercadito CUCEI
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ backgroundColor: "#eee", marginTop:2 }}
      >
        <FlatList
          scrollEnabled={true}
          data={productosData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }
        />
      </ScrollView>
      {openModal && (
        <ProductScreen
          item={product}
          visible={openModal}
          onClose={onModalClose}
        />
      )}
    </View>
  );
}
