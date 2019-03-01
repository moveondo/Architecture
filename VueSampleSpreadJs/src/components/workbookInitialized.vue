<template>
  <div class="componentContainer" >
    <h3>导入导出</h3>
    <div>
      ExcelIO导入导出：
    </div>
    <div class="spreadContainer" >
		<div id="formulaBar" contenteditable="true" spellcheck="false" style="font-family: Calibri;border: 1px solid #808080;width:100%;"></div>
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
				let sheet = spread.getActiveSheet();
				
				
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
