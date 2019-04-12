const express = require("express")
const hbs = require("hbs")
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"))

// setting the spotify-api goes here:
const clientId = "b4a37528e7e7495495fce9bb87c1971b"
const clientSecret = "fb17321a2785494ba2b9d96d5ecf3196"

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"])
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error)
  })

// the routes go here:
app.get("/", (req, res) => {
  res.render("index")
})

// query string
app.get("/artists", (req, res) => {
  const query = req.query
  spotifyApi
    .searchArtists(query.artistName) // specify path to the value of the object
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items) // path to the item in the data structure
      res.render("artists", { data })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err)
    })
})

//request params
app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId

  // from documentation:
  // spotifyApi
  //   .getArtistAlbums(artistId, { limit: 10 })
  //   .then(function(data) {
  //     return data.albums.map(function(a) {
  //       return a.id
  //     })
  //   })
  //   .then(function(albums) {
  //     return spotifyApi.getAlbums(albums)
  //   })
  //   .then(function(albums) {
  //     // console.log(albums)
  //     console.log("done haha")
  //     res.render("albums", { albums })
  //   })

  spotifyApi.getArtistAlbums(artistId, { limit: 10 }).then(data => {
    res.render("albums", { data })
    console.log(data.body.items)
  })
})

app.get("/albums/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId
  spotifyApi.getAlbumTracks(albumId).then(tracks => {
    tracksArr = tracks.body.items
    res.render("tracks", { tracksArr })
    console.log(tracks.body.items[0])
  })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"))
