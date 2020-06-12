<template>
  <div class="list_right">
      <div class="list_tit"><span><i>◆</i></span>您现在所在的位置：<router-link to="/">首页</router-link>&gt;行业资讯</div>
        <ul class="news_list">
           <li v-for="(item,index) in listData" :key="item.id"><em>{{ parseDate(item.createDate) }}</em><router-link :to="'/news/detail/'+item.id">{{ item.title }}</router-link></li>
        </ul>
        <div class="page">
          <a v-for="item in totalPage()" :key="item" href="javascript:;" style="margin-right: 10px;" :class="{'page_Cur': page.page == item }" @click="changePage(item)">{{ item }}</a>  
        </div>
    </div>
</template>

<script>
import { parseDate } from '@/utils/date';
import { getNews } from '@/api/news';

export default {
  data () {
    return {
      listData: [],//列表数据

      page: {//分页数据
        total: 0,
        page: 1,
        pageNum: 10,
      },
    }
  },
  created(){
    this.getNews();
  },
  methods: {
    parseDate: parseDate,
    getNews(){
      var _this = this;
      getNews({
        params: {
          page: _this.page.page,
        }
      }).then(function(res){
        //console.log(res,9998);
        var data = res.data.data;
        _this.listData = data;
        _this.page.total = res.data.total;
      }).catch(function(err){
        console.log(err);
      });
    },
    totalPage(){
      return Math.ceil(this.page.total/this.page.pageNum);
    },
    changePage(page){
      var _this = this;
      _this.page.page = page;
      _this.getNews();
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
