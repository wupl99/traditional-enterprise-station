<template>
<div style="float: left;">
  <div class="main_middle">
    <div class="main_tit main_M_tit">
        <h3>公司简介<i>ABOUT US</i></h3>
          <router-link to="/profile">更多&gt;&gt;</router-link>
      </div>
      <div class="main_M_intr">
        <img :src="introduceData.imgUrl" width="140" height="140" alt="公司简介" />
          <p>{{ introduceData.description }}</p>
      </div>
      <div class="main_tit main_M_tit">
        <h3>产品简介<i>PRODUCTS</i></h3>
          <router-link to="/product/list">更多&gt;&gt;</router-link>
      </div>
      <div class="main_pro_list" @mouseenter="productAnimateEnter" @mouseleave="productAnimateLeave">
        <div class="main_pro_div" :style="{ 'margin-left': -productAnimate.move+'px' }">
              <dl v-for="(item,index) in productData" :key="item.id">
                  <dt><router-link :to="'/product/detail/'+item.id"><img :src="item.imgUrl" width="125" height="125" :alt="item.title" /></router-link></dt>
                  <dd><router-link :to="'/product/detail/'+item.id">{{ item.title }}</router-link></dd>
              </dl>
           </div>
      </div>
  </div>
  <div class="main_right">
    <div class="main_tit main_R_tit">
        <h3>行业资讯<i>News</i></h3>
          <router-link to="/news/list">更多&gt;&gt;</router-link>
      </div>
      <div class="main_R_flash">
       <ul class="m_R_img">
           <li :style="{ display: imgNewsActive == index ? '' : 'none' }" v-for="(item,index) in newsData" :key="item.id"><router-link :to="`/news/detail/${item.id}`"><img width="190" height="190" :src="item.imgUrl" :alt="item.title" /></router-link></li>
     	    </ul>
     	    <ul class="m_R_btn">
     	        <li :class="{ 'm_R_btnCur': index == imgNewsActive }" v-for="(item,index) in newsData" :key="item.id" @mouseenter="imgNewsActive = index;">{{ index+1 }}</li>
     	    </ul>
      </div>
      <ul class="main_R_news">
          <li v-for="item in newsData" :key="item.id"><i>&gt;</i><router-link :to="`/news/detail/${item.id}`">{{ item.title }}</router-link></li>
      </ul>
  </div>
</div>
</template>

<script>
import { getProfile } from '@/api/profile';
import { getImgProduct } from '@/api/product';
import { getImgNews } from '@/api/news';

export default {
  data () {
    return {
      introduceData: {},//公司简介数据
      productData: [],
      newsData: [],

      imgNewsActive: 0,//当前幻灯片选中位置

      productAnimate: {//产品动画参数
        move: 0,//移动的距离
        totalMove: 148,
        timeout: null,//记录计时器id
      },
    }
  },
  created(){
    this.getProfile();
    this.getImgProduct();
    this.getImgNews();
    this.productAnimateMove(0);

  },
  methods: {
    getProfile(){
      getProfile({}).then((res) =>{//箭头函数，箭头函数中this还是父作用域的this；传统函数this指向调用此函数的对象
        var data = res.data.data;
        this.introduceData = data;
      });
    },
    getImgProduct(){
      getImgProduct({}).then((res) =>{//箭头函数，箭头函数中this还是父作用域的this；传统函数this指向调用此函数的对象
        var data = res.data.data;
        this.productData = data;
      });
    },
    getImgNews(){
      getImgNews({}).then((res) =>{//箭头函数，箭头函数中this还是父作用域的this；传统函数this指向调用此函数的对象
        var data = res.data.data;
        this.newsData = data;
      });
    },
    productAnimateMove(step){//产品动画移动
      step += this.productAnimate.totalMove/60;
      if(step >= this.productAnimate.totalMove){//移动完成
        this.productAnimate.move = 0;
        let shiftData = this.productData.shift();//删除数组的第一个元素
        this.productData.push(shiftData);
        this.productAnimateMove(0);
      }
      else{
        this.productAnimate.timeout = setTimeout(() =>{
          this.productAnimate.move = step;
          this.productAnimateMove(step);
        },20);
      }
    },
    productAnimateEnter(){//鼠标移入触发
      clearTimeout(this.productAnimate.timeout);
    },
    productAnimateLeave(){//鼠标移出触发
      this.productAnimateMove(this.productAnimate.move);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .m_R_btn{
    width: auto;
  }
  .main_R_news li{
    overflow: hidden;
  }
</style>
