import React,{ useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet} from "react-native"
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import color from '../colors';
import { Entypo } from '@expo/vector-icons';
import { Colors } from "react-native/Libraries/NewAppScreen";
const catImageUrl = "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/307095126_1987446148259547_7169112336924064042_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=od1rqPfbIx8AX97VMXW&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCx85JqpKXWMKdgOjZoeV2TaRXFK6Dm8oc4VKy7tgGgdg&oe=642A8867";
  

   const Home = () =>{
    const navigation = useNavigation();
    useEffect(() =>{
        navigation.setOptions({
            headerLeft: () =>(
                <FontAwesome name="search" size={24} color={Colors.gray} style={{marginLeft:15}}/>
            ),
            headerRight: () =>(
                <Image source={{uri: catImageUrl}}
                style={{
                    width:40,
                    height:40,
                    marginRight:15
                }}
                />
            ),
        
            
        });
    },[navigation]);


return(
    <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={styles.chatButton}>
    <Entypo name="chat" size={24} color={Colors.lightGray} />
    </TouchableOpacity>
    </View>
)
   }
   export default Home;

   const styles = StyleSheet.create({
        container:{
            flex:1,
            justifyContent:'flex-end',
            alignItems:'flex-end',
            backgroundColor:'#fff'
        },
        chatButton:{
            backgroundColor: Colors.primary,
            height:50,
            width:50,
            borderRadius:25,
            alignContent:'center',
            alignItems:'center',
            shadowColor: Colors.primary,
            shadowOffset:{
                width:0,
                height:2,
            },
            shadowOpacity: .9,
            shadowRadius:8,
            marginRight:20,
            marginBottom:50,

        }
   })