<template>
    <div id="all">
        <div id="head">
            <div class="title">Warehouse Management</div>
            <div v-if="login" style="margin-right: 20px" @click="toLogout">退出</div>
        </div>
        <el-row v-if="login" id="main">
            <el-col :span="4">
                <el-menu id="tab" default-active="1" @select="select">
                    <el-menu-item index="1">
                        <i class="el-icon-view"></i>
                        <span slot="title">库存查询</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-shopping-cart-2"></i>
                        <span slot="title">订单拣货</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="el-icon-notebook-1"></i>
                        <span slot="title">库存盘点</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-notebook-2"></i>
                        <span slot="title">产品入库</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <i class="el-icon-folder-delete"></i>
                        <span slot="title">订单退货</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <component :is="currentTabComponent">
                </component>
            </el-col>
        </el-row>
        <div class="login" v-if="!login">
            <p>请输入账号密码登录</p>
            <el-input class="input" placeholder="请输入账号" v-model="info.name"/>
            <el-input class="input" placeholder="请输入密码" show-password v-model="info.password"/>
            <el-button type="primary" @click="tologin" style="margin-top: 10px">登录</el-button>
        </div>
    </div>
</template>

<script>
import queryCom from './components/query'
import pickCom from './components/pick'
import checkCom from './components/check'
import inboundCom from './components/inbound'
import cancelCom from './components/cancel'
export default {
    components: {
        queryCom: queryCom,
        pickCom: pickCom,
        checkCom: checkCom,
        inboundCom: inboundCom,
        cancelCom: cancelCom
    },
    data () {
        return {
            currentTabComponent: queryCom,
            login: true,
            info: {
                name: '',
                password: ''
            }
        }
    },
    methods: {
        select (index) {
            if(index === '1') {
                this.currentTabComponent = queryCom;
            } else if(index === '2') {
                this.currentTabComponent = pickCom;
            } else if(index === '3') {
                this.currentTabComponent = checkCom;
            } else if(index === '4') {
                this.currentTabComponent = inboundCom;
            } else if(index === '5') {
                this.currentTabComponent = cancelCom;
            }
        },
        tologin() {
            this.$axios.post('http://localhost:3001/login', this.info).then(res => {
                this.$message({
                    type:'success',
                    message:'登录成功'
                })
                localStorage.setItem('is_admin', res.data.is_admin)
                localStorage.setItem('id', res.data.id)
                this.login = true
                this.currentTabComponent = queryCom;
            }, err => {
                this.$message({
                    type:'error',
                    message:'账号或密码错误，请重试'
                })
            })
        },
        toLogout () {
            this.login = false
        }
    }
}
</script>

<style scoped>
#all{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#head {
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: #cccccc solid 1px;
}

#main {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex: row;
}

.title {
    color: black;
    font-family: 'Courier New', Courier, monospace;
    font-size: 24px;
    margin-left: 20px;
}

#tab {
    height: 100%;
}

.input {
    width: 42%;
    margin: 10px;
}

.login {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10%;
}
</style>