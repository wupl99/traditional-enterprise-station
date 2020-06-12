<template>
<div class="clearFix">
  <div class="main_left">
      <div class="main_tit main_L_tit">
          <h3>栏目导航<i>NAVIGATION</i></h3>
        </div>
        <ul class="main_L_nav">
          <li v-for="(item,index) in navData" :key="index"><router-link :to="item.to">{{ item.name }}</router-link></li>
        </ul>
        <a class="main_L_contact" href="##"><img src="@/assets/img/contact.jpg" width="184" height="70" alt="联系我们" /></a>
        <ul class="main_L_address">
          <li>联系地址：{{ contentData.address }}</li>
              <li>办公电话：{{ contentData.officeTel }}</li>
              <li>联系电话：{{ contentData.contactTel }}</li>
              <li>邮政编码：{{ contentData.postcode }}</li>
              <li>电子邮件：{{ contentData.email }}</li>
        </ul>
    </div>
    
    <router-view/>
</div>
</template>

<script>
import { getContact } from '@/api/contact';

export default {
  data () {
    return {
      navData: [
        { to: '/profile', name: '公司简介' },
        { to: '/product/list', name: '产品列表' },
        { to: '/news/list', name: '行业资讯' },
        { to: '/contact', name: '联系我们' },
      ],
      contentData: {},
    }
  },
  created(){
    this.getContact();
  },
  methods: {
    getContact(){
      var _this = this;
      getContact({
        params: {
          a: 1
        },
      }).then(function(res){
        //console.log(res);
        _this.contentData = res.data.data;
      }).catch(function(err){
        //console.log(err);
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
