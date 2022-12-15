<template>
  <button @click="getReq">getReq</button>
  <button @click="loadData">loadData</button>
  <CTable :columns="columns" :items="items" />
</template>

<script setup>
import axios from 'axios';
import '@coreui/coreui/dist/css/coreui.min.css'
import { CSpinner } from '@coreui/vue'
import { CTableDataCell, CTableBody, CTable, CTableRow, CTableHeaderCell, CTableHead } from '@coreui/vue'
// variable

</script>



<script>

async function getReq() {
  const resp = await axios.get("http://localhost:3001/")
  console.log(resp)
  return resp.data.model
}

export default {
  data () {
    return {
      columns: [ 'id', 'class', 'heading_1', 'heading_2'],
      items: [
        { id: 'Chetan Mohamed', class: '2018/02/01', heading_1: 'Admin', heading_2: 'hello' }
      ]
    }
  },
  
  async created () {
    const submodel = await getReq()
    console.log(this.items[0]['id'])
    this.items[0]['id'] = submodel.sub
  },

  methods: {
    async loadData () {
      const submodel = await getReq()
      console.log(this.items[0]['id'])
      this.items[0]['id'] = submodel.sub
    }
  },
  watch: {
    async updateData () {

    }
  },
}
</script>

<style scoped>

</style>