import './assets/styles/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import TextBox from "@/components/core-components/TextBox.vue";
import CheckBox from "@/components/core-components/CheckBox.vue";
import DateInput from "@/components/core-components/DateInput.vue";
import SelectBox from "@/components/core-components/SelectBox.vue";
import ComboBox from "@/components/core-components/ComboBox.vue";
import CustomButton from "@/components/core-components/CustomButton.vue";
import ToggleCard from "@/components/core-components/ToggleCard.vue";
import Radio from "@/components/core-components/Radio.vue";
import AgreeToggle from "@/components/core-components/AgreeToggle.vue";
import NavigationButtons from '@/components/UI/NavigationButtons.vue'
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import InlineSvg from "vue-inline-svg";
import 'material-icons/iconfont/material-icons.css';
import { useBrandingStore } from './stores/brandingStore';
import { GoogleMap, Marker } from "vue3-google-map";
import Slider from '@/components/core-components/Slider.vue'
import Gauge from '@/components/core-components/Gauge.vue';
import TextArea from "@/components/core-components/TextArea.vue";
import maskDirective from './directives/mask'
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
const app = createApp(App)

import ace from 'ace-builds';
ace.config.set('basePath', 'node_modules/ace-builds/src-noconflict/');
app.component('NavigationButtons', NavigationButtons)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Toast);
app.directive('mask', maskDirective); 
app.component("TextBox", TextBox);
app.component("CheckBox", CheckBox);
app.component("DateInput", DateInput);
app.component("SelectBox", SelectBox);
app.component("CustomButton", CustomButton);
app.component("ToggleCard", ToggleCard);
app.component("Radio", Radio);
app.component("AgreeToggle", AgreeToggle);
app.component("ComboBox", ComboBox);
app.component("Slider", Slider);
app.component("inline-svg", InlineSvg);
app.component("GoogleMap", GoogleMap);
app.component("Marker", Marker);
app.component("Gauge", Gauge);
app.component("TextArea", TextArea);
app.component("AceEditor", VAceEditor);

app.mount('#app')

app.config.globalProperties.$lynxSlogan = useBrandingStore().lynxSlogan;
app.config.globalProperties.$brandingBaseUrl = useBrandingStore().brandingBaseUrl;