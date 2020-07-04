<template>
    <div class="query">
        <div class="head">
            <label>库存查询：</label>
            <el-input class="input" placeholder="请输入查询产品id" v-model="check_id"/>
            <el-button type="primary" @click="submit">查询</el-button>
        </div>
        <div class="main_table">
            <el-table
                border
                :data="tableData"
                style="width: 80%; margin: 12% auto;">
                <el-table-column
                    prop="tag"
                    label="id"
                    width="360">
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
    </div>
</template>

<script>
export default {
    data () {
        return {
            check_id: '',
            tableData: []
        }
    },
    methods: {
        submit () {
            this.$axios.get('http://localhost:3001/goods/' + this.check_id).then(res => {
                if(res.data) this.tableData = [ res.data ]
                else this.tableData = []
            })
        }
    }
}
</script>

<style scoped>
.query {
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
</style>