<template>
  <div class="list_right">
      <div class="list_tit"><span><i>◆</i></span>您现在所在的位置：<router-link to="/">首页</router-link>&gt;产品列表</div>
        <div class="product">
          <dl v-for="(item,index) in listData" :key="item.id">
            <dt><router-link :to="'/product/detail/'+item.id"><img :src="item.imgUrl" width="125" height="125" alt="产品" /></router-link></dt>
              <dd>
                <h4><router-link :to="'/product/detail/'+item.id">{{ item.title }}</router-link></h4>
                <p v-html="item.content"></p>
              </dd>
          </dl>
            <!-- <dl>
              <dt><a href="##"><img src="@/assets/img/1.jpg" width="125" height="125" alt="产品" /></a></dt>
                <dd>
                  <h4><a href="##">BK系列控制变压器</a></h4>
                    <p>适用范围：BK系列控制变压器适
             用于50Hz-60Hz的交流电路中，
             通常用作机床控制电器局部照明
             灯及指示灯的电源中。</p>
                </dd>
            </dl> -->
        </div>
        <div class="page">
          <a v-for="item in totalPage()" :key="item" href="javascript:;" style="margin-right: 10px;" :class="{'page_Cur': page.page == item }" @click="changePage(item)">{{ item }}</a>
        </div>
    </div>
</template>

<script>
import { getProduct } from '@/api/product';
import { parseDate } from '@/utils/date';

export default {
  data () {
    return {
      listData: [],//列表数据
      page: {//分页数据
        total: 0,
        page: 1,
        pageNum: 8,
      },
    }
  },

  created(){
    this.getProduct();
  },

  methods: {
    parseDate: parseDate,
    getProduct(){
      var _this = this;
      getProduct({
        params: {
          page: _this.page.page,
        }
      }).then(function(res){
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
      _this.getProduct();
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
