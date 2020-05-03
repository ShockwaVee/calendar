import Vue from "vue";
import App from "./App.vue";
import moment from "moment";
import "moment/src/locale/hr";
import Toasted from "vue-toasted";

Vue.use(Toasted, {
  duration: 3000,
  position: "bottom-right"
});

moment.locale("hr");

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
