<template>
<!--  <button @click="getReq">getReq</button>-->
<!--  <button @click="loadData">loadData</button>-->
<!--  <CTable :columns="columns" :items="items" />-->

  <CSmartTable
      cleaner
      clickableRows
      :columns="columnsMultiSelect"
      columnFilter
      columnSorter
      footer
      :items="itemsMultiSelect"
      itemsPerPageSelect
      :itemsPerPage="10"
      pagination
      tableFilter
  />

</template>

<script setup>
import axios from 'axios';
import '@coreui/coreui-pro/dist/css/coreui.css'
import '@coreui/coreui-pro/dist/css/coreui.rtl.css'
import '@coreui/coreui-pro/dist/css/coreui-grid.rtl.css'
import '@coreui/coreui-pro/dist/css/coreui-utilities.css'
import { CSpinner } from '@coreui/vue'
import { CTableDataCell, CTableBody, CTable, CTableRow, CTableHeaderCell, CTableHead } from '@coreui/vue'
import { CSmartTable, CBadge, CButton, CCollapse, CCardBody  } from '@coreui/vue-pro'
import { h } from 'vue'
import { CMultiSelect } from '@coreui/vue-pro'
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
      columnsMultiSelect: [
        {
          key: 'name',
          _style: { width: '50%' },
        },
        {
          key: 'role',
          _style: { width: '50%' },
          // filter: (values, onChange) => {
          //   const unique = [...new Set(values)].sort()
          //   return h(CMultiSelect, {
          //     size: 'sm',
          //     onChange: (selected) => {
          //       const _selected = selected.map((element) => element.value)
          //       onChange(function(item) {
          //         return Array.isArray(_selected) && _selected.length
          //             ? _selected.includes(item.toLowerCase())
          //             : true
          //       })
          //     },
          //     options: unique.map((element) => {
          //       return {
          //         value: element.toLowerCase(),
          //         text: element,
          //       }
          //     })})
          // },
          // sorter: false,
        },
      ],
      itemsMultiSelect: [
        { id: 0, name: 'John Doe', role: 'Guest' },
        {
          id: 1,
          name: 'Samppa Nori',
          role: 'Member',
        },
        {
          id: 2,
          name: 'Estavan Lykos',
          role: 'Staff',
        },
        { id: 3, name: 'Chetan Mohamed', role: 'Admin' },
        {
          id: 4,
          name: 'Derick Maximinus',
          role: 'Member',
        },
        { id: 5, name: 'Friderik Dávid', role: 'Staff' },
        { id: 6, name: 'Yiorgos Avraamu', role: 'Member' },
        {
          id: 7,
          name: 'Avram Tarasios',
          role: 'Staff',
        },
        { id: 8, name: 'Quintin Ed', role: 'Admin' },
        { id: 9, name: 'Enéas Kwadwo', role: 'Member' },
        { id: 10, name: 'Agapetus Tadeáš', role: 'Staff' },
        { id: 11, name: 'Carwyn Fachtna', role: 'Member' },
        { id: 12, name: 'Nehemiah Tatius', role: 'Staff' },
        { id: 13, name: 'Ebbe Gemariah', role: 'Admin' },
        {
          id: 14,
          name: 'Eustorgios Amulius',
          role: 'Member',
        },
        { id: 15, name: 'Leopold Gáspár', role: 'Staff' },
        { id: 16, name: 'Pompeius René', role: 'Member' },
        { id: 17, name: 'Paĉjo Jadon', role: 'Staff' },
        {
          id: 18,
          name: 'Micheal Mercurius',
          role: 'Admin',
        },
        {
          id: 19,
          name: 'Ganesha Dubhghall',
          role: 'Member',
        },
        { id: 20, name: 'Hiroto Šimun', role: 'Staff' },
        { id: 21, name: 'Vishnu Serghei', role: 'Member' },
        { id: 22, name: 'Zbyněk Phoibos', role: 'Staff' },
        {
          id: 23,
          name: 'Aulus Agmundr',
          role: 'Member',
        },
        {
          id: 42,
          name: 'Ford Prefect',
          role: 'Alien',
        },
      ]
    }
  }
}

// export default {
//   data() {
//     return {
//       columns: ['id', 'class', 'heading_1', 'hello'],
//       items: [
//         {id: 'Chetan Mohamed', class: '2018/02/01', heading_1: 'Admin', heading_2: 'hello'}
//       ]
//     }
//   },
//
//   async created() {
//     const submodel = await getReq()
//     console.log(this.items[0]['id'])
//     this.items[0]['id'] = submodel.sub
//   },
//
//   methods: {
//     async loadData() {
//       const submodel = await getReq()
//       console.log(this.items[0]['id'])
//       this.items[0]['id'] = submodel.sub
//     }
//   },
//   watch: {
//     async updateData() {
//
//     }
//   },
// }

</script>

<style scoped>

</style>