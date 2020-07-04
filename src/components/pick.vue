<template>
    <div class="pick">
        <div class="head">
            <label>订单拣货：</label>
            <el-input class="input" placeholder="请输入拣货产品id" v-model="check_id"/>
            <el-button type="primary" @click="pickSubmit">确认</el-button>
        </div>
        <div>
            <el-table
                border
                :data="tableData"
                :span-method="dataProxy"
                style="width: 80%; margin: 20px auto">
                <el-table-column
                    prop="orderId"
                    label="订单id"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="tag"
                    label="id"
                    width="360">
                </el-table-column>
                <el-table-column
                    prop="buy"
                    label="购买数量">
                </el-table-column>
                <el-table-column
                    prop="shelve"
                    label="货架">
                </el-table-column>
                <el-table-column
                    prop="position"
                    label="货位">
                </el-table-column>
                <el-table-column
                    prop="if_pick"
                    label="已拣货">
                </el-table-column>
            </el-table>
        </div>
        <el-button v-if="tableData.length !== 0" type="primary" class="submit_button" @click="submit">
            下一个订单
        </el-button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            check_id: '',
            order: [
                {
                    orderId: '1',
                    tag: '4a507db7-7c52-2c22-d6a6-77ade48625bd',
                    buy: 1
                },
                {
                    orderId: '1',
                    tag: '33783757-e89e-3262-f0a4-e9db956ca1c3',
                    buy: 2
                },
                {
                    orderId: '1',
                    tag: '8422024f-cfbc-9309-d884-07db3221fbec',
                    buy: 2
                }
            ],
            tableData: []
        }
    },
    async created () {
        this.tableData = Array.from(this.order)
        for(let item of this.tableData) {
            await this.$axios.get('http://localhost:3001/goods/' + item.tag).then(res => {
                this.$set(item, 'shelve', res.data.shelve)
                this.$set(item, 'position', res.data.position)
                this.$set(item, 'num', res.data.num)
                this.$set(item, 'if_pick', '否')
            })
        }
    },
    methods: {
        pickSubmit () {
            for(let item of this.tableData) {
                if(item.tag === this.check_id) {
                    item.if_pick = '是'
                    this.$axios.post('http://localhost:3001/goodsUpdate', {
                        tag: item.tag,
                        num: item.num - item.buy
                    })
                }
            }
        },
        dataProxy({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 5 === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        submit () {
            let complete = this.tableData.every((item, index) => {
                return item.if_pick === '是'
            })
            if(!complete) {
                this.$message({
                    message: '请先完成本次订单所有产品的拣货',
                    type: 'warning'
                });
                return
            }
            this.tableData = []
        }
    }
}
</script>

<style scoped>
.pick {
    display: flex;
    flex-direction: column;
    height: 100%;
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

.input {
    width: 50%;
    margin: auto 10px;
}

.item {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.submit_button {
    align-self: center;
    position: absolute;
    bottom: 80px;
}
</style>