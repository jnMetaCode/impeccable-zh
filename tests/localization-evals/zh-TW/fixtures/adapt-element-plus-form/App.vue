<template>
  <el-form label-width="96px">
    <el-form-item label="企業統一社會信用程式碼">
      <el-input v-model="form.creditCode" />
    </el-form-item>
    <el-form-item label="合同生效日期">
      <el-date-picker v-model="form.startAt" />
    </el-form-item>
    <el-button type="primary">儲存客戶資料</el-button>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({ creditCode: '', startAt: '' })
</script>
