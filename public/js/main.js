let slider = tns({
  container: ".my-slider",
  items: 3,
  autoplay: true,
  speed: 900,
  controls: false,
  nav: false,
  // gutter: 5,
  responsive: {
    "1430": {
      items: 3,
    },
    "860": {
      items: 2,
    },
    "350": {
      items: 1,
    },
  },
});
