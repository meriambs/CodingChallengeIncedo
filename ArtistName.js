const express = require("express");
const axios = require("axios");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { csvHeader, searchApiURL } = require("./constants");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;



app.get("/artists/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const response = await axios.get(searchApiURL, {
      params: {
        method: "artist.search",
        artist: name,
        api_key: LASTFM_API_KEY,
        format: "json",
      },
    });

    const { artistmatches } = response.data.results;

    const artistName = req.params.name;

    const retrievedArtistName = artistmatches.artist;

    const filteredNameArtist = retrievedArtistName.filter((e) =>

      e.name.includes(artistName)
    );

    if (filteredNameArtist.length > 0) {
      const artists = filteredNameArtist.map(
        ({ name, mbid, url, image, image_small }) => ({
          name,
          mbid,
          url,
          image_small: image.find((el) => el.size === "small")["#text"],
          image: image.find((el) => el.size === "large")["#text"],
        })
      );

      const csvWriter = createCsvWriter({
        path: "data.csv",
        header: csvHeader,
      });
      await csvWriter.writeRecords(artists);


      res.set({
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=data.csv",
      });
      res.sendFile(`${__dirname}/data.csv`);
    } else {

      const data = fs.readFileSync("artists.json");

      const jsonData = JSON.parse(data);
      const RandomartistList = [];

      for (let i = 0; i < jsonData.length; i++) {
        RandomartistList.push(
          jsonData[Math.floor(Math.random() * jsonData.length)]
        );
      }
      res.send(RandomartistList);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


