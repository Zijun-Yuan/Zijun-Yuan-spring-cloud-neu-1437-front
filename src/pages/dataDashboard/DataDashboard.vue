<template>
  <div class="data-dashboard">
    <h1>Data Dashboard</h1>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="china-map" class="chart"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="line-chart" class="chart"></div>
      </el-col>
      <el-col :span="12">
        <div id="bar-chart" class="chart"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="pie-chart" class="chart"></div>
      </el-col>
      <el-col :span="12">
        <div id="scatter-chart" class="chart"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';

export default {
  name: 'DataDashboard',
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      this.initChinaMap();
      this.initLineChart();
      this.initBarChart();
      this.initPieChart();
      this.initScatterChart();
    },
    initChinaMap() {
      const chart = echarts.init(document.getElementById('china-map'));
      const option = {
        title: {
          text: '中国地图',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: 1000,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0ffff', '#006edd']
          },
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '反馈数量',
            type: 'map',
            mapType: 'china',
            roam: true,
            label: {
              show: true,
              color: '#fff'
            },
            data: [
              { name: '北京', value: 54 },
              { name: '上海', value: 120 },
              { name: '广东', value: 220 },
              // 其他省份的数据
            ]
          }
        ]
      };
      chart.setOption(option);
    },
    initLineChart() {
      const chart = echarts.init(document.getElementById('line-chart'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          }
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }],
        textStyle: {
          color: '#fff'
        }
      };
      chart.setOption(option);
    },
    initBarChart() {
      const chart = echarts.init(document.getElementById('bar-chart'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          }
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }],
        textStyle: {
          color: '#fff'
        }
      };
      chart.setOption(option);
    },
    initPieChart() {
      const chart = echarts.init(document.getElementById('pie-chart'));
      const option = {
        series: [{
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ],
          label: {
            color: '#fff'
          }
        }],
        textStyle: {
          color: '#fff'
        }
      };
      chart.setOption(option);
    },
    initScatterChart() {
      const chart = echarts.init(document.getElementById('scatter-chart'));
      const option = {
        xAxis: {
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: {
          axisLabel: {
            color: '#fff'
          }
        },
        series: [{
          symbolSize: 20,
          data: [
            [10.0, 8.04],
            [8.07, 6.95],
            [13.0, 7.58],
            [9.05, 8.81],
            [11.0, 8.33],
            [14.0, 7.66],
            [13.4, 6.81],
            [10.0, 6.33],
            [14.0, 8.96],
            [12.5, 6.82],
            [9.15, 7.20],
            [11.5, 7.20],
            [3.03, 4.23],
            [12.2, 7.83],
            [2.02, 4.47],
            [1.05, 3.33],
            [4.05, 4.96],
            [6.03, 7.24],
            [12.0, 6.26],
            [12.0, 8.84],
            [7.08, 5.82],
            [5.02, 5.68]
          ],
          type: 'scatter'
        }],
        textStyle: {
          color: '#fff'
        }
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.data-dashboard {
  padding: 20px;
  background-color: #e5acac;
  color: #fff;
}

.chart {
  height: 400px;
}
</style>
