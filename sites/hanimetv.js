const fetch = require("node-fetch");
const AbortController = require('abort-controller');

const scrape = async (query) => {
  if (!query.length) return "Baka! You didn't provide a search query! What am I supposed to search for?"

  const getPath = (url) => {
    if (!url)
      return '';
    if (url.startsWith('/'))
      return url;
    const real_url = url.replace(/http[s]{0,1}:\/\//, '').replace(/i\d\.wp\.com\//, '');
    const hostname = real_url.split('/')[0];
    return real_url.replace(hostname, '');
  }
  const jetpackURL = (url, quality = 100, null_1, null_2, cdn) => {
    const n = null_2 !== undefined ? null_2 : null;
    if (!url)
      return '';
    const path = getPath(url);
    const real_path = n ? `${path}?quality=${quality}&h=${n}` : `${path}?quality=${quality}`;
    if (/\/archived-assets-\d+\./.test(url)) {
      const hostname = url.replace(/http[s]:\/\//, '').split('/')[0];
      const segment = hostname.split('.')[0].split('-').pop();
      return `https://i1.wp.com/archived-assets-${segment}.imageg.top${real_path}`;
    }
    return cdn == 'cps' ? `https://i1.wp.com/static-assets.droidbuzz.top${real_path}` : `https://i1.wp.com/dynamic-assets.imageg.top${real_path}`;
  }
  const getImageURL = (url, quality = 100, cdn) => {
    return jetpackURL(url, quality, null, null, cdn);
  }

  const getDate = (releaseDate) => {
    var date = new Date(releaseDate * 1000);

    year = date.getFullYear();
    month = ('0' + (date.getMonth() + 1)).slice(-2);
    day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  const search = async (query) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const config = {
      search_text: query,
      tags: [],
      tags_mode: 'AND',
      brands: [],
      blacklist: [],
      order_by: 'created_at_unix',
      ordering: 'desc'
    };
    var results = await fetch('https://search.htv-services.com/', {
      method: 'POST',
      body: JSON.stringify(config),
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    }).then((r) => r.json());
    clearTimeout(timeout);
    return results;
  }

  if (isNaN(query)) {
    var results = await search(query);

    results = results.nbHits > 0 ? JSON.parse(results.hits) : 'No results';
    for (var i = 0; i < results.length; i++) {
      results[i].cover_url = getImageURL(results[i].cover_url, 100, 'cps');
      results[i].poster_url = getImageURL(results[i].poster_url, 100, 'cps');
      results[i].url = `https://hanime.tv/videos/hentai/${results[i].slug}`;
      results[i].released_at = getDate(results[i].released_at);
    }

    return results;
  } else {
    var results = await fetch(`https://members.hanime.tv/rapi/v7/video?id=${query}`)
      .then((r) => r.json());

    if (results.hentai_video) {
      var newQuery = results.hentai_video.name;
    } else {
      return 'No results';
    }

    results = await search(newQuery);

    results = results.nbHits > 0 ? JSON.parse(results.hits) : 'No results';

    results.forEach(el => {
      if (el.id == query) {
        results = el;
      }
    });

    results.cover_url = getImageURL(results.cover_url, 100, 'cps');
    results.poster_url = getImageURL(results.poster_url, 100, 'cps');
    results.url = `https://hanime.tv/videos/hentai/${results.slug}`;
    results.released_at = getDate(results.released_at);

    return results;
  }
};

exports.scrape = scrape;
