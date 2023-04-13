import React, { createContext,useState,useContext,useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { createStackNavigator } from "@react-navigation/stack";
import { View , ActivityIndicator } from "react-native"
import { onAuthStateChanged } from "firebase/auth";
import Chat from "./screens/Chat"
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import search from "./screens/search";
import profile from "./screens/profile";
import notif from "./screens/notif";
import { NavigationContainer } from "@react-navigation/native";
import { auth } from "./config/firebase";
  
const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({children }) => {
  const [user,setUser] = useState(null );
  return (
    <AuthenticatedUserContext.Provider value={{user,setUser}}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}


function ChatStack(){
  return(
    <Stack.Navigator defaultScreenOptions={Home} >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="profile" component={profile} />
    <Stack.Screen name="Chat" component={Chat}/>
    <Stack.Screen name="notif" component={notif}/>
    <Stack.Screen name="search" component={search}/>
    </Stack.Navigator>
  );
}
function AuthStack(){
  return( 
    <Stack.Navigator screenOptions={{headerShown:false}} defaultScreenOptions={Login}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup}/>
   
    </Stack.Navigator>)
 
}
function RootNavigator(){
  const {user , setUser} = useContext(AuthenticatedUserContext);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    const unsubcribe = onAuthStateChanged(auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setLoading(false);
      }
    );
      return() =>unsubcribe();
  },[user]
  )
  if(loading){
    return (
      <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
      <ActivityIndicator size="large"/>
      </View>
    )
  }
  return(
    <NavigationContainer>
    {user ? <ChatStack/> : <AuthStack/>}
    </NavigationContainer>
  );
}
export default function App(){
    return (
      <AuthenticatedUserProvider>
      <RootNavigator/>
      </AuthenticatedUserProvider>
    )
   
  
      
}