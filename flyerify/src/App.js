import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { Row, Col, Container, Button } from "react-bootstrap";
import { format } from "date-fns";

const Chance = require('chance');

const spotifyApi = new SpotifyWebApi();
const chance = new Chance();

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const SCOPE = "user-top-read";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const formatedDate = format(new Date(), "MMMM, do");
  

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [topArtist, setTopArtist] = useState([]);
  const [address, setAddress] = useState("");
  const [fontSize, setFontSize] = useState('2.2rem')

  // Set's user token based off url after user has logged in
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

       function addHours(date, hours){
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);

        return date;
       }

      let expire = addHours(new Date(), 1);
      

      window.location.hash = "";
      window.localStorage.setItem("token", token);

     
      window.localStorage.setItem("expire", expire )
    }

    
    
    const location = chance.address({short_suffix: true});

    checkExpire();
    setToken(token);
    setAddress(location);
    spotifyApi.setAccessToken(token);
    getTopArtist();
    
  }, []);

  // waits for load and then determines headliner fontSize by length of string

  useEffect(() => {
    if(loading){

    const length = topArtist[0].length
    
    if(length > 30){
      setFontSize('1.6rem')
    }else{
      setFontSize('2.2rem')
    }
    


    }
  }, [loading, topArtist])



  // Removes user token from local storage
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expire")
  };

  //  GET users all time top artists
  const getTopArtist = () => {
    spotifyApi.getMyTopArtists({ time_range: "long_term" }).then((response) => {
      setLoading(true);
      setTopArtist(response.items);
      
    });
  };

  // GET users top artists of the last six months
  const getTopArtistSixMonths = () => {
    spotifyApi
      .getMyTopArtists({ time_range: "medium_term" })
      .then((response) => {
        setLoading(true);
        setTopArtist(response.items);
      });
  };

  // GET users top artists of the last 4 weeks
  const getTopArtistFourWeeks = () => {
    spotifyApi
      .getMyTopArtists({ time_range: "short_term" })
      .then((response) => {
        setLoading(true);
        setTopArtist(response.items);
      });
  };

  const checkExpire = () => {
    
    let currentTime = new Date()
    let expireTime = new Date(localStorage.getItem("expire"))
    

    if (expireTime < currentTime ){
      setToken("")
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expire")

    }
  }

  
  

 
  return (
    <div className="App">
      <div className="d-flex flex-column justify-content-center text-center">
     
        <h1>Flyerify</h1>
     
      <br></br>
      {!token ? (
        <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
      >
        <Button className="bg-success">
        
          
        
        Login to Spotify
        </Button>
        </a>
      ) : (
       <div className="d-flex flex-column justify-content-center align-items-center" >
          {!loading ? (
            <div>preparing your lineup...</div>
          ) : (
            <div>

             
                <div className="flyer">
                
                  <p className="header">Flyerify presents</p>
                  
                  <div className="artist-bg">
                  <p className="artist-one" style={{fontSize}}>{topArtist[0].name}</p>

                  <p className="artist-two">{topArtist[1].name}</p>
                
                  <p className="artist-three">{topArtist[2].name}</p>
                
                  <p className="artist-four">{topArtist[3].name}</p>
                  
                  </div>
                  <br></br>
                  <div className="show-info">
                  <div className="d-flex flex-row justify-content-evenly">
                  <p>{formatedDate}</p> 
                  <p>Doors 7pm</p>
                  </div>

                  <div className="d-flex flex-row justify-content-evenly">
                  <p>$10</p>
                  <p>{address}</p>
                  </div>
                  </div>
                </div>
               
             
                

                <br></br>
                

                  <div className="d-flex flex-row justify-content-evenly">
                  <Button className="bg-dark" onClick={getTopArtistFourWeeks}>4 Weeks</Button>
             

                  <Button className="bg-dark" onClick={getTopArtistSixMonths}>Six Months</Button>
               

                 
                  <Button className="bg-dark" onClick={getTopArtist}>All Time</Button>
                  </div>
                

             
                  
            

             </div>
          )}

          <br></br>
          
          <Button className="bg-success"onClick={logout}>Logout</Button>
         
       </div>
      )}

      </div>
    </div>
  );
}

export default App;
