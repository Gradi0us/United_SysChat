import React,{useState} from "react";
import {StyleSheet, Text, View, Button , TextInput, Image , SafeAreaView, TouchableOpacity,StatusBar,Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../config/firebase";
const backImage = require("../assets/vutru.jpg");


export default function Signup ({navigation}) {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const onHandleSignup = () => {
        if(email !== "" && password !== "" ){
            signInWithEmailAndPassword(auth,email,password)
            .then(() => console.log("Signup successful"))
            .catch((err) => Alert.alert("Signup failed", err.message))
        }
    };

    return (
        <View style={styles.container}>
            <Image source={backImage} style={styles.backImage} />
            <View style={styles.whiteSheet}>
            <SafeAreaView style={styles.form}>
                    <Text style={styles.title}>Register</Text>
                    <TextInput style={styles.input}
                    placeholder="Enter Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoFocus={true}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput style={styles.input}
                    placeholder="Enter Password"
                    autoCapitalize="none"
                    autoCorrection={false}
                    textContentType="password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
                    <Text style={{fontWeight:'bold',color:'#fff',fontSize:18}}>Sign up</Text>
                    </TouchableOpacity>
                    <View style={{marginTop:20, flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
                    <Text style={{color:'gray',fontWeight:'600',fontSize:14}} >Have an account ? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={{color:'#f57c00', fontWeight:'600', fontSize:14}}>Login</Text>
                    </TouchableOpacity>
                    </View>
            </SafeAreaView>
            </View>


        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:"#fff",
    },
    title:{
        fontSize:30,
        fontWeight:'bold',
        color:"orange",
        alignSelf:"center",
        paddingBottom:24,
    },
    input:{
        backgroundColor:"#F6F7FB",
        height:58,
        marginBottom:20,
        fontSize:16,
        borderRadius:10,
        padding:12,
    },
    backImage:{
        width:"100%",
        height: 340,
        position:"absolute",
        top:0,
        resizeMode:'cover',
    },
    whiteSheet:{
        width:'100%',
        height:'75%',
        position:"absolute",
        bottom:0,
        backgroundColor:'#fff',
        borderTopLeftRadius:80,
    },
    form:{
        flex:1,
        justifyContent:'center',
        marginHorizontal:30,
    },
    button:{
        backgroundColor:'#f57c00',
        height:58,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:40
    }



});