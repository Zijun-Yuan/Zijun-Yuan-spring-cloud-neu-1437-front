<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        反馈任务列表
      </el-header>
      <el-main>

        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="showCompleted">已完成</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="showUncompleted">未完成</el-button>
          </el-col>
        </el-row>

        <div v-if="showContent === 'completed'">
          <p>显示已完成的内容</p>
        </div>
        <div v-else-if="showContent === 'uncompleted'">
          <p>显示未完成的内容</p>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'InspectorBoard',
  data() {
    return {
      showContent: ''
    }
  },

  methods: {
    showCompleted() {
      this.showContent = 'completed';
    },
    showUncompleted() {
      this.showContent = 'uncompleted';
    }
  },

}
</script>

<style>
</style>