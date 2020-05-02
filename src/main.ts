import Vue from "vue";
import App from "./App.vue";
import moment from "moment";
import "moment/src/locale/hr";

moment.locale("hr");

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
