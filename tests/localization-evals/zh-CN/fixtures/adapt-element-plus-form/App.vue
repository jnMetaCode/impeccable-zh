<template>
  <el-form label-width="96px">
    <el-form-item label="企业统一社会信用代码">
      <el-input v-model="form.creditCode" />
    </el-form-item>
    <el-form-item label="合同生效日期">
      <el-date-picker v-model="form.startAt" />
    </el-form-item>
    <el-button type="primary">保存客户资料</el-button>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({ creditCode: '', startAt: '' })
</script>
