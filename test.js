const {createClient} = require('@sanity/client');
const c = createClient({
  projectId: 'ba3aow7c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});
c.fetch('*[_type=="post"]{"s":slug.current}')
  .then(r => console.log(JSON.stringify(r)))
  .catch(console.error);