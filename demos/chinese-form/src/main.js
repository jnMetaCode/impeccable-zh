import { createApp } from 'vue';
import { ElButton, ElConfigProvider, ElDatePicker, ElForm, ElFormItem, ElInput } from 'element-plus';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/config-provider/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/input/style/css';
import App from './App.vue';
import './styles.css';

const app = createApp(App);
for (const component of [ElButton, ElConfigProvider, ElDatePicker, ElForm, ElFormItem, ElInput]) {
  app.component(component.name, component);
}
app.mount('#app');
