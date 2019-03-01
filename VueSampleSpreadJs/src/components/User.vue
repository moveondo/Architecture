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
	</div>
</template>

<script>
	import  '@grapecity/spread-sheets-vue'
	import DataService from '../static/dataService'

	export default {
		name: 'HelloWorld',
		methods: {
			spreadInitHandle: function (spread) {
				window.mySpread = spread;
				//在这里通过spread对象调用对应方法获取对应数据,如getValue,getDataSource,getArray等
				//这里通过交互去获取数据源，例子中假设数据源获取到的是下面这样
				let dataSource = [
					{ name: 'Alice', age: 27, birthday: '1985/08/31', position: 'PM' },
					{ name: 'Alice1', age: 28, birthday: '1985/08/31', position: 'PM' },
					{ name: 'Alice2', age: 29, birthday: '1985/08/31', position: 'PM' }
				];
				let sheet = spread.getActiveSheet();
				//在这里可以通过列设置来手动设置绑定
				var nameColInfo = { name: 'name', displayName: 'Display Name', size: 70 };
				var ageColInfo = { name: 'age', displayName: 'Age', size: 40, resizable: false };
				var birthdayColInfo = { name: 'birthday', displayName: 'Birthday', formatter: 'yyyy-mm-dd', size: 120 };
				var positionColInfo = { name: 'position', displayName: 'Position', size: 50, visible: false };
				sheet.autoGenerateColumns = false;
				sheet.bindColumn(0, nameColInfo);
				sheet.bindColumn(1, birthdayColInfo);
				sheet.bindColumn(2, ageColInfo);
				sheet.bindColumn(3, positionColInfo);
				
				//加载数据源
				sheet.setDataSource(dataSource);
				
            }
		}
  };
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
