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
  
  const cover = $('.hvpi-cover-container').find('img').attr('src')
  const video = results.hentai_video ? results.hentai_video : 'No results';
  video.poster_url = results.hentai_video ? `${video.poster_url.replace(/https:\/\/static-assets.highwinds-cdn.com/g, 'https://i1.wp.com/static-assets.droidbuzz.top')}` : '';
  video.cover_url = cover;
  video.url = `https://hanime.tv/videos/hentai/${query}`
  return video;
};

exports.scrape = scrape;