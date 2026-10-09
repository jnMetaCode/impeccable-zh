<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import BeforeForm from '../../../tests/localization-evals/zh-CN/fixtures/adapt-element-plus-form/App.vue';

const original = new URLSearchParams(window.location.search).get('view') === 'before';
const media = window.matchMedia('(max-width: 640px)');
const mobile = ref(media.matches);
const formRef = ref();
const form = reactive({ creditCode: '', startAt: '' });
const saving = ref(false);
const failNext = ref(false);
const message = ref('');
const failed = ref(false);
let saveTimer;
let disposed = false;

const rules = {
  creditCode: [
    { required: true, message: '请输入企业统一社会信用代码。', trigger: 'blur' },
    { pattern: /^[0-9A-HJ-NPQRTUWXY]{18}$/, message: '请核对营业执照，输入 18 位统一社会信用代码。', trigger: 'blur' },
  ],
  startAt: [{ required: true, message: '请选择合同生效日期。', trigger: 'change' }],
};

function updateViewport(event) {
  mobile.value = event.matches;
}

async function save() {
  if (saving.value) return;
  message.value = '';
  failed.value = false;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid || disposed || saving.value) return;
  saving.value = true;
  const shouldFail = failNext.value;
  saveTimer = setTimeout(() => {
    saving.value = false;
    failed.value = shouldFail;
    if (shouldFail) {
      failNext.value = false;
      message.value = '本次模拟保存失败，输入内容已保留。请再次点击“保存客户资料”重试。';
    } else {
      message.value = '演示保存完成。数据没有发送到服务器，也不会在刷新后保留。';
    }
  }, 800);
}

function clearForm() {
  if (saving.value) return;
  form.creditCode = '';
  form.startAt = '';
  formRef.value.clearValidate();
  message.value = '已清空本次演示输入。';
  failed.value = false;
}

onMounted(() => media.addEventListener('change', updateViewport));
onBeforeUnmount(() => {
  disposed = true;
  clearTimeout(saveTimer);
  media.removeEventListener('change', updateViewport);
});
</script>

<template>
  <ElConfigProvider :locale="original ? undefined : zhCn" :size="original ? 'default' : 'large'">
    <main class="page">
      <header class="page-header">
        <a class="brand" href="https://github.com/jnMetaCode/impeccable-zh">Impeccable 中文增强版</a>
        <nav aria-label="案例版本">
          <a href="?view=before" :aria-current="original ? 'page' : undefined">原始输入</a>
          <a href="./" :aria-current="!original ? 'page' : undefined">参考实现</a>
        </nav>
      </header>

      <section class="form-section" aria-labelledby="form-title">
        <h1 id="form-title">客户资料</h1>
        <p class="intro">{{ original ? '原始评测夹具，仅提供信用代码与合同日期两个字段。' : '填写企业信息与合同生效日期。字段均为必填，请按营业执照核对。' }}</p>

        <div v-if="original" class="original-form">
          <BeforeForm />
        </div>
        <ElForm
          v-else
          ref="formRef"
          class="customer-form"
          :model="form"
          :rules="rules"
          :label-position="mobile ? 'top' : 'left'"
          :label-width="mobile ? undefined : '200px'"
          :disabled="saving"
          :aria-busy="saving"
          @submit.prevent="save"
        >
          <ElFormItem label="企业统一社会信用代码" prop="creditCode">
            <ElInput
              v-model="form.creditCode"
              id="credit-code"
              aria-describedby="credit-code-help"
              autocomplete="off"
              :maxlength="18"
              @input="form.creditCode = form.creditCode.toUpperCase()"
            />
            <p id="credit-code-help" class="field-help">营业执照上的 18 位代码，英文字母自动转为大写。</p>
          </ElFormItem>

          <ElFormItem label="合同生效日期" prop="startAt">
            <ElDatePicker
              v-model="form.startAt"
              id="start-date"
              type="date"
              format="YYYY年MM月DD日"
              value-format="YYYY-MM-DD"
              aria-label="合同生效日期"
              aria-describedby="start-date-help"
              :editable="false"
              :teleported="true"
              popper-class="demo-date-popover"
              :show-now="false"
              :show-confirm="false"
            />
            <p id="start-date-help" class="field-help">按合同约定选择日期，日期面板使用中文。</p>
          </ElFormItem>

          <div class="actions">
            <ElButton type="primary" native-type="submit" :loading="saving">
              {{ saving ? '正在保存客户资料' : '保存客户资料' }}
            </ElButton>
            <ElButton native-type="button" @click="clearForm">清空输入</ElButton>
          </div>
          <p class="save-status" :class="{ failed }" role="status" aria-live="polite" aria-atomic="true">{{ message }}</p>
        </ElForm>
      </section>

      <footer class="demo-notes">
        <h2>关于这个演示</h2>
        <p>这是依据中文设计指导编写的参考实现，非客户项目或模型效果评测。保存由本地计时器模拟，无后端服务。</p>
        <label v-if="!original" class="failure-control">
          <input v-model="failNext" type="checkbox" :disabled="saving">
          下次模拟保存失败，检查输入保留与重试
        </label>
        <p class="validation-note">代码校验仅检查长度与字符格式，不验证企业真实性或信用代码校验位。</p>
      </footer>
    </main>
  </ElConfigProvider>
</template>
