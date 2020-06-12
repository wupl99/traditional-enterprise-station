<template>
  <div>
    <app-header></app-header>
    <app-main></app-main>
    <app-footer></app-footer> 
  </div>
</template>

<script>
import appHeader from '@/components/AppHeader';
import appMain from '@/components/AppMain';
import appFooter from '@/components/AppFooter';

export default {
  data () {
    return {
     
    }
  },
  components: {//注册组建
    appHeader,//appHeader: appHeader,
    appFooter,
    appMain,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
