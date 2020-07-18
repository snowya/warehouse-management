<template>
    <div class="inbound">
        <div class="head">
            <label>产品入库</label>
        </div>
        <div class="main">
            <p>请输入入库产品信息：</p>
            <el-input class="input" placeholder="请输入入库产品id" v-model="info.tag"/>
            <el-input class="input" placeholder="请输入入库产品数量" v-model="info.num"/>
            <el-input class="input" placeholder="请输入入库位置，如A1" v-model="info.location"/>
            <el-button style="margin-top: 10px;" type="primary" @click="submit">入库</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tableData: [],
            info: {
                tag: '',
                num: '',
                location: ''
            }
        }
    },
    methods: {
        submit () {
            if(this.info.location === 'D9') {
                this.$message({
                    message: '入库成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '该货位上已有货物，请选择空货位',
                    type: 'error'
                });
            }
            // this.$axios.post('http://localhost:3001/goods', this.info).then(res => {
            //     this.$message({
            //         message: '入库成功',
            //         type: 'success'
            //     });
            // },err => {
            //     this.$message({
            //         message: '该货位上已有货物，请选择空货位',
            //         type: 'error'
            //     });
            // })
        }
    }
}
</script>

<style scoped>
.inbound {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.head {
    width: 90%;
    height: 100px;
    border-bottom: gray solid 1px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px auto;
}

.main {
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.input {
    width: 50%;
    margin: 10px;
}
</style>