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
    const discordURL = settingsData[i][3]; // DiscordのWebhook URL
    const targetSheet = spreadsheet.getSheetByName(sheetName);

    // enabledがfalseの場合または対象のシートが存在しない場合は処理をスキップします
    if (!enabled || !targetSheet) continue;

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
      const eventFlag = eventValues[row][2];
      console.log(eventFlag); // 初回実行時のデバッグ用
      const book = eventValues[row][3];
      const range = eventValues[row][4];
      const document = eventValues[row][5] ? eventValues[row][5] : "なし";
      const remarks = eventValues[row][6] ? eventValues[row][6] : "なし";

      // 日付が合致した場合にメッセージを送信します（タイムゾーンに注意）
      if (date.getTime() === today.getTime()) {
        const message = `本日${startTime}からの${eventTitle}の案内です。\n書籍：${book}（範囲：${range}）\n資料：${document}\n備考：${remarks}`;
        if (webhookURL) sendToMattermost(webhookURL, message);
        if (discordURL) sendToDiscord(discordURL, message);
      }

      // 開催フラグがTRUEで、2日後開催なら出欠確認メッセージを送信
      // 例）火曜開催なら日曜に送信
      // 出欠確認を送る何日前か（例: 2なら2日後開催分に送信）
      const ATTENDANCE_CONFIRM_DAYS_BEFORE = 2;
      const msPerDay = 24 * 60 * 60 * 1000;
      const attendanceConfirmDate = new Date(
        today.getTime() + ATTENDANCE_CONFIRM_DAYS_BEFORE * msPerDay
      );
      if (
        (eventFlag === true || eventFlag === "TRUE") &&
        date.getTime() === attendanceConfirmDate.getTime()
      ) {
        const checkMessage = `<<次回の出欠確認>>\n:sanka: :husanka: :ROM: スタンプで表明お願いします。書籍：${book}（範囲：${range}）\n確約ではないので、当日体調不良・業務都合で不参加の場合はスタンプを変えたり、やっぱり参加できませんとコメントするとかでも可。\n参加4人以上で決行です。`;
        // Mattermostには非対応
        if (discordURL) sendToDiscord(discordURL, checkMessage);
      }
    }
  }
}

function sendToMattermost(webhookURL, message) {
  const payload = {text: message};
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(webhookURL, options);
}

function sendToDiscord(webhookURL, message) {
  const payload = {content: message};
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(webhookURL, options);
}
