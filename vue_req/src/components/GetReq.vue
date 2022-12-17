<template>
    <button @click="getReq">getReq</button>

    <button @click="loadData">loadData</button>

    <CSmartTable
        :items="items"
        :columns="columns"
    >
      <template #status="{ item }">
        <td>
          <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
        </td>
      </template>
      <template #show_details="{ item, index }">
        <td class="py-2">
          <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="toggleDetails(item, index)"
          >
            {{ Boolean(item._toggled) ? 'Hide' : 'Show' }}
          </CButton>
        </td>
      </template>
      <template #details="{ item }">
        <CCollapse :visible="this.details.includes(item._id)">
          <CCardBody>
            <h4>
              {{ item.username }}
            </h4>
            <p class="text-muted">User since: {{ item.registered }}</p>
          </CCardBody>
        </CCollapse>
      </template>
    </CSmartTable>

</template>

<script setup>
import axios from 'axios';
import '@coreui/coreui-pro/dist/css/coreui.css'
import '@coreui/coreui-pro/dist/css/coreui.rtl.css'
import '@coreui/coreui-pro/dist/css/coreui-grid.rtl.css'
import '@coreui/coreui-pro/dist/css/coreui-utilities.css'
import {CSpinner} from '@coreui/vue'
import {CTableDataCell, CTableBody, CTable, CTableRow, CTableHeaderCell, CTableHead} from '@coreui/vue'
import {CSmartTable, CBadge, CButton, CCollapse, CCardBody} from '@coreui/vue-pro'
import {h} from 'vue'
import {CMultiSelect} from '@coreui/vue-pro'

import {isReactive} from '@vue/reactivity'

</script>


<script>

async function getReq() {
  const resp = await axios.get("http://localhost:3001/")
  console.log(resp)
  return resp.data.model
}

export default {
  data() {
    return {
      columns: [],
      details: [],
      items: [],
    }
  },
  created() {
    this.columns = [
        {
          key: 'name',
          _style: {width: '20%'},
        },
        'registered',
        {key: 'role', filter: false, sorter: false, _style: {width: '20%'}},
        {key: 'status', _style: {width: '20%'}},
        {
          key: 'show_details',
          label: '',
          _style: {width: '1%'},
          filter: false,
          sorter: false,
        },
      ]
    this.items = [
          {name: 'nihao', registered: '2018/02/01', role: 'Admin', status: 'Inactive'},
          {name: 'Enéas Kwadwo', registered: '2018/03/01', role: 'Member', status: 'Pending'},
          {name: 'Agapetus Tadeáš', registered: '2018/01/21', role: 'Staff', status: 'Active'},
          {name: 'Carwyn Fachtna', registered: '2018/01/01', role: 'Member', status: 'Active'},
          {name: 'Aulus Agmundr', registered: '2018/01/01', role: 'Member', status: 'Pending'},
          {name: 'Ford Prefect', registered: '2001/05/25', role: 'Alien', status: "Don't panic!"},
    ]
    this.items[0]['name'] = 'hello'
  },

  methods: {
    getBadge(status) {
      switch (status) {
        case 'Active':
          return 'success'
        case 'Inactive':
          return 'secondary'
        case 'Pending':
          return 'warning'
        case 'Banned':
          return 'danger'
        default:
          'primary'
      }
    },
    toggleDetails(item) {
      if (this.details.includes(item._id)) {
        this.details = this.details.filter((_item) => _item !== item._id)
        return
      }
      this.details.push(item._id)
    },

    async loadData() {
      const submodel = await getReq()
      console.log(submodel.sub)

      let items = this.items
      // items.push({name: 'Hi', registered: '2001/05/25', role: 'Alien', status: "Don't panic!"})
      // console.log(items[6])
      this.items = [...items, {name: 'Hi', registered: '2001/05/25', role: 'Alien', status: "Don't panic!"}]
      this.items.push({name: 'Hi', registered: '2001/05/25', role: 'Alien', status: "Don't panic!"})



    },


  },

}
</script>

<style scoped>

</style>