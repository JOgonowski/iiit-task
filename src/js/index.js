//import "babel-polyfill";
import '../css/site.scss';
import Vue from 'vue';
import App from './App.vue';

document.addEventListener("DOMContentLoaded", () => {

new Vue({
  el: "#app",
  render: h => h(App)
});

});

