<template>
  <div ref="chartRef" class="timeseries-chart" />
</template>

<script setup>
  import * as echarts from 'echarts'
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import getTimeseriesData from '@/lib/get-timeseries-data'

  const props = defineProps({
    peilfilterId: {
      type: [String, Number],
      default: null,
    },
  })

  const chartRef = ref(null)
  let chartInstance = null

  function initChart () {
    if (chartInstance) {
      chartInstance.dispose()
    }
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption({
      title: {
        text: 'Time Series Data',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        name: 'Head',
        type: 'line',
        data: [],
      }],
    })
  }

  async function loadData (peilfilterId) {
    try {
      const data = await getTimeseriesData(peilfilterId)
      console.log('📊 Loaded timeseries data:', data)
      const timeseries = data.timeseries || []
      const xData = timeseries.map(t => t.datetime)
      const yData = timeseries.map(t => t.head)
      chartInstance.setOption({
        xAxis: {
          data: xData,
        },
        series: [{
          data: yData,
        }],
      })
    } catch (error) {
      console.error('Error loading timeseries data:', error)
    }
  }

  onMounted(() => {
    initChart()
    if (props.peilfilterId) {
      loadData(props.peilfilterId)
    }
  })

  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.dispose()
    }
  })

  watch(
    () => props.peilfilterId,
    newId => {
      if (newId) {
        loadData(newId)
      }
    },
  )

</script>

<style scoped>
.timeseries-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
