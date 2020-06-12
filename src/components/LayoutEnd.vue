<template>
    <el-container class="admin-container">
      <el-header class="admin-header">
        Header
        <div class="web_map"><router-link to="/">前端页面</router-link></div>
        </el-header>
      <el-container class="admin-main">
        <el-aside width="200px">
          <admin-app-side></admin-app-side>
        </el-aside>
        <el-main><router-view/></el-main>
      </el-container>
    </el-container>   
</template>

<script>
import adminAppSide from '@/components/AdminAppSide';

export default {
  data () {
    return {
     
    }
  },
  components: {
    adminAppSide,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .admin-container{height: 100%;}
  .admin-main{height: calc(100% - 60px);}
  .admin-header{position:relative;z-index: 8; background: #fff;box-shadow: 5px -5px 11px  0px #615a5a;}
</style>
