<template>
  <div class="list_right">
    <div class="list_tit"><span><i>◆</i></span>您现在所在的位置：<router-link to="/">首页</router-link>&gt;公司简介</div>
    <div class="deatil">
      <h2>{{ detailData.title }}</h2>
        <span class="deatil_span">发布于：{{ parseDate(detailData.createDate) }}</span>
        <div style="margin-bottom: 30px;" v-html="detailData.content"></div>
    </div>
  </div>
</template>

<script>
import { getProfile } from '@/api/profile';
import { parseDate } from '@/utils/date';

export default {
  data () {
    return {
      detailData: {},
    }
  },
  created(){
    this.getProfile();
  },
  methods: {
    parseDate,
    getProfile(){
      var _this = this;
      getProfile({
        params: {
          a: 1
        },
      }).then(function(res){
        console.log(res);
        _this.detailData = res.data.data;
      }).catch(function(err){
        console.log(err);
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
