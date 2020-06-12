<template>
  <div>
  	<div class="news-header">
  		<el-button type="primary" @click="$router.push('/admin/news/add')">添加文章</el-button>
  	</div>
  	<el-table :data="tableData" stripe style="width: 100%">
	    <el-table-column label="标题">
	    	<template slot-scope="scope">
	    		<router-link :to="`/news/detail/${scope.row.id}`">{{ scope.row.title }}</router-link>
	    	</template>
	    </el-table-column>	    
	    <el-table-column label="创建时间" width="180">
	    	<template slot-scope="scope">
	    		{{ parseDate(scope.row.createDate) }}
	    	</template>
	    </el-table-column>
	    <el-table-column label="缩略图" width="180">
	    	<template slot-scope="scope">
	    		<img :src="scope.row.imgUrl" height="50" alt="">
	    	</template>
	    </el-table-column>		     	    
	    <el-table-column label="操作" width="240">
	    	<template slot-scope="scope">
		    	<el-button type="primary" icon="el-icon-edit" circle @click="$router.push(`/admin/news/edit/${scope.row.id}`)"></el-button>
		    	<el-button type="danger" icon="el-icon-delete" circle @click.native="deleteFun(scope.row)"></el-button>
			    <el-button class="file-upload" type="primary">
			        上传<i class="el-icon-upload el-icon--right"></i>
			        <label class="file-upload-label">          
			          <input type="file" accept=".jpg,.png,.gif,.jpeg" @change="uploadFun($event,scope.row.id)">
			        </label>
			    </el-button>      
	    	</template>
	    </el-table-column>	     	    
  	</el-table>

	<div class="page">
	  	<el-pagination background layout="prev, pager, next" :total="page.total" :page-size="page.pageNum" :current-page="page.page" @current-change="currentChange">
		</el-pagination>
	</div>
  </div>
</template>

<script>
import { getNews,deleteNewsById,putNewsImgById } from '@/api/news';
import { parseDate } from '@/utils/date';

export default {
  data () {
    return {
      tableData:[],

      page: {
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
  	parseDate,
  	getNews(){
  		getNews({
  			params: this.page
  		}).then(res =>{
  			var data = res.data.data;
  			this.tableData = data;
  			this.page.total = res.data.total;
  		});
  	},
  	currentChange(page){
  		this.page.page = page;
  		this.getNews();
  	},
  	deleteFun(row){
  		/*var title = row.title;
  		var id = row.id;*/
  		var { title,id } = row;//等价写法
  		this.$confirm(`此操作将永久删除-《${title}》, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {//确认删除
        	deleteNewsById({
        		params: {
        			id
        		}
        	}).then(res =>{
        		var { code,msg,data } = res.data;
        		if(code == 0){//成功删除
        			this.$message({
			            type: 'success',
			            message: '删除成功!'
		          	});
		          	this.getNews();
        		}
        		else{
        			this.$message({
			            type: 'error',
			            message: '删除失败!'
			        });
        		}
        	}).catch(err =>{
        		this.$message({
		            type: 'error',
		            message: 'Error'
		        });
        	}) ;         
        }).catch(() => {//取消删除
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
  	},
  	uploadFun(e,id){//e是事件对象,id指文章
  		var  file = e.target.files[0];
  		if(file){
  			var formData = new FormData();
  			formData.append('file',file);
  			formData.append('id',id);
  			putNewsImgById({
  				data: formData
  			}).then(res =>{
  				this.getNews();
  			}).catch(err =>{

  			});
  		}
  	},
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.news-header{
		text-align: right;
		margin-bottom: 10px;
	}
	.page{
		margin-top: 10px;
		text-align: center;
	}
  	.file-upload{
	    position:relative;
	    overflow: hidden;
	    z-index:5;
	    .file-upload-label{
	      position:absolute;
	      left:0;
	      top:0;
	      width:100%;
	      height:100%;
	    }
	    [type="file"]{
	      opacity: 0;
	      position:absolute;
	    }
	}
</style>
