<template>
  <div class="app" >
    <layout-front v-if="isFront"></layout-front>
    <layout-end v-else></layout-end>
  </div>
</template>

<script>
//import '@/assets/css/css.css';
import layoutFront from '@/components/LayoutFront'
import layoutEnd from '@/components/LayoutEnd'

export default {
  name: 'App',
  data(){//储存数据
    return {
      isFront: true,
    };
  },
  created(){
    console.log(this.$router,this.$route)//路由实例对象 路由信息对象
    this.$route.path;
    this.isFront = this.$route.path.indexOf('/admin/') != 0;
  },
  methods: {//储存方法

  },
  watch: {
    ['$route.path'](newval,oldval){//监听path值变化
      console.log(newval,oldval);
      this.isFront = newval.indexOf('/admin/') !=0;
    }
  },
  components: {//注册组建
    layoutFront,
    layoutEnd,
  },
}
</script>

<style lang="scss">
@import './assets/css/css.css';

html,body,.app{
  height:100%;
}
</style>
