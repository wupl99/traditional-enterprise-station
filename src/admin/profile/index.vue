<template>
  <div>
    <el-form :rules="rules" ref="formNode" :label-position="labelPosition" label-width="100px" :model="formData" status-icon>
      <el-form-item label="图片" prop="imgUrl">
        <div v-if="isEditStatus">
          <div><img :src="formData.imgUrl" height="100" alt=""></div>
          <el-button class="file-upload" type="primary" v-if="fileData == null">
            上传<i class="el-icon-upload el-icon--right"></i>
            <label class="file-upload-label">
              <input type="file" ref="fileNode" accept=".jpg,.jpeg,.png,.gif" @change="uploadFun">
            </label>
          </el-button>
          <el-tag v-else closable type="info" @close="()=>{
            fileData = null;
          }">{{ fileData.name }}</el-tag>
          <div v-show="isShowFileError" class="el-form-item__error">
            请输选择图片文件
          </div>
        </div>
        <img v-else :src="formData.imgUrl" height="100" alt="">
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="formData.title" type="text" :disabled="!isEditStatus"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="formData.description" type="textarea" :disabled="!isEditStatus"></el-input>
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <el-input v-if="!isEditStatus" v-html.trim="formData.content" type="textarea" disabled></el-input>
        <ueditor v-if="isEditStatus" v-model.trim="formData.content" ref="ueditor" :options="options" id="profile-add"></ueditor>
      </el-form-item>
      <el-form-item class="profile-add">
        <el-button v-if="!isEditStatus" type="primary" @click="isEditStatus = true;">编辑</el-button>
        <el-button v-if="isEditStatus" @click="close()">返回</el-button>
        <el-button v-if="isEditStatus" type="primary" @click="submit()">修改</el-button>
      </el-form-item>
    </el-form> 
  </div>
</template>

<script>
import { getProfile,putProfile } from '@/api/profile';
import { parseDate } from '@/utils/date';

export default {
  data () {
    return {
      labelPosition: 'right',
      formData: {
      	imgUrl:'',
        title:'',
        description:'',
        content:'',
      },

      fileData: null,//记录文件对象

      isShowFileError: false,//是否显示文件的错误提示

      isEditStatus: false,//true表示是在编辑状态，false表示查看状态

      rules: {
      	imgUrl: [
      		{ required: true, message: '请上传图片', trigger: 'blur'},     		
      	],
      	title: [
      		{ required: true, message: '请输入标题', trigger: 'blur'},     		
      	],
      	description: [
      		{ required: true, message: '请输入描述', trigger: 'blur'},
      	],
        content: [
          { required: true, message: '请输入正文', trigger: 'blur'},
        ],
      },

      options: {
        UEDITOR_HOME_URL: '/static/ueditor/', // ueditor静态资源目录 默认为/static/ueditor/
        initialFrameWidth: '100%',
      },
    }
  },
  created(){
    this.getProfile();
  },
  methods: {
    parseDate,
  	close(){
  		this.isEditStatus = false;
  		this.isShowFileError = false;
  		this.getProfile();
  		this.$refs.formNode.clearValidate();
  	},
  	submit(){
  		let isValid = false;//fasle校验不通过
  		if(this.fileData){
  			isValid = true;
  			this.isShowFileError = false;
  		}
  		else{
  			this.isShowFileError = true;
  		}

  		this.$refs.formNode.validate((valid) =>{
  			if(valid && isValid){//所有输入都符合要求
  				var data = new FormData();
  				data.append('file',this.fileData);//写入文件
  				data.append('title',this.formData.title);
  				data.append('description',this.formData.description);
  				data.append('content',this.formData.content);
  				/*data.append('createDate',this.formData.createDate);*/

  				putProfile({
  					data
  				}).then(res =>{
  					var code = res.data.code;
  					if(code == 0){
	  					this.$message({	
	  						message: res.data.msg,
	  						type: 'success'
	  					});
  					}
  					else{
  						this.$message({	
	  						message: res.data.msg,
	  						type: 'error'
	  					});
  					}
  					this.close();
  				}).catch(err =>{
  					this.$message({
  						message: 'Error',
  						type: 'error'
  					});
  				});
  			}
  		});
  	},
  	uploadFun(e){
      var file = e.target.files[0];
      this.fileData = file;
      this.isShowFileError = false;
    },
  	getProfile(){
  		getProfile({}).then(res =>{
  			var data = res.data.data;
  			this.formData = data;
  		}).catch(err=>{
  			console.log(err);
  		});
  	},
  },
  watch: {
    ['formData.content'](newval,oldval){
      this.$refs.formNode.validateField('content');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .profile-add{
		text-align: center;
	}
	/deep/.none-line-height .el-form-item__content{
	  line-height: inherit;
	}
	.file-upload{
	  position: relative;
	  overflow: hidden;
	  .file-upload-label{
	    position: absolute;
	    left:0;
	    top:0;
	    width: 100%;
	    height: 100%;
	  }
	  [type="file"]{
	    opacity: 0;
	    position: absolute;
	  }
	}

	/deep/{
	  .el-input.is-disabled .el-input__inner{
	    background: transparent;//透明
	    border-color: transparent;
	    color: #000;
	    cursor: auto;
	  }
	}
  /deep/{
     .el-textarea.is-disabled .el-textarea__inner{
        background: transparent;//透明
        border-color: transparent;
        color: #000;
        cursor: auto;
     }
  }
</style>
