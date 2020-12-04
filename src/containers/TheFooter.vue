<template>
  <CFooter :fixed="false">
    <div style="font-size: 12px">
      <a href="https://heed.to" target="_blank">Heed Digital AS</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}}</span>
    </div>
    <div class="mfs-auto" style="font-size: 12px">
      <span class="mr-1" >Powered by</span>
      <a href="https://coreui.io/vue" target="_blank">CoreUI for Vue</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
