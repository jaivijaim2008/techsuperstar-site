const {createClient} = require('@sanity/client');
const c = createClient({
  projectId: 'ba3aow7c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});
const slug = 'vivo-x300-pro-vs-xiaomi-17-ultra-best-camera-phone';
c.fetch('*[_type=="post" && slug.current == $slug][0]{_id,title,slug}', {slug})
  .then(r => console.log(JSON.stringify(r)))
  .catch(console.error);