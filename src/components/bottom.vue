<template>
  <footer>
      By Stephen Ball, {{year}}
  </footer>
</template>

<script>
const d = new Date()
const year = d.getFullYear()
export default {
    name: 'bottom',
    data() {
        return{
            year
        }
    }
}
</script>

<style lang="scss" scoped>
@media print {
    footer{
        display: none;
    }
}
</style>