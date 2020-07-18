<template>
    <div class="check">
        <div class="head" v-if="!admin">
            <label>库存盘点：</label>
            <el-input class="input" placeholder="请输入库存位置，如：A1" v-model="location"/>
            <el-button type="primary" @click="checkSubmit">确认</el-button>
        </div>
        <div class="head" v-if="admin">
            <label>库存盘点</label>
        </div>
        <div class="main_table" v-if="!admin">
            <label>今日负责盘点的货架为：{{ shelve }}</label>
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
                    prop="num"
                    label="库存">
                </el-table-column>
                <el-table-column
                    label="实际库存数">
                    <template slot-scope="scope">
                        <el-input class="input" placeholder="请输入盘点数量" v-model="num_fact"/>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="result" v-if="admin && output">
            <div>
                <label>请选择日期：</label>
                <el-date-picker
                    v-model="outputTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <el-button type="primary" @click="confirmOuput">
                    确认
                </el-button>
            </div>
            <el-table
                border
                :data="tableData"
                style="width: 60%; margin: 10px auto 12% auto;">
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
        <div class="result" v-if="admin && rate">
            <div>
                <label>请选择日期：</label>
                <el-date-picker
                    v-model="rateTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <el-button type="primary" @click="confirmRate">
                    确认
                </el-button>
            </div>
            <el-table
                border
                :data="tableData"
                style="width: 60%; margin: 10px auto 12% auto;">
                <el-table-column
                    prop="belongs"
                    label="盘点人"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="shelve"
                    label="盘点货架">
                </el-table-column>
                <el-table-column
                    prop="rate"
                    label="进度">
                </el-table-column>
            </el-table>
        </div>
        <div class="manage" v-if="admin && !output && !rate">
            <div class="manage_items">
                <label>请选择时间：</label>
                <el-date-picker
                v-model="info.times"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="manage_items">
                <label>请选择员工：</label>
                <el-select v-model="info.name" placeholder="请选择">
                    <el-option
                    v-for="item in persons"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="manage_items">
                <label>请选择货位：</label>
                <el-select v-model="info.shelve" placeholder="请选择货位">
                    <el-option
                    v-for="item in shelves"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="submit_button">
            <el-button type="primary" @click="submit" v-if="!admin">
                提交盘点
            </el-button>
            <el-button type="primary" @click="post" v-if="admin && !output && !rate">
                提交指派
            </el-button>
            <el-button type="primary" @click="getOutput" v-if="admin && !output && !rate">
                输出报表
            </el-button>
            <el-button type="primary" @click="getRate" v-if="admin && !output && !rate">
                查看进度
            </el-button>
            <el-button type="primary" @click="back" v-if="output || rate">
                返回盘点
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            location: '',
            tableData: [],
            num_fact: '',
            output: false,
            rate: false,
            admin: 0,
            info: {
                times: '2020-07-06',
                name: '',
                shelve: ''
            },
            persons: ['aaa', 'bbb', 'ccc', 'ddd'],
            shelves: ['A', 'B', 'C', 'D'],
            shelve: '',
            outputTime: '2020-07-06',
            rateTime: '2020-07-06'
        }
    },
    created () {
        this.admin = localStorage.getItem('is_admin')
        if(this.admin == 0) this.admin = false
    },
    methods: {
        checkSubmit () {
            this.if_output = false
            this.$axios.get('http://localhost:3001/goodsInfo/' + this.location).then(res => {
                if(res.data) {
                    this.tableData = [ res.data ]
                    this.num_fact = res.data.num
                }
                else this.tableData = []
            })
        },
        submit () {
            let record = this.num_fact - this.tableData[0].num
            this.$axios.post('http://localhost:3001/goodsUpdate', {
                tag: this.tableData[0].tag,
                num: this.num_fact
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
        getOutput () {
            this.output = true
        },
        confirmOuput () {
            // 查看某日报表
            this.$axios.get('http://localhost:3001/record/' + this.outputTime).then(res => {
                if(res.data.length !== 0) {
                    this.tableData = res.data
                }
                else {
                    this.tableData = []
                    this.$message({
                        message: '暂无记录',
                        type: 'success'
                    })
                }
            })
        },
        getRate () {
            this.rate = true
        },
        confirmRate () {
            console.log(this.rateTime)
            // 查看某日进度
            this.tableData = []
            this.$axios.get('http://localhost:3001/stocktakings/' + this.rateTime).then(res => {
                for(let i=0; i<4; i++) {
                    let temp
                    if(res.data.length === 0) {
                        temp = { 'belongs': this.persons[i], shelve: this.shelves[i], rate: '0/12'}
                    }
                    this.tableData.push(temp)
                }
            })
        },
        back () {
            this.tableData = []
            this.output = false
            this.rate = false
        },
        post () {
            // 提交指派
            this.$axios.post('http://localhost:3001/stocktakings', this.info).then(res => {
                this.$message({
                    message: '指派成功',
                    type: 'success'
                })
            })
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

.main_table {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.manage {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 7%;
}

.manage_items {
    margin-bottom: 20px;
}

.result {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
}

.submit_button {
    align-self: center;
    position: absolute;
    bottom: 80px;
}
</style>