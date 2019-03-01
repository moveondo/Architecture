<template>
  <div class="componentContainer gc-scrollbar" >
    <h3>数据绑定</h3>
    <p>以下示例展示如何绑定数据。</p>

    <div class="spreadContainer" >
      <gc-spread-sheets
        :hostClass='"spread-host"'
		@workbookInitialized='spreadInitHandle'
      >
        

      </gc-spread-sheets>
    </div>
    <div class="test-btn-list">


    </div>

  </div>
</template>
<script>
  import  '@grapecity/spread-sheets-vue'
  import DataService from '../static/dataService'
  import GC from '@grapecity/spread-sheets'

  export default {
	methods:{
		spreadInitHandle: function (spread) {
			window.mySpread = spread;
			//在这里通过spread对象调用对应方法获取对应数据,如getValue,getDataSource,getArray等
			let sheet = spread.getActiveSheet();
			let data = [{ID:"",name:"",age:""}];
			sheet.setDataSource(data);
			sheet.addRows(0,9);
			var dv1 = new GC.Spread.Sheets.DataValidation.createListValidator('Fruit,Vegetable,Food');
			dv1.inputTitle('Please choose a category:');
			dv1.inputMessage('Fruit, Vegetable, Food');
			sheet.setDataValidator(1,1, dv1);
			spread.options.highlightInvalidData = false;
			sheet.bind(GC.Spread.Sheets.Events.ValidationError, function(e, args) {
			   // do some thing.
			   var row = args.row;
			   var col = args.col;
			   alert("单元格:("+row+","+col+")校验失败");
			});
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
    right: 3px;
    overflow-y:auto ;
    overflow-x: hidden;
  }
  .spreadContainer{
    position: absolute;
    top:90px;
    padding: 10px;
    /*width: 100%;*/
    /*height: 240px;*/
    left: 10px;
    right:10px;
    bottom: 150px;
    box-shadow: 0 0 20px grey;
  }
  .test-btn-list{
    /*padding: 20px;*/
    position: absolute;
    bottom: 0px;
    height:150px;
  }
  .test-btn-list label{
    display: inline-flex;
    margin: 10px 20px;
  }
  .spread-host{
    width: 100%;
    height: 100%;
  }

</style>
