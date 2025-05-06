export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  // Add a class to the html tag
  if (typeof window !== 'undefined' && window.document) {
    document.documentElement.classList.add('dew-light-theme');
  }
};
