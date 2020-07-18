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
                    prop="num"
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
        <div class="submit_button" >
            <el-upload
                action=""
                :on-change="importOrder"
                class="upload-demo"
                accept=".xlsx,.xls,.csv,.xml"
                :auto-upload="false"
                :show-file-list="false"
                ref="upload"
                :limit="1">
                <el-button type="primary">导入订单</el-button>
            </el-upload>
            <el-button style="margin-left: 20px" v-if="tableData.length !== 0" type="primary" @click="submit">
                下一个订单
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            check_id: '',
            tableData: [],
            arr: [],
            spanArr: [],
            pos: 0
        }
    },
    methods: {
        updateTable () {
            for(let item of this.arr) {
                this.$axios.get('http://localhost:3001/goods/' + item.tag).then(res => {
                    this.$set(item, 'shelve', res.data.shelve)
                    this.$set(item, 'position', res.data.position)
                    this.$set(item, 'num', res.data.num)
                    this.$set(item, 'if_pick', '否')
                })
            }
            this.arr.sort((a, b) => {
                return a.shelve > b.shelve ? 1 : -1
            }).sort((a, b) => {
                return a.orderId > b.orderId ? 1 : -1
            })
            let temp = this.arr.splice(0, 5)
            this.getSpanArr(temp)
            this.tableData = temp
        },
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
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        getSpanArr(data) {
            this.spanArr = []
            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].orderId === data[i - 1].orderId) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
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
            this.next()
        },
        next () {
            let temp = this.arr.splice(0, 5)
            this.getSpanArr(temp)
            this.tableData = temp
            console.log(temp)
        },
        // excel表上传
        importOrder(file, fileList){
            // 判断上传文件格式
            let fileTemp = file.raw
            if(fileTemp){
                if((fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (fileTemp.type == 'application/vnd.ms-excel')){
                    this.importExcel(fileTemp)
                } else if(fileTemp.type === 'text/xml') {
                    this.jsonToXml(fileTemp)
                }
                this.$refs.upload.clearFiles();
            }
        },
        uploadOrder () {
            this.$axios.post('http://localhost:3001/orders', { orders: this.arr }).then(res => {
                this.$message({
                    type:'success',
                    message:'订单导入成功'
                })
            })
            this.updateTable()
        },
        importExcel(file) {
            var rABS = false; //是否将文件读取为二进制字符串
            var reader = new FileReader()
            FileReader.prototype.readAsBinaryString = (f) => {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = (e) => {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for(var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require('xlsx');
                    if(rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: 'binary'
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是读取excel内容之后输出的东西
                    for(let i=0; i<outdata.length; i++) {
                        let temp = {}
                        temp.orderId = outdata[i]['订单id']
                        temp.tag = outdata[i]['订购产品ID']
                        temp.num = outdata[i]['订购数量']
                        if(!temp.orderId) temp.orderId = this.arr[i-1].orderId
                        this.arr.push(temp)
                    }
                    this.uploadOrder()
                }
                reader.readAsArrayBuffer(f)
            }
            if(rABS) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsBinaryString(file);
            }
        },
        jsonToXml (file) {
            let reader = new FileReader()
            reader.readAsText(file)
            reader.onload = (f) => {
                let doc = this.toXML(f.target.result),
                    el = doc.getElementsByTagName("order")
                for (let i = 0; i < el.length; i++) {
                    let id = el[i].getElementsByTagName("orderId")[0].firstChild.nodeValue
                    let goods = el[i].getElementsByTagName("goods")
                    for(let j=0; j<goods.length; j++) {
                        let goodsTag = goods[j].getElementsByTagName("goodsId")[0].firstChild.nodeValue
                        let goodsNum = goods[j].getElementsByTagName("goodsNum")[0].firstChild.nodeValue
                        this.arr.push({orderId: id, tag: goodsTag, num: goodsNum})
                    }
                }
                this.uploadOrder()
            }
        },
        toXML(strxml){
            let xmlDoc
            try{ 
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
                xmlDoc.loadXML(strxml); 
            } 
            catch(e){ 
                var oParser=new DOMParser(); 
                xmlDoc=oParser.parseFromString(strxml,"text/xml")
            } 
            return xmlDoc
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
    display: flex;
    flex-direction: row;
    align-self: center;
    position: absolute;
    bottom: 80px;
}
</style>