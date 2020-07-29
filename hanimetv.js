const fetch = require("node-fetch");

const scrape = async (query) => {
  if (!query.length) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const results = await fetch(`https://members.hanime.tv/rapi/v7/video?id=${query}`)
  .then((r) => r.json());

  const video = results.hentai_video;
  return video;
};

exports.scrape = scrape;