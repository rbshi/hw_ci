<template>
  <div id="app"> {{ msg }} </div>
  <button @click="log">{{ msg }}</button>
  <button @click="getReq">getReq</button>
</template>

<script setup>
import axios from 'axios';
// variable
const msg = 'Hello!'

// functions
function log() {
  console.log(msg)
}

async function getReq() {
  const resp = await axios.get("http://localhost:3001/")
  console.log(resp.data.model)
}

</script>

<style scoped>

</style>