import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi()

function App() {
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const SCOPE = "user-top-read"
const REDIRECT_URI = 'http://localhost:3000'
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const  RESPONSE_TYPE = "token"

const [token, setToken] = useState("")
const [topArtist, setTopArtist] = useState([])


useEffect(() => {
const hash = window.location.hash
let token = window.localStorage.getItem("token")

if(!token && hash){
  token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

  window.location.hash = ""
  window.localStorage.setItem("token", token)
}

setToken(token)
spotifyApi.setAccessToken(token)
getTopArtist();

}, [])

const logout = () => {
  setToken("")
  window.localStorage.removeItem("token")
}

const getTopArtist = (token) => {

  spotifyApi.getMyTopArtists().then((response)=> {
    
    setTopArtist(response.items)
  })
}
console.log(topArtist)
  return (
    <div className="App">
      <h1>Flyerify</h1>
      {!token ?  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
      : 
      
      <div>
        <h2>{topArtist[0].name}</h2>
        <h3>{topArtist[1].name}</h3>
        <h4>{topArtist[2].name}</h4>
        <h5>{topArtist[3].name}</h5>



 <button onClick={logout}>Logout</button>
      </div>
      
      
     }


    </div>
  );
}

export default App;
