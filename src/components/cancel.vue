<template>
    <div class="cancel">
        <div class="head">
            <label>订单退货</label>
        </div>
        <div class="main">
            <p>请确认退货订单和产品信息：</p>
            <el-input class="input" placeholder="请输入退货产品订单号" v-model="info.orderId"/>
            <el-input class="input" placeholder="请输入退货产品id" v-model="info.tag"/>
            <el-input class="input" placeholder="请输入退货产品数量" v-model="info.num"/>
            <div>
                <el-button type="primary" @click="next" style="margin-top: 10px">处理下一个退货</el-button>
                <el-button type="primary" @click="submit" style="margin-top: 10px">退货</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tableData: [],
            info: {
                    tag: '9be101d5-e5b2-d805-2eed-3afa6d0e9627',
                    orderId: 'RDU6O6EA',
                    num: '1'
            },
            cancel: [
                {
                    tag: '1531a85c-8438-478a-9e14-2e89afd438bc',
                    orderId: 'MBRFNROW',
                    num: '1'
                }
            ],
            num: 1
        }
    },
    methods: {
        submit () {
            this.$axios.post('http://localhost:3001/orders/cancel', this.info).then(res => {
                this.$message({
                    message: '退货成功',
                    type: 'success'
                })
            }, err => {
                this.$message({
                    message: '订单号或者商品id错误',
                    type: 'error'
                })
            })
        },
        next () {
            if(this.num > 1) this.info = { tag: '', orderId: '', num: ''}
            else this.info = this.cancel[0]
            this.num++
        }
    }
}
</script>

<style scoped>
.cancel {
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