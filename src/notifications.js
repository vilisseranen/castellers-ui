import Vue from "vue";
import { SnackbarProgrammatic as Snackbar } from "buefy";
import notifications from "./mixins/notifications";

Vue.use(Snackbar);
Vue.mixin(notifications);

export default {};
