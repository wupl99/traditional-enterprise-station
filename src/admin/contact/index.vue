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
      <el-form-item label="联系地址" prop="address">
        <el-input v-model.trim="formData.address" type="text" :disabled="!isEditStatus"></el-input>
      </el-form-item>
      <el-form-item label="办公电话" prop="officeTel">
        <el-input v-model="formData.officeTel" type="text" :disabled="!isEditStatus"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactTel">
        <el-input v-model="formData.contactTel" type="text" :disabled="!isEditStatus"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="postcode">
        <el-input v-model="formData.postcode" type="text" :disabled="!isEditStatus"></el-input>
      </el-form-item>
      <el-form-item label="电子邮件" prop="email">
        <el-input v-model="formData.email" type="text" :disabled="!isEditStatus"></el-input>
      </el-form-item>
      <el-form-item class="contact-add">
        <el-button v-if="!isEditStatus" type="primary" @click="isEditStatus = true;">编辑</el-button>
        <el-button v-if="isEditStatus" @click="close()">返回</el-button>
        <el-button v-if="isEditStatus" type="primary" @click="submit()">修改</el-button>
      </el-form-item>
    </el-form> 
  </div>
</template>

<script>
import { getContact,putContact } from '@/api/contact';

export default {
  data () {
    return {
      labelPosition: 'right',
      formData: {
      	imgUrl:'',
        address:'',
        officeTel:'',
        contactTel:'',
        postcode:'',
        email:'',
      },

      fileData: null,//记录文件对象

      isShowFileError: false,//是否显示文件的错误提示

      isEditStatus: false,//true表示是在编辑状态，false表示查看状态

      rules: {
      	imgUrl: [
      		{ required: true, message: '请上传图片', trigger: 'blur'},     		
      	],
      	address: [
      		{ required: true, message: '请输入联系地址', trigger: 'blur'},     		
      	],
      	officeTel: [
      		{ required: true, message: '请输入办公电话', trigger: 'blur'},
      		{ pattern: /^[0-9]{8}$/, message: '请输入八位固定电话', trigger: 'blur'},
      	],
        contactTel: [
          { required: true, message: '请输入联系电话', trigger: 'blur'},
          { pattern: /^1[0-9]{10}$/, message: '请输入11位移动电话', trigger: 'blur'},
        ],
        postcode: [
          { required: true, message: '请输入邮政编码', trigger: 'blur'},
          { pattern: /^[0-9]{6}$/, message: '请输入六位邮政编码', trigger: 'blur'},
        ],
        email: [
          { required: true, message: '请输入电子邮件', trigger: 'blur'},
          { type:'email', message: '请输入正确的邮箱地址', trigger: 'blur'},
        ],
      },
    }
  },
  created(){
    this.getContact();
  },
  methods: {
  	close(){
  		this.isEditStatus = false;
  		this.isShowFileError = false;
  		this.getContact();
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
  				data.append('address',this.formData.address);
  				data.append('officeTel',this.formData.officeTel);
  				data.append('contactTel',this.formData.contactTel);
  				data.append('postcode',this.formData.postcode);
  				data.append('email',this.formData.email);

  				putContact({
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
  	getContact(){
  		getContact({}).then(res =>{
  			var data = res.data.data;
  			this.formData = data;
  		}).catch(err=>{
  			console.log(err);
  		});
  	},
  },
  watch: {

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .contact-add{
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
</style>
