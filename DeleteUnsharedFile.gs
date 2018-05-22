/* 発行したtokenを取得 */
var SLACK_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("TOKEN");

//日数をUnixTimeに変換する
function elapsedDaysToUnixTime(days) {
  var date = new Date();
  var now = Math.floor(date.getTime()/ 1000); // unixtime[sec]
  return now - 8.64e4 * days + '' // 8.64e4[sec] = 1[day] 文字列じゃないと動かないので型変換している
}


function main() {
  const days = 21;  // 遡る日数(ユーザが指定)
  
  //ファイル取得のパラメータ
  var getFile_params = {
    'token': SLACK_ACCESS_TOKEN,
    'ts_to': elapsedDaysToUnixTime(1),
    'count': 300
  }
  var getFile_options = {
    'method': 'POST',
    'payload': getFile_params
  }
  
  //ファイル削除のパラメータ
  var fileId = '';
  var deleteFile_params = {
    'token': SLACK_ACCESS_TOKEN,
    'file': fileId
  }
  var deleteFile_options = {
    'method': 'POST',
    'payload': deleteFile_params
  }
  
  //ファイルのリストを取得して、条件に合うものを削除
  var res = UrlFetchApp.fetch('https://slack.com/api/files.list',getFile_options);
  var rawList = JSON.parse(res.getContentText());
  rawList.files.forEach(
    function(val) {
      const shared_count = val.channels.length + val.ims.length + val.groups.length;
      if (shared_count == 0) {
        deleteFile_params.file = val.id;
        Logger.log(val.name + ' : ' + shared_count);
        /*注意*/
        UrlFetchApp.fetch('https://slack.com/api/files.delete',deleteFile_options);
      }
    }
  );
}

