function sendReminders() {
  // スプレッドシートを取得します
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = spreadsheet.getSheetByName("settings");

  // settingsシートから各設定を取得します
  const settingsData = settingsSheet.getDataRange().getValues();
  for (let i = 1; i < settingsData.length; i++) {
    const enabled = settingsData[i][0]; // 有効/無効
    const sheetName = settingsData[i][1]; // シート名
    const webhookURL = settingsData[i][2]; // MattermostのWebhook URL

    // シートの探索が有効になっている場合のみ実行します
    if (enabled === true) {
      const targetSheet = spreadsheet.getSheetByName(sheetName);
      if (targetSheet) {
        // シートからイベント情報を取得します
        const eventRange = targetSheet.getDataRange();
        const eventValues = eventRange.getValues();

        // GASが実行された日付を取得します
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 時刻を切り捨てて日付のみにします

        // イベント情報をチェックし、条件に合致する場合はメッセージを送信します
        for (let row = 1; row < eventValues.length; row++) {
          const date = new Date(eventValues[row][0]);
          const startTime = eventValues[row][1];
          const eventTitle = sheetName;
          const book = eventValues[row][2];
          const range = eventValues[row][3];
          const remarks = eventValues[row][4] ? eventValues[row][4] : "なし";

          // 日付が合致した場合にメッセージを送信します（タイムゾーンに注意）
          if (date.getTime() === today.getTime()) {
            const message = `今日は${startTime}から${eventTitle}があります。\n書籍：${book}（範囲：${range}）\n備考：${remarks}`;
            sendToMattermost(webhookURL, message);
          }
        }
      }
    }
  }
}

function sendToMattermost(webhookURL, message) {
  const payload = { text: message };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(webhookURL, options);
}
