<template>
    <el-row id="main">
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
            </el-menu>
        </el-col>
        <el-col :span="20">
            <component :is="currentTabComponent">
            </component>
        </el-col>
    </el-row>
</template>

<script>
import queryCom from './components/query'
import pickCom from './components/pick'
import checkCom from './components/check'
export default {
    components: {
        queryCom: queryCom,
        pickCom: pickCom,
        checkCom: checkCom
    },
    data () {
        return {
            currentTabComponent: queryCom
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
            }
        }
    }
}
</script>

<style scoped>
#main {
    width: 80%;
    height: 80%;
    border: gainsboro solid 1px;
    background-color: white;
    display: flex;
    flex: row;
}

#tab {
    height: 100%;
}
</style>