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
@import '../scss/vars.scss';
footer{
    z-index: 1;
    @include card(1);
    background-color: $dark;
    color: white;
    padding: $gutter;
}
@media print {
    footer{
        display: none;
    }
}
</style>