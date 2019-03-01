<template>
  <div class="componentContainer" >
    <h3>导入导出</h3>
    <div>
      ExcelIO导入导出：
    </div>
    <div class="spreadContainer" >
      <gc-spread-sheets
        :hostClass='"spreadHost"'
		@workbookInitialized='spreadInitHandle'
	  >

      </gc-spread-sheets>
    </div>
	<input id="export" type="button" value="export" v-on:click="exportExcel"/>
  </div>
</template>
<script>
	import  '@grapecity/spread-sheets-vue'
	import * as Excel from "@grapecity/spread-excelio"
	import GC from '@grapecity/spread-sheets'
	import * as FileSaver from "file-saver"
	export default {
		//name: 'sample-header'
		methods:{
			spreadInitHandle: function (spread) {
				window.mySpread = spread;
				//在这里通过spread对象调用对应方法获取对应数据,如getValue,getDataSource,getArray等
				let dataSource = [
				   { ID:0, Name:'A', Info1:'Info0' },
				   { ID:1, Name:'B', Info1:'Info1' },
				   { ID:2, Name:'C', Info1:'Info2' },
				];
				let sheet = spread.getActiveSheet();
				sheet.autoGenerateColumns = false;
				var IDColInfo = { name: 'ID', displayName: 'ID', size: 40, resizable: false };
				var nameColInfo = { name: 'name', displayName: 'Display Name', size: 70 };
				var Info1ColInfo = { name: 'Info1', displayName: 'Info', size: 120 };
				sheet.setDataSource(dataSource);
				
            },
			exportExcel(e){
				this.excelIO = new Excel.IO();
				//let spread = GC.Spread.Sheet
				if (window.mySpread) {
					let ssjson = window.mySpread.toJSON();
					this.excelIO.save(ssjson,(blob) => {
						FileSaver.saveAs(blob, "test.xlsx");
					}, (error) =>{
						console.log(error);
					});
				}
			}

		}
	}
	
</script>
<style scoped>
  .componentContainer {
    position: absolute;
    padding: 10px;
    left: 242px;
    top: 0;
    bottom: 20px;
    right: 0;
  }
  .spreadContainer {
    padding: 10px;
    box-shadow: 0 0 20px grey;
  }
  .spreadContainer{
    position: absolute;
    left: 0px;
    right: 30px;
    top: 260px;
    bottom: 10px;
  }
  .spreadHost{
    width: 100%;
    height: 100%;
  }


</style>
