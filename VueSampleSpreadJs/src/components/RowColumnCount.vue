<template>
  <div class="componentContainer" >
    <h3>demo</h3>
    <div>
      workbookInitialized回调函数 ：在回调函数中可以获得spread对象，根据spread对象可以调用spreadjs接口中的任何方法，从而不必遵循vue中的column设定机制
    </div>
    <div class="spreadContainer" >
      <gc-spread-sheets
        :hostClass='"spreadHost"'
		@workbookInitialized='spreadInitHandle'
	  >

      </gc-spread-sheets>
    </div>
  </div>
</template>
<script>
	import  '@grapecity/spread-sheets-vue'
	import * as Excel from "@grapecity/spread-excelio"
	import GC from '@grapecity/spread-sheets'
	import * as FileSaver from "file-saver"
	/*
	GC.Spread.Sheets.LicenseKey = Excel.LicenseKey = "yourkey";
	*/
	export default {
		//name: 'sample-header'
		data(){
		  return {
			dataSource: [
			   { name: 'Alice', age: 27, birthday: '1985/08/31', position: 'PM' }
			]
		  }
		},
		methods:{
			spreadInitHandle: function (spread) {
				window.mySpread = spread;
				//在这里通过spread对象调用对应方法获取对应数据,如getValue,getDataSource,getArray等
				let sheet = spread.getActiveSheet();
				//这里通过setRowCount,setColumnCount方法来设置显示的行数和列数
				sheet.setRowCount(50)
				sheet.setColumnCount(15);
				
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
