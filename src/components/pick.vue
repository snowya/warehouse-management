<template>
    <div class="pick">
        <div class="head">
            <label>订单拣货：</label>
            <el-input class="input" placeholder="请输入拣货产品id" v-model="check_id"/>
            <el-button type="primary" @click="checkSubmit">确认</el-button>
        </div>
        <el-table
            border
            :data="tableData"
            :span-method="spanMethod"
            style="width: 80%; margin: 20px auto">
            <el-table-column
                prop="orderId"
                label="订单id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="id"
                label="id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="shelve"
                label="货架"
                width="180">
            </el-table-column>
            <el-table-column
                prop="position"
                label="货位">
            </el-table-column>
            <el-table-column
                prop="num"
                label="库存">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            check_id: '',
            tableData: [
                {
                    orderId: '1',
                    id: '123',
                    shelve: '123',
                    position: '123',
                    num: '123'
                },
                {
                    orderId: '1',
                    id: '123',
                    shelve: '123',
                    position: '123',
                    num: '123'
                },
                {
                    id: '123',
                    shelve: '123',
                    position: '123',
                    num: '123'
                },
                {
                    orderId: '2',
                    id: '1231',
                    shelve: '123',
                    position: '123',
                    num: '123'
                },
                {
                    id: '1231',
                    shelve: '123',
                    position: '123',
                    num: '123'
                }
            ]
        }
    },
    methods: {
        checkSubmit () {
            
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 3 === 0) {
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
        }
    }
}
</script>

<style scoped>
.check {
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

.input {
    width: 50%;
    margin: auto 10px;
}

.item {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>