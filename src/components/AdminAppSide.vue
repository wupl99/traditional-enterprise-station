<template>
  <el-menu :default-active="indexActive" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item v-for="item in navData" :index="item.to" :key="item.to">
      <router-link slot="title" :to="item.to">
        <i class="el-icon-menu"></i>
        <span>{{ item.name }}</span>
      </router-link>
    </el-menu-item>
  </el-menu>

</template>

<script>
export default {
  data () {
    return {
      navData: [
        { to: '/admin/index', name: '首页'},
        { to: '/admin/profile', name: '公司简介'},
        { to: '/admin/news', name: '新闻资讯'},
        { to: '/admin/product', name: '公司产品'},
        { to: '/admin/contact', name: '联系我们'},
      ],

      indexActive: 'admin/index',
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .el-menu{
    height: 100%;
    .el-menu-item{
      padding: 0 !important;
      &.is-active{
        background: #409EFF !important;
      }
      a{
        display: block;
        padding:0 20px;
        height: 100%;
        color: #fff; 
      }
    }
  }
</style>
