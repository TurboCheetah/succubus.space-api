const fetch = require("node-fetch");
const cheerio = require("cheerio");

const scrape = async (query) => {
  if (!query.length) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const results = await fetch(`https://members.hanime.tv/rapi/v7/video?id=${query}`)
  .then((r) => r.json());

  //Temporary(?) fix to get poster
  const $ = await fetch(`https://hanime.tv/videos/hentai/${query}`)
  .then((res) => {
    if(!res.ok) throw "Something went wrong.";
    return res.text();
  })
  .then((html) => cheerio.load(html));
  
  const poster = $('.hvpi-cover-container').find('img').attr('src')
  const video = results.hentai_video;
  video.poster_url = poster;
  return video;
};

exports.scrape = scrape;