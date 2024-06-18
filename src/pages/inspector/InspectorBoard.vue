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
          <el-table :data="infoList">
          </el-table>
        </div>
        <div v-else-if="showContent === 'uncompleted'">
          <p>显示未完成的内容</p>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useInspectorStore } from '@/stores/inspectorStore';
import { getInfoList } from '@/api/inspector';

export default {
  name: 'InspectorBoard',
  setup: function () {
    const showContent = ref('');
    const inspectorStore = useInspectorStore();
    const infoList = ref([]);

    const fetchInfoList = async () => {
      try {
        const inspectorCode = inspectorStore.inspectorCode;
        const response = await getInfoList(inspectorCode);

        // console.log(response);

        if (response.data.code === 0) {
          infoList.value = response.data.data;
          console.log(infoList);
        } else {
          console.error('Failed to fetch info list:', response.data.message);
        }
      } catch (error) {
        console.error('Error during fetching info list:', error);
      }
    };

    const showCompleted = () => {
      showContent.value = 'completed';
    };

    const showUncompleted = () => {
      showContent.value = 'uncompleted';
    };

    onMounted(() => {
      fetchInfoList();
    });

    return {
      showContent,
      showCompleted,
      showUncompleted,
      infoList,
    };
  },
}
</script>

<style>
.common-layout {
  padding: 20px;
}
</style>