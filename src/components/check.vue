<template>
    <div class="check">
        <div class="head">
            <label>库存盘点</label>
            <el-input class="input" placeholder="请输入库存位置，如：A1" v-model="check_id"/>
            <el-button type="primary" @click="checkSubmit">确认</el-button>
        </div>
        <div class="main_table">
            <el-table
                :data="tableData"
                style="width: 80%; margin: 12% auto;">
                <el-table-column
                    prop="id"
                    label="id"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="num"
                    label="库存">
                </el-table-column>
                <el-table-column label="实际库存数">
                    <template slot-scope="scope">
                        <el-input class="input" placeholder="请输入实际库存数量" v-model="check_id"/>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-button type="primary" class="submit_button" @click="submit">
            提交盘点
        </el-button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            check_id: '',
            tableData: [
                {
                    id: '123',
                    shelve: '123',
                    position: '123',
                    num: '123'
                }
            ]
        }
    },
    methods: {
        submit () {
            
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

.main_table {
    height: 100%;
    width: 100%;
    position: relative;
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
}
</style>