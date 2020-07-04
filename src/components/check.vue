<template>
    <div class="check">
        <div class="head">
            <label>库存盘点：</label>
            <el-input class="input" placeholder="请输入库存位置，如：A1" v-model="location"/>
            <el-button type="primary" @click="checkSubmit">确认</el-button>
        </div>
        <div class="main_table">
            <el-table
                border
                v-if="!if_output"
                :data="tableData"
                style="width: 80%; margin: 12% auto;">
                <el-table-column
                    prop="tag"
                    label="id"
                    width="360">
                </el-table-column>
                <el-table-column
                    prop="num"
                    label="库存">
                </el-table-column>
                <el-table-column
                    label="实际库存数">
                    <template slot-scope="scope">
                        <el-input class="input" placeholder="请输入盘点数量" v-model="num"/>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                border
                v-if="if_output"
                :data="tableData"
                style="width: 60%; margin: 12% auto;">
                <el-table-column
                    prop="good.tag"
                    label="id"
                    width="360">
                </el-table-column>
                <el-table-column
                    prop="record"
                    label="盘点结果">
                </el-table-column>
            </el-table>
        </div>
        <div class="submit_button" v-if="!if_output">
            <el-button type="primary" @click="submit">
                提交盘点
            </el-button>
            <el-button type="primary" @click="output">
                输出报表
            </el-button>
        </div>
        <el-button v-if="if_output" class="submit_button" type="primary" @click="back">
            返回盘点
        </el-button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            location: '',
            tableData: [],
            num: '',
            if_output: false,
            record_times: 0
        }
    },
    created () {
        this.$axios.get('http://localhost:3001/recordTimes').then(res => {
            if(res.data[0] && res.data[0].times) this.record_times = res.data[0].times+1
            else this.record_times = 1
        })
    },
    methods: {
        checkSubmit () {
            this.if_output = false
            this.$axios.get('http://localhost:3001/goodsInfo/' + this.location).then(res => {
                if(res.data) {
                    this.tableData = [ res.data ]
                    this.num = res.data.num
                }
                else this.tableData = []
            })
        },
        submit () {
            let record = this.num - this.tableData[0].num
            this.$axios.post('http://localhost:3001/goodsUpdate', {
                tag: this.tableData[0].tag,
                num: this.num
            }).then(res => {
                if(record === 0) {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    })
                    return
                }
                this.$axios.post('http://localhost:3001/recordAdd', {
                    record: record,
                    times: this.record_times,
                    goodsId: this.tableData[0].id
                }).then(res => {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    })
                })
            })
        },
        output () {
            this.if_output = true
            this.$axios.get('http://localhost:3001/record/' + this.record_times).then(res => {
                if(res.data) {
                    this.tableData = res.data
                }
                else this.tableData = []
            })
        },
        back () {
            this.tableData = []
            this.if_output = false
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

.submit_button {
    align-self: center;
}
</style>