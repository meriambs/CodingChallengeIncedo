const csvHeader = [
    { id: "name", title: "name" },
    { id: "mbid", title: "mbid" },
    { id: "url", title: "url" },
    { id: "image_small", title: "image_small" },
  
    { id: "image", title: "image" },
  ];
  
  const searchApiURL = "http://ws.audioscrobbler.com/2.0/"
  
  module.exports = { csvHeader,searchApiURL };
  